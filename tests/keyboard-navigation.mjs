import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { chromium } from 'playwright';

function freePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      server.close(error => error ? reject(error) : resolve(address.port));
    });
  });
}

async function waitForServer(url, child) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Preview server exited with ${child.exitCode}`);
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The preview server has not started yet.
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('Timed out waiting for the preview server');
}

const port = await freePort();
const baseUrl = `http://127.0.0.1:${port}`;
const preview = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
  stdio: 'ignore',
});

try {
  await waitForServer(baseUrl, preview);
  const browser = await chromium.launch({ headless: true });
  try {
    for (const [name, viewport, previousControl] of [
      ['desktop', { width: 1366, height: 900 }, '#export-menu summary'],
      ['mobile', { width: 390, height: 844 }, '.mobile-tabs button[data-panel="preview"]'],
    ]) {
      const page = await browser.newPage({ viewport });
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      await page.locator('#source').focus();

      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement?.id), 'example-button', `${name}: Tab leaves the editor for the next control`);
      await page.keyboard.press('Shift+Tab');
      assert.equal(await page.evaluate(() => document.activeElement?.id), 'source', `${name}: Shift+Tab returns to the editor from the next control`);
      await page.keyboard.press('Shift+Tab');
      assert.equal(await page.evaluate(selector => document.activeElement === document.querySelector(selector), previousControl), true, `${name}: Shift+Tab reaches the preceding app control`);

      await page.locator('#source').focus();
      await page.locator('#source').evaluate(element => element.setSelectionRange(0, 0));
      await page.keyboard.press('Control+]');
      assert.equal((await page.locator('#source').inputValue()).startsWith('  '), true, `${name}: Ctrl+] intentionally inserts indentation`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
} finally {
  preview.kill();
}

console.log('Keyboard navigation regression passed.');

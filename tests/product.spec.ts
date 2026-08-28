import { expect, test, type Download, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function readDownload(download: Download): Promise<Buffer> {
  const stream = await download.createReadStream();
  const parts: Buffer[] = [];
  for await (const part of stream) parts.push(Buffer.from(part));
  return Buffer.concat(parts);
}

async function exportDownload(page: Page, kind: 'svg' | 'pdf' | 'png'): Promise<Buffer> {
  await page.locator('#export-menu summary').click();
  const downloadPromise = page.waitForEvent('download');
  await page.locator(`[data-export="${kind}"]`).click();
  return readDownload(await downloadPromise);
}

test('@claim:text-to-plan renders every version 1 drawing statement', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('#page-title')).toHaveText('Edit a sample floor plan');
  await expect(page.locator('#preview svg')).toBeVisible();
  await expect(page.locator('#preview svg [data-kind="wall"]')).toHaveCount(4);
  await expect(page.locator('#preview svg [data-kind="door"]')).toHaveCount(1);
  await expect(page.locator('#preview svg [data-kind="window"]')).toHaveCount(2);
  await expect(page.locator('#preview svg [data-kind="label"]')).toHaveCount(2);
  await expect(page.locator('#preview svg [data-kind="dimension"]')).toHaveCount(2);
  await expect(page.locator('#preview svg')).toContainText('Floorplan Text DSL v1');
});

test('@claim:svg-export exports vector SVG with physical size', async ({ page }) => {
  await page.goto('/demo');
  const data = (await exportDownload(page, 'svg')).toString('utf8');
  expect(data).toContain('<svg');
  expect(data).toContain('width="420mm" height="297mm"');
  expect(data).toContain('data-kind="wall"');
  expect(data).not.toContain('<image');
});

test('@claim:pdf-export exports a one-page vector PDF at paper size', async ({ page }) => {
  await page.goto('/demo');
  const data = (await exportDownload(page, 'pdf')).toString('latin1');
  expect(data).toContain('%PDF-1.4');
  expect(data).toContain('/Count 1');
  expect(data).toContain('/MediaBox [0 0 1190.551 841.890]');
  expect(data).not.toContain('/Subtype /Image');
});

test('@claim:png-export exports A3 pixels at 300 DPI', async ({ page }) => {
  await page.goto('/demo');
  const data = await exportDownload(page, 'png');
  expect(data.subarray(1, 4).toString()).toBe('PNG');
  expect(data.readUInt32BE(16)).toBe(4961);
  expect(data.readUInt32BE(20)).toBe(3508);
});

test('@claim:true-scale calculates dimensions and sheet fit', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('#fit-info')).toHaveText('Fits the sheet at full scale');
  const svg = await exportDownload(page, 'svg');
  expect(svg.toString()).toContain('>600 cm<');
  expect(600 * 10 / 50).toBe(120);
  await page.locator('#source').fill('plan v1\nunits cm\nscale 1:50\nsheet A4 portrait\nwall long from 0,0 to 2000,0 thickness 10');
  await expect(page.locator('#fit-info')).toContainText('Too large by');
});

test('@claim:offline-editor reloads, edits, exports, and shares offline', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/demo');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#offline-banner')).toBeVisible();
  await page.locator('#source').fill('plan v1\ntitle "Offline shed"\nunits cm\nscale 1:50\nsheet A4 landscape\nwall edge from 0,0 to 300,0 thickness 10');
  await expect(page.locator('#preview svg')).toContainText('Offline shed');
  expect((await exportDownload(page, 'svg')).toString()).toContain('Offline shed');
  await page.locator('#share-button').click();
  await expect(page.locator('#toast')).toContainText('Share link copied');
});

test('@claim:private-browser keeps the full demo flow same-origin and cookie-free', async ({ page, context }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/demo');
  await page.locator('#source').fill('plan v1\ntitle "PRIVATE MARKER 7491"\nwall edge from 0,0 to 100,0 thickness 10');
  await page.locator('#syntax-button').click();
  await page.keyboard.press('Escape');
  await exportDownload(page, 'svg');
  await page.locator('#share-button').click();
  expect(await context.cookies()).toHaveLength(0);
  expect(requests.every(url => new URL(url).origin === new URL(page.url()).origin)).toBe(true);
  expect(requests.every(url => !url.includes('PRIVATE') && !url.includes('7491'))).toBe(true);
});

test('@claim:demo-isolation never reads or writes the real plan key', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('floorplan-text-source', 'plan v1\ntitle "REAL PLAN"'));
  await page.goto('/demo');
  await expect(page.locator('#demo-banner')).toContainText('Demo — sample data');
  await expect(page.locator('#source')).not.toHaveValue(/REAL PLAN/);
  await page.locator('#source').fill('plan v1\ntitle "DEMO ONLY"\nwall edge from 0,0 to 100,0 thickness 10');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('demo:floorplan-text-source'))).toContain('DEMO ONLY');
  expect(await page.evaluate(() => localStorage.getItem('floorplan-text-source'))).toContain('REAL PLAN');
  await page.locator('#reset-demo').click();
  await expect(page.locator('#source')).toHaveValue(/Garden studio/);
  expect(await page.evaluate(() => localStorage.getItem('floorplan-text-source'))).toContain('REAL PLAN');
  await page.locator('#start-real').click();
  await expect(page.locator('#source')).toHaveValue(/REAL PLAN/);
  expect(await page.evaluate(() => localStorage.getItem('demo:floorplan-text-source'))).toBeNull();
});

test('@claim:local-autosave restores edits inside the selected workspace', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('#source').fill('plan v1\ntitle "Saved demo"\nwall edge from 0,0 to 100,0 thickness 10');
  await expect(page.locator('#save-state')).toHaveText('Saved only in this demo');
  await page.reload();
  await expect(page.locator('#source')).toHaveValue(/Saved demo/);
});

test('@claim:units-and-paper accepts every listed unit, sheet, and orientation', async ({ page }) => {
  await page.goto('/demo');
  for (const unit of ['mm', 'cm', 'm', 'in', 'ft']) {
    for (const paper of ['A4', 'A3', 'A2', 'Letter', 'Tabloid']) {
      for (const orientation of ['portrait', 'landscape']) {
        await page.locator('#source').fill(`plan v1\nunits ${unit}\nscale 1:50\nsheet ${paper} ${orientation}\nwall edge from 0,0 to 1,0 thickness .1`);
        await expect(page.locator('#error-summary')).toBeHidden();
        await expect(page.locator('#sheet-info')).toContainText(`${paper} ${orientation}`);
      }
    }
  }
});

test('@claim:live-validation reports lines and retains the last valid preview', async ({ page }) => {
  await page.goto('/demo');
  const before = await page.locator('#preview').innerHTML();
  await page.locator('#source').fill('plan v1\nbanana');
  await expect(page.locator('#error-summary')).toContainText('Error · line 2');
  expect(await page.locator('#preview').innerHTML()).toBe(before);
  await page.locator('#source').fill('plan v1\ntitle "Recovered"\nwall edge from 0,0 to 100,0 thickness 10');
  await expect(page.locator('#error-summary')).toBeHidden();
  await expect(page.locator('#preview svg')).toContainText('Recovered');
});

test('@claim:file-and-link-sharing imports, saves, and restores ordinary text', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/demo');
  const plan = 'plan v1\ntitle "Imported plan"\nunits cm\nwall edge from 0,0 to 100,0 thickness 10';
  const chooserPromise = page.waitForEvent('filechooser');
  await page.locator('#open-button').click();
  const chooser = await chooserPromise;
  await chooser.setFiles({ name: 'imported.floorplan', mimeType: 'text/plain', buffer: Buffer.from(plan) });
  await expect(page.locator('#source')).toHaveValue(plan);
  const saved = await readDownload(await Promise.all([page.waitForEvent('download'), page.locator('#save-button').click()]).then(([download]) => download));
  expect(saved.toString()).toBe(plan);
  await page.locator('#share-button').click();
  const shared = await page.evaluate(() => navigator.clipboard.readText());
  expect(shared).toContain('/demo#plan=');
  const second = await context.newPage();
  await second.goto(shared);
  await expect(second.locator('#source')).toHaveValue(plan);
});

test('@claim:mobile-keyboard provides mobile tabs and complete keyboard escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await expect(page.locator('.mobile-tabs')).toBeVisible();
  await expect(page.locator('[data-panel-name="preview"]')).toBeVisible();
  await page.locator('.mobile-tabs [data-panel="source"]').click();
  await page.locator('#source').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#example-button')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#source')).toBeFocused();
  await page.locator('#syntax-button').click();
  await expect(page.locator('#syntax-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#syntax-dialog')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('@claim:free-mit serves the stated license from the demo', async ({ page }) => {
  await page.goto('/demo');
  const response = await page.request.get('/LICENSE.txt');
  expect(response.ok()).toBe(true);
  expect(await response.text()).toContain('MIT License');
});

test('first screen names the job, audience, first action, and outcome', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Draw a scaled floor plan from text');
  await expect(page.locator('#page-summary')).toContainText('renters, DIYers, landlords, and engineers');
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await expect(page.locator('#hero-actions')).toContainText('Garden studio plan');
  await page.screenshot({ path: '.factory/evidence/first-screen-mobile.png', fullPage: false });
});

test('routes update URL, title, focus, history, and unknown-page UI', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page).toHaveTitle('Privacy — Floorplan Text');
  await expect(page.locator('h1')).toHaveText('Privacy');
  await expect(page.locator('h1')).toBeFocused();
  await page.goBack();
  await expect(page).toHaveTitle('Floorplan Text — Draw scaled plans from text');
  await page.goto('/not-a-real-page');
  await expect(page).toHaveTitle('Page not found — Floorplan Text');
  await expect(page.locator('h1')).toHaveText('This page is not in the plan');
  await expect(page.getByRole('link', { name: 'Open the editor' })).toBeVisible();
});

test('all routes have accessible structure and no serious axe findings', async ({ page }) => {
  for (const route of ['/', '/demo', '/privacy', '/terms', '/not-a-real-page']) {
    await page.goto(route);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter(item => item.impact === 'serious' || item.impact === 'critical')).toEqual([]);
  }
});

test('visible page sentences use plain words and stay within 22 words', async ({ page }) => {
  const banned = /\b(leverage|seamless|effortless|robust|powerful|intuitive|reimagine|supercharge|unlock|delightful|journey|ecosystem|AI-powered)\b/i;
  for (const route of ['/', '/demo', '/privacy', '/terms', '/not-a-real-page']) {
    await page.goto(route);
    const prose = await page.locator('h1, h2, h3, p, li').allInnerTexts();
    for (const block of prose) {
      for (const sentence of block.split(/(?<=[.!?])\s+/).filter(Boolean)) {
        expect(sentence, `${route}: banned word in “${sentence}”`).not.toMatch(banned);
        expect(sentence.trim().split(/\s+/).length, `${route}: over 22 words in “${sentence}”`).toBeLessThanOrEqual(22);
      }
    }
  }
});

test('@keyboard editor Tab and Shift+Tab reach adjacent controls', async ({ page }) => {
  for (const viewport of [{ width: 1366, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/demo');
    if (viewport.width < 820) await page.locator('[data-panel="source"]').click();
    await page.locator('#source').focus();
    await page.keyboard.press('Tab');
    await expect(page.locator('#example-button')).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(page.locator('#source')).toBeFocused();
  }
});

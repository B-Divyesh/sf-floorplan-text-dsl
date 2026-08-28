import { expect, test, type Download, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { existsSync, readFileSync, statSync } from 'node:fs';

interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const PT_PER_MM = 72 / 25.4;

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

function segmentsInSvgGroup(svg: string, className: string, id?: string): Segment[] {
  const idPattern = id ? `[^>]*data-id="${id}"` : '';
  const group = svg.match(new RegExp(`<g class="${className}"${idPattern}[^>]*>([\\s\\S]*?)<\\/g>`));
  if (!group) throw new Error(`Missing ${className}${id ? ` ${id}` : ''} SVG group`);
  return [...group[1].matchAll(/<line x1="([\d.-]+)" y1="([\d.-]+)" x2="([\d.-]+)" y2="([\d.-]+)"/g)].map(match => ({
    x1: Number(match[1]), y1: Number(match[2]), x2: Number(match[3]), y2: Number(match[4]),
  }));
}

function allSvgGroups(svg: string, className: string): Segment[][] {
  return [...svg.matchAll(new RegExp(`<g class="${className}"[^>]*>([\\s\\S]*?)<\\/g>`, 'g'))].map(group =>
    [...group[1].matchAll(/<line x1="([\d.-]+)" y1="([\d.-]+)" x2="([\d.-]+)" y2="([\d.-]+)"/g)].map(match => ({
      x1: Number(match[1]), y1: Number(match[2]), x2: Number(match[3]), y2: Number(match[4]),
    })),
  );
}

function segmentLength(segment: Segment): number {
  return Math.hypot(segment.x2 - segment.x1, segment.y2 - segment.y1);
}

function pdfInkSegments(pdf: string): Segment[] {
  return [...pdf.matchAll(/0\.090 0\.169 0\.208 RG [\d.-]+ w ([\d.-]+) ([\d.-]+) m ([\d.-]+) ([\d.-]+) l S/g)].map(match => ({
    x1: Number(match[1]), y1: Number(match[2]), x2: Number(match[3]), y2: Number(match[4]),
  }));
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
  await expect(page.locator('#preview svg')).toContainText('Floorplan Text format version 1');
});

test('@claim:svg-export exports vector SVG with physical size', async ({ page }) => {
  await page.goto('/demo');
  const data = (await exportDownload(page, 'svg')).toString('utf8');
  expect(data).toContain('<svg');
  expect(data).toContain('width="420mm" height="297mm"');
  expect(data).toContain('data-kind="wall"');
  expect(data).not.toContain('<image');
  expect(await page.evaluate(svg => {
    const document = new DOMParser().parseFromString(svg, 'image/svg+xml');
    const wall = document.querySelector('[data-kind="wall"]');
    wall?.setAttribute('data-edited', 'true');
    return new XMLSerializer().serializeToString(document).includes('data-edited="true"');
  }, data)).toBe(true);
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
  const svg = (await exportDownload(page, 'svg')).toString('utf8');
  expect(svg).toContain('>600 cm<');
  const svgWall = segmentsInSvgGroup(svg, 'wall', 'north')[0];
  expect(Math.abs(segmentLength(svgWall) - 120)).toBeLessThanOrEqual(0.01);

  const pdf = (await exportDownload(page, 'pdf')).toString('latin1');
  const pdfWall = pdfInkSegments(pdf)[0];
  expect(Math.abs(segmentLength(pdfWall) / PT_PER_MM - 120)).toBeLessThanOrEqual(0.01);

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
  await expect(page.locator('#preview svg')).toBeVisible();
  await expect(page.locator('input[type="password"], [data-account], [data-api-key]')).toHaveCount(0);
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
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Floorplan Text');
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

test('@claim:demo-sample opens the named sample and rendered plan', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Floorplan Text');
  await expect(page.locator('#demo-banner')).toBeVisible();
  await expect(page.locator('#source')).toHaveValue(/title "Garden studio"/);
  await expect(page.locator('#preview svg')).toContainText('Garden studio');
  await expect(page.locator('#preview svg [data-kind="wall"]')).toHaveCount(4);
  await expect(page.locator('#object-count')).toContainText('11 objects');
  await page.screenshot({ path: '.factory/evidence/polish-3-demo-desktop.png', fullPage: false });
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
  const equivalentMetres: Record<string, number> = { mm: 1000, cm: 100, m: 1, in: 39.37007874, ft: 3.280839895 };
  for (const [unit, length] of Object.entries(equivalentMetres)) {
    await page.locator('#source').fill(`plan v1\nunits ${unit}\nscale 1:10\nsheet A4 landscape\nwall edge from 0,0 to ${length},0 thickness ${length / 100}`);
    await expect(page.locator('#sheet-info')).toContainText(`1:10 · ${unit}`);
    const svg = (await exportDownload(page, 'svg')).toString('utf8');
    const wall = segmentsInSvgGroup(svg, 'wall', 'edge')[0];
    expect(Math.abs(segmentLength(wall) - 100), `${unit} should render one metre as 100 mm at 1:10`).toBeLessThanOrEqual(0.01);

    for (const paper of ['A4', 'A3', 'A2', 'Letter', 'Tabloid']) {
      for (const orientation of ['portrait', 'landscape']) {
        await page.locator('#source').fill(`plan v1\nunits ${unit}\nscale 1:50\nsheet ${paper} ${orientation}\nwall edge from 0,0 to 1,0 thickness .1`);
        await expect(page.locator('#error-summary')).toBeHidden();
        await expect(page.locator('#sheet-info')).toContainText(`${paper} ${orientation}`);
      }
    }
  }
});

test('@claim:geometry-semantics positions openings from wall starts and dimensions perpendicular to their direction', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('#source').fill([
    'plan v1',
    'title "Geometry check"',
    'units cm',
    'scale 1:10',
    'sheet A3 landscape',
    'wall horizontal from 0,0 to 100,0 thickness 2',
    'wall vertical from 0,40 to 0,140 thickness 2',
    'wall reversed from 100,180 to 0,180 thickness 2',
    'door horizontalDoor on horizontal at 10 width 20 swing left',
    'window verticalWindow on vertical at 15 width 25',
    'door reversedDoor on reversed at 30 width 20 swing right',
    'dimension from 20,200 to 80,240 offset 10',
    'dimension from 20,200 to 80,240 offset -10',
  ].join('\n'));
  await expect(page.locator('#preview svg')).toContainText('Geometry check');
  await expect(page.locator('#error-summary')).toBeHidden();
  const svg = (await exportDownload(page, 'svg')).toString('utf8');

  for (const [wallId, openingClass, openingId, expectedStart, expectedWidth] of [
    ['horizontal', 'door', 'horizontalDoor', 10, 20],
    ['vertical', 'window', 'verticalWindow', 15, 25],
    ['reversed', 'door', 'reversedDoor', 30, 20],
  ] as const) {
    const wall = segmentsInSvgGroup(svg, 'wall', wallId)[0];
    const opening = segmentsInSvgGroup(svg, openingClass, openingId)[0];
    const wallLength = segmentLength(wall);
    const ux = (wall.x2 - wall.x1) / wallLength;
    const uy = (wall.y2 - wall.y1) / wallLength;
    const start = (opening.x1 - wall.x1) * ux + (opening.y1 - wall.y1) * uy;
    const width = (opening.x2 - opening.x1) * ux + (opening.y2 - opening.y1) * uy;
    expect(Math.abs(start - expectedStart), `${openingId} starts from the wall's first point`).toBeLessThanOrEqual(0.01);
    expect(Math.abs(width - expectedWidth), `${openingId} keeps its requested width`).toBeLessThanOrEqual(0.01);
  }

  const dimensions = allSvgGroups(svg, 'dimension');
  expect(dimensions).toHaveLength(2);
  for (const [index, expectedOffset] of [10, -10].entries()) {
    const [startExtension, endExtension, dimensionLine] = dimensions[index];
    const vx = endExtension.x1 - startExtension.x1;
    const vy = endExtension.y1 - startExtension.y1;
    const length = Math.hypot(vx, vy);
    const ox = dimensionLine.x1 - startExtension.x1;
    const oy = dimensionLine.y1 - startExtension.y1;
    const dot = (vx * ox + vy * oy) / length;
    const signedOffset = (vx * oy - vy * ox) / length;
    expect(Math.abs(dot), 'dimension offset stays perpendicular').toBeLessThanOrEqual(0.01);
    expect(Math.abs(signedOffset - expectedOffset), 'dimension offset keeps its sign and distance').toBeLessThanOrEqual(0.01);
    expect(Math.abs(segmentLength(dimensionLine) - length), 'dimension line keeps the measured length').toBeLessThanOrEqual(0.01);
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

test('@claim:keyboard-shortcuts supports Control and Command for render, save, and indent', async ({ page }) => {
  await page.goto('/demo');
  for (const modifier of ['Control', 'Meta']) {
    const plan = `plan v1\ntitle "${modifier} shortcut plan"\nwall edge from 0,0 to 100,0 thickness 10`;
    await page.locator('#source').fill(plan);
    await page.locator('#source').press(`${modifier}+Enter`);
    await expect(page.locator('#toast')).toContainText('Preview rendered');
    await expect(page.locator('#preview svg')).toContainText(`${modifier} shortcut plan`);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#source').press(`${modifier}+s`);
    const saved = await readDownload(await downloadPromise);
    expect(saved.toString()).toBe(plan);

    await page.locator('#source').fill('wall');
    await page.locator('#source').evaluate((element: HTMLTextAreaElement) => element.setSelectionRange(2, 2));
    await page.locator('#source').press(`${modifier}+]`);
    await expect(page.locator('#source')).toHaveValue('wa  ll');
  }

  await page.locator('#syntax-button').click();
  await expect(page.locator('#syntax-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#syntax-dialog')).toBeHidden();
});

test('@claim:free-mit serves the stated license from the demo', async ({ page }) => {
  await page.goto('/demo');
  const response = await page.request.get('/LICENSE.txt');
  expect(response.ok()).toBe(true);
  expect(await response.text()).toContain('MIT License');
});

test('@claim:asset-provenance ships the recorded original notebook artwork', async ({ page }) => {
  await page.goto('/demo');
  const image = await page.request.get('/assets/notebook-floorplan.webp');
  expect(image.ok()).toBe(true);
  expect((await image.body()).byteLength).toBeGreaterThan(10_000);
  const provenance = JSON.parse(readFileSync('assets/src/notebook-floorplan.prompt.json', 'utf8')) as Record<string, string>;
  expect(provenance.asset).toBe('notebook-floorplan.png');
  expect(provenance.generated).toBe('2026-08-27');
  expect(provenance.model).toContain('Azure OpenAI image deployment');
  expect(provenance.prompt).toContain('engineer field notebook');
  expect(provenance.review).toContain('Accepted');
  expect(readFileSync('.factory/design.md', 'utf8')).toContain('notebook-floorplan');
  expect(statSync('assets/src/notebook-floorplan.png').size).toBeGreaterThan(100_000);
});

test('@claim:build-output creates the complete static site in dist', async () => {
  for (const path of ['dist/index.html', 'dist/staticwebapp.config.json', 'dist/privacy/index.html', 'dist/terms/index.html', 'dist/404.html']) {
    expect(existsSync(path), `${path} should exist after npm run build`).toBe(true);
  }
  const config = JSON.parse(readFileSync('dist/staticwebapp.config.json', 'utf8'));
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
});

test('first screen names the job, audience, first action, and outcome', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Draw a scaled floor plan from text');
  await expect(page.locator('#page-summary')).toContainText('renters, DIYers, landlords, and engineers');
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await expect(page.locator('#hero-actions')).toContainText('Opens the Garden studio sample');
  await expect(page.locator('.brand')).toContainText(/Floorplan\s*Text/);
  await expect(page.locator('.brand span')).toBeVisible();
  await page.screenshot({ path: '.factory/evidence/polish-3-first-screen-mobile.png', fullPage: false });
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.locator('#demo-banner')).toBeVisible();
  await expect(page.locator('#preview svg')).toContainText('Garden studio');
  await page.screenshot({ path: '.factory/evidence/polish-3-demo-mobile.png', fullPage: false });
});

test('landing explains the workflow, limits, and browser storage', async ({ page }) => {
  await page.goto('/');
  const guide = page.locator('#landing-guide');
  await expect(guide.getByRole('heading', { name: 'Make a scaled plan in three steps' })).toBeVisible();
  await expect(guide.locator('.workflow-guide li')).toHaveCount(3);
  await expect(guide).toContainText('Type walls and measurements');
  await expect(guide).toContainText('Check the scaled preview');
  await expect(guide).toContainText('Export SVG, PDF, or PNG');
  await expect(guide.getByRole('heading', { name: 'What Floorplan Text does not check' })).toBeVisible();
  await expect(guide).toContainText('It does not check building codes, structure, or site measurements.');
  await expect(guide).toContainText('Valid plan text stays in this browser.');
  await guide.screenshot({ path: '.factory/evidence/polish-3-landing-sections.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(guide.getByRole('heading', { name: 'What Floorplan Text does not check' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '.factory/evidence/polish-3-root-mobile-full.png', fullPage: true });
});

test('routes update URL, title, focus, history, and unknown-page UI', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const footerPrivacy = page.locator('footer a[href="/privacy"]');
  await footerPrivacy.scrollIntoViewIfNeeded();
  await footerPrivacy.focus();
  const returnScrollY = await page.evaluate(() => window.scrollY);
  expect(returnScrollY).toBeGreaterThan(500);
  await footerPrivacy.click();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page).toHaveTitle('Privacy — Floorplan Text');
  await expect(page.locator('h1')).toHaveText('Privacy');
  await expect(page.locator('h1')).toBeFocused();
  await page.goBack();
  await expect(page).toHaveTitle('Floorplan Text — Draw scaled plans from text');
  await expect(footerPrivacy).toBeFocused();
  await expect(footerPrivacy).toBeInViewport();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(returnScrollY);
  await page.goto('/not-a-real-page');
  await expect(page).toHaveTitle('Page not found — Floorplan Text');
  await expect(page.locator('h1')).toHaveText('This page is not in the plan');
  await expect(page.getByRole('link', { name: 'Open the editor' })).toBeVisible();
});

test('cold and in-app routes share the same header and footer contract', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const shell = async () => page.evaluate(() => ({
    brand: document.querySelector('.brand')?.textContent?.replace(/\s+/g, ' ').trim(),
    brandMark: document.querySelectorAll('.brand svg').length,
    headerLinks: [...document.querySelectorAll<HTMLElement>('.site-header nav a')].map(link => [link.textContent?.trim(), link.getAttribute('href')]),
    footerParagraphs: [...document.querySelectorAll<HTMLElement>('.site-footer > p')].map(item => item.textContent?.replace(/\s+/g, ' ').trim()),
    footerLinks: [...document.querySelectorAll<HTMLElement>('.site-footer nav a')].map(link => [link.textContent?.replace(/\s+/g, ' ').trim(), link.getAttribute('href')]),
  }));

  for (const [route, coldRoute, linkName] of [
    ['/privacy', '/privacy/index.html', 'Privacy'],
    ['/terms', '/terms/index.html', 'Terms'],
    ['/demo', '/demo', 'Demo'],
  ] as const) {
    await page.goto(coldRoute);
    const coldShell = await shell();
    await page.goto('/');
    await page.getByRole('link', { name: linkName, exact: true }).first().click();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    expect(await shell()).toEqual(coldShell);
  }

  await page.goto('/404.html');
  const cold404Shell = await shell();
  await page.goto('/');
  await page.evaluate(() => {
    history.pushState({}, '', '/missing-in-app');
    dispatchEvent(new PopStateEvent('popstate', { state: {} }));
  });
  await expect(page).toHaveTitle('Page not found — Floorplan Text');
  expect(await shell()).toEqual(cold404Shell);
  await page.screenshot({ path: '.factory/evidence/polish-3-404-mobile.png', fullPage: true });
});

test('routes expose complete metadata, legal links, and the static 404 contract', async ({ page }) => {
  const routes = [
    ['/', 'Floorplan Text — Draw scaled plans from text', 'https://floorplan-text-dsl.sociobot.in/'],
    ['/demo', 'Demo — Floorplan Text', 'https://floorplan-text-dsl.sociobot.in/demo'],
    ['/privacy', 'Privacy — Floorplan Text', 'https://floorplan-text-dsl.sociobot.in/privacy'],
    ['/terms', 'Terms — Floorplan Text', 'https://floorplan-text-dsl.sociobot.in/terms'],
    ['/not-a-real-page', 'Page not found — Floorplan Text', 'https://floorplan-text-dsl.sociobot.in/404'],
  ] as const;

  for (const [route, title, canonical] of routes) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /^.{1,155}$/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/assets\/social-preview\.jpg$/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('footer a[href="/privacy"]')).toBeVisible();
    await expect(page.locator('footer a[href="/terms"]')).toBeVisible();
  }

  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Floorplan Text');
  await expect(page.locator('#demo-banner')).toBeVisible();

  const config = JSON.parse(readFileSync('staticwebapp.config.json', 'utf8'));
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
});

test('each registered claim has exactly one tagged browser test', async () => {
  const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as Array<{ id: string; test: string }>;
  const suite = readFileSync('tests/product.spec.ts', 'utf8');
  expect(claims).toHaveLength(19);
  expect(new Set(claims.map(item => item.id)).size).toBe(claims.length);
  for (const claim of claims) {
    const tag = `@claim:${claim.id}`;
    expect(claim.test).toContain(`--grep ${tag}`);
    expect(suite.split(tag)).toHaveLength(2);
  }
});

test('all routes pass axe at desktop and 390px mobile sizes', async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const route of ['/', '/demo', '/privacy', '/terms', '/not-a-real-page', '/privacy/index.html', '/terms/index.html', '/404.html']) {
      await page.goto(route);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('main')).toHaveCount(1);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations, `${route} at ${viewport.width}px`).toEqual([]);
    }
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

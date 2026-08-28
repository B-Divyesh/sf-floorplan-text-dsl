import './style.css';
import { EXAMPLE } from './example';
import { parse } from './parser';
import { renderSvg } from './renderer';
import { makePdf } from './pdf';

const REAL_KEY = 'floorplan-text-source';
const DEMO_KEY = 'demo:floorplan-text-source';
const SITE = 'https://floorplan-text-dsl.sociobot.in';

const source = document.querySelector<HTMLTextAreaElement>('#source')!;
const preview = document.querySelector<HTMLDivElement>('#preview')!;
const emptyPreview = document.querySelector<HTMLDivElement>('#empty-preview')!;
const lineNumbers = document.querySelector<HTMLDivElement>('#line-numbers')!;
const issueSummary = document.querySelector<HTMLDivElement>('#error-summary')!;
const objectCount = document.querySelector<HTMLSpanElement>('#object-count')!;
const sheetInfo = document.querySelector<HTMLSpanElement>('#sheet-info')!;
const fitInfo = document.querySelector<HTMLSpanElement>('#fit-info')!;
const saveState = document.querySelector<HTMLSpanElement>('#save-state')!;
const toast = document.querySelector<HTMLDivElement>('#toast')!;
const fileInput = document.querySelector<HTMLInputElement>('#file-input')!;
const syntaxDialog = document.querySelector<HTMLDialogElement>('#syntax-dialog')!;
const offlineBanner = document.querySelector<HTMLElement>('#offline-banner')!;
const editorRoute = document.querySelector<HTMLElement>('#editor-route')!;
const contentRoute = document.querySelector<HTMLElement>('#content-route')!;
const demoBanner = document.querySelector<HTMLElement>('#demo-banner')!;
const pageTitle = document.querySelector<HTMLHeadingElement>('#page-title')!;
const pageKicker = document.querySelector<HTMLElement>('#page-kicker')!;
const pageSummary = document.querySelector<HTMLElement>('#page-summary')!;
const heroActions = document.querySelector<HTMLElement>('#hero-actions')!;
const plainFacts = document.querySelector<HTMLElement>('#plain-facts')!;
const routeAnnouncer = document.querySelector<HTMLElement>('#route-announcer')!;

let renderTimer = 0;
let toastTimer = 0;
let lastValid = parse(EXAMPLE).plan;
let demoMode = false;

const ROUTES: Record<string, { title: string; description: string; kicker: string }> = {
  '/': {
    title: 'Floorplan Text — Draw scaled plans from text',
    description: 'Draw a scaled floor plan from text and export it as SVG, PDF, or PNG.',
    kicker: 'Scaled floor-plan editor',
  },
  '/demo': {
    title: 'Demo — Floorplan Text',
    description: 'Try the Garden studio floor plan in an isolated sample workspace.',
    kicker: 'Isolated sample workspace',
  },
  '/privacy': {
    title: 'Privacy — Floorplan Text',
    description: 'How Floorplan Text stores plan text and protects your privacy.',
    kicker: 'Plain-language policy',
  },
  '/terms': {
    title: 'Terms — Floorplan Text',
    description: 'Terms for using the free Floorplan Text drafting utility.',
    kicker: 'Plain-language terms',
  },
  '/404': {
    title: 'Page not found — Floorplan Text',
    description: 'The requested Floorplan Text page could not be found.',
    kicker: 'Wrong turn in the notebook',
  },
};

function normalPath(): string {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/demo' || new URLSearchParams(location.search).get('demo') === '1') return '/demo';
  return ROUTES[path] ? path : '/404';
}

function fromHash(): string | null {
  if (!location.hash.startsWith('#plan=')) return null;
  try {
    const encoded = location.hash.slice(6).replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(encoded), char => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

function toHash(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function storageKey(): string {
  return demoMode ? DEMO_KEY : REAL_KEY;
}

function initialSource(): string {
  const shared = fromHash();
  if (shared !== null) return shared;
  return localStorage.getItem(storageKey()) ?? EXAMPLE;
}

function setMeta(route: string): void {
  const meta = ROUTES[route];
  const canonicalPath = route === '/404' ? '/404' : route;
  document.title = meta.title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content = meta.description;
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = SITE + (canonicalPath === '/' ? '/' : canonicalPath);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')!.content = meta.title;
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')!.content = meta.description;
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')!.content = SITE + (canonicalPath === '/' ? '/' : canonicalPath);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')!.content = meta.title;
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')!.content = meta.description;
}

function privacyMarkup(): string {
  return `<p class="effective">Effective 28 August 2026</p>
    <p>Your floor plan is yours. The editor does not send plan text, drawings, filenames, or clipboard contents to us.</p>
    <h2>What this browser stores</h2>
    <p>Your latest plan text stays in this browser so it survives a refresh. The offline app files may stay in its cache.</p>
    <p>Demo changes use a separate <code>demo:</code> storage area. Leaving the demo removes them without reading or changing your plan.</p>
    <h2>What a share link contains</h2>
    <p>A share link puts the complete plan after the address’s <code>#</code> mark. Browsers do not send that part to a server.</p>
    <p>Anyone with the link can read the plan. Treat the link like the source file.</p>
    <h2>What we do not use</h2>
    <p>This release has no accounts, cookies, analytics, advertising, tracking pixels, remote fonts, or third-party scripts.</p>
    <h2>Remove stored data</h2>
    <p>Use your browser’s site-data controls to remove saved plan text and offline files.</p>
    <h2>Questions</h2>
    <p>Open an issue in the <a href="https://github.com/B-Divyesh/sf-floorplan-text-dsl">public source repository <span class="visually-hidden">(external)</span></a>.</p>`;
}

function termsMarkup(): string {
  return `<p class="effective">Effective 28 August 2026</p>
    <p>Floorplan Text is a free drafting utility. You may use, copy, and modify it under the MIT License.</p>
    <h2>Your responsibility</h2>
    <p>Exports reproduce the coordinates and scale you enter. Check dimensions, printer settings, site conditions, permissions, and local rules.</p>
    <h2>Not professional advice</h2>
    <p>The tool does not check structure, accessibility, utilities, fire safety, planning rules, or building codes.</p>
    <p>It does not replace a qualified architect, engineer, surveyor, contractor, or local authority.</p>
    <h2>No warranty</h2>
    <p>The software is provided “as is”, without warranty. The authors are not liable for losses where the law permits.</p>
    <h2>Your content</h2>
    <p>You retain rights to your plan text and drawings. We do not receive them unless you share them outside this application.</p>`;
}

function setMobilePanel(name: 'source' | 'preview'): void {
  document.querySelectorAll<HTMLButtonElement>('.mobile-tabs button').forEach(tab => {
    const active = tab.dataset.panel === name;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll<HTMLElement>('[data-panel-name]').forEach(panel => {
    panel.classList.toggle('active', panel.dataset.panelName === name);
  });
}

function showRoute(focus = false): void {
  const route = normalPath();
  const wasDemo = demoMode;
  demoMode = route === '/demo';
  if (wasDemo && !demoMode) localStorage.removeItem(DEMO_KEY);
  setMeta(route);
  pageKicker.textContent = ROUTES[route].kicker;
  editorRoute.hidden = route !== '/' && route !== '/demo';
  contentRoute.hidden = route === '/' || route === '/demo';
  demoBanner.hidden = !demoMode;
  heroActions.hidden = route !== '/';
  plainFacts.hidden = route !== '/';

  if (route === '/') {
    pageTitle.textContent = 'Draw a scaled floor plan from text';
    pageSummary.textContent = 'For renters, DIYers, landlords, and engineers who need a printable measured plan without CAD.';
  } else if (route === '/demo') {
    pageTitle.textContent = 'Edit a sample floor plan';
    pageSummary.textContent = 'The Garden studio is ready to edit, preview, and export in a separate demo workspace.';
  } else if (route === '/privacy') {
    pageTitle.textContent = 'Privacy';
    pageSummary.textContent = 'Your plan stays under your control.';
    contentRoute.innerHTML = privacyMarkup();
  } else if (route === '/terms') {
    pageTitle.textContent = 'Terms';
    pageSummary.textContent = 'Use the tool freely, and check every measurement.';
    contentRoute.innerHTML = termsMarkup();
  } else {
    pageTitle.textContent = 'This page is not in the plan';
    pageSummary.textContent = 'The address may be wrong, or the page may have moved.';
    contentRoute.innerHTML = '<div class="not-found-mark" aria-hidden="true">404</div><p><a class="primary-action" href="/" data-route>Open the editor</a></p>';
    bindRouteLinks();
  }

  if (route === '/' || route === '/demo') {
    source.value = initialSource();
    render();
    setMobilePanel(demoMode ? 'preview' : 'source');
  }
  document.querySelectorAll<HTMLElement>('[data-route]').forEach(link => {
    const href = link.getAttribute('href');
    link.toggleAttribute('aria-current', href === route);
  });
  if (focus) {
    pageTitle.focus({ preventScroll: true });
    pageTitle.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    routeAnnouncer.textContent = pageTitle.textContent + ' page';
  }
}

function go(path: string): void {
  history.pushState({}, '', path);
  showRoute(true);
}

function bindRouteLinks(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[data-route]').forEach(link => {
    if (link.dataset.bound) return;
    link.dataset.bound = 'true';
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      go(link.pathname + link.search + link.hash);
    });
  });
}

function render(): void {
  const result = parse(source.value);
  const errors = result.issues.filter(issue => issue.severity === 'error');
  updateLines();
  if (errors.length === 0) {
    lastValid = result.plan;
    const rendered = renderSvg(result.plan);
    preview.innerHTML = rendered.svg;
    preview.hidden = result.plan.items.length === 0;
    emptyPreview.hidden = result.plan.items.length !== 0;
    const nouns = result.plan.items.length === 1 ? 'object' : 'objects';
    objectCount.textContent = result.plan.items.length + ' ' + nouns + ' · preview updated';
    sheetInfo.textContent = result.plan.paper + ' ' + result.plan.orientation + ' · 1:' + result.plan.scale + ' · ' + result.plan.units;
    const overflow = Math.max(rendered.layout.requiredWidth - (rendered.layout.width - 28), rendered.layout.requiredHeight - (rendered.layout.height - 28));
    fitInfo.textContent = rendered.layout.fits ? 'Fits the sheet at full scale' : 'Too large by ' + overflow.toFixed(1) + ' mm';
    fitInfo.classList.toggle('danger', !rendered.layout.fits);
    localStorage.setItem(storageKey(), source.value);
    saveState.textContent = demoMode ? 'Saved only in this demo' : 'Saved in this browser';
  } else {
    objectCount.textContent = errors.length + ' ' + (errors.length === 1 ? 'error' : 'errors') + ' · showing last valid preview';
  }
  showIssues(result.issues);
}

function showIssues(issues: ReturnType<typeof parse>['issues']): void {
  if (!issues.length) {
    issueSummary.innerHTML = '';
    issueSummary.hidden = true;
    return;
  }
  issueSummary.hidden = false;
  const heading = issues.some(issue => issue.severity === 'error') ? 'Check the marked line' : 'Review this note before export';
  issueSummary.innerHTML = '<strong>' + heading + '</strong><ul>' + issues.map(issue =>
    '<li><button type="button" data-line="' + issue.line + '"><span>' + (issue.severity === 'error' ? 'Error' : 'Note') + ' · line ' + issue.line + '</span>' + escapeHtml(issue.message) + '</button></li>'
  ).join('') + '</ul>';
  issueSummary.querySelectorAll<HTMLButtonElement>('[data-line]').forEach(button => {
    button.addEventListener('click', () => focusLine(Number(button.dataset.line)));
  });
}

function escapeHtml(text: string): string {
  const span = document.createElement('span');
  span.textContent = text;
  return span.innerHTML;
}

function focusLine(line: number): void {
  const lines = source.value.split('\n');
  const start = lines.slice(0, line - 1).reduce((total, part) => total + part.length + 1, 0);
  source.focus();
  source.setSelectionRange(start, start + (lines[line - 1]?.length ?? 0));
}

function updateLines(): void {
  lineNumbers.textContent = Array.from({ length: Math.max(1, source.value.split('\n').length) }, (_, index) => index + 1).join('\n');
  lineNumbers.scrollTop = source.scrollTop;
}

function scheduleRender(): void {
  saveState.textContent = 'Saving…';
  window.clearTimeout(renderTimer);
  renderTimer = window.setTimeout(render, 180);
}

function announce(message: string): void {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function filename(extension: string): string {
  const slug = lastValid.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'floorplan';
  return slug + '.' + extension;
}

function download(data: BlobPart, name: string, type: string): void {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function validForExport(): boolean {
  const errors = parse(source.value).issues.filter(issue => issue.severity === 'error');
  if (errors.length) {
    announce('Fix the marked source error before exporting.');
    focusLine(errors[0].line);
    return false;
  }
  if (!renderSvg(lastValid).layout.fits) {
    announce('Choose a smaller scale or larger sheet before exporting.');
    return false;
  }
  return true;
}

async function exportPlan(kind: string): Promise<void> {
  if (!validForExport()) return;
  if (kind === 'svg') {
    const rendered = renderSvg(lastValid);
    download('<?xml version="1.0" encoding="UTF-8"?>\n' + rendered.svg, filename('svg'), 'image/svg+xml');
  } else if (kind === 'pdf') {
    const pdf = makePdf(lastValid);
    download(pdf.buffer as ArrayBuffer, filename('pdf'), 'application/pdf');
  } else {
    const rendered = renderSvg(lastValid);
    const scale = 300 / 25.4;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(rendered.layout.width * scale);
    canvas.height = Math.round(rendered.layout.height * scale);
    const context = canvas.getContext('2d');
    if (!context) return;
    const image = new Image();
    const url = URL.createObjectURL(new Blob([rendered.svg], { type: 'image/svg+xml' }));
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('PNG render failed'));
      image.src = url;
    });
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    await new Promise<void>(resolve => canvas.toBlob(blob => { if (blob) download(blob, filename('png'), 'image/png'); resolve(); }, 'image/png'));
  }
  announce(kind.toUpperCase() + ' export started.');
  document.querySelector<HTMLDetailsElement>('#export-menu')!.open = false;
}

function loadExample(confirmReplace = true): void {
  if (confirmReplace && source.value.trim() && source.value !== EXAMPLE && !confirm('Replace this plan with the Garden studio sample?')) return;
  source.value = EXAMPLE;
  render();
  announce('Garden studio sample loaded.');
}

source.addEventListener('input', scheduleRender);
source.addEventListener('scroll', updateLines);
source.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key === ']') {
    event.preventDefault();
    const start = source.selectionStart;
    source.setRangeText('  ', start, source.selectionEnd, 'end');
    scheduleRender();
  }
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    render();
    announce('Preview rendered.');
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault();
    download(source.value, filename('floorplan'), 'text/plain');
    announce('Floorplan file saved.');
  }
});

document.querySelector('#new-button')!.addEventListener('click', () => {
  if (source.value.trim() && !confirm('Start a blank plan? Save a floorplan file first if you need this text.')) return;
  source.value = ['plan v1', 'title "Untitled plan"', 'units cm', 'scale 1:50', 'sheet A3 landscape', '', ''].join('\n');
  render();
  source.focus();
});
document.querySelector('#open-button')!.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  if (file.size > 500_000) {
    announce('That file exceeds 500 KB. Choose a smaller text floorplan file.');
    return;
  }
  source.value = await file.text();
  render();
  announce(file.name + ' opened.');
  fileInput.value = '';
});
document.querySelector('#save-button')!.addEventListener('click', () => {
  download(source.value, filename('floorplan'), 'text/plain');
  announce('Floorplan file saved.');
});
document.querySelector('#share-button')!.addEventListener('click', async () => {
  const url = location.origin + location.pathname + '#plan=' + toHash(source.value);
  if (url.length > 12_000) {
    announce('This plan is too long for a reliable link. Save the floorplan file instead.');
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    announce('Share link copied.');
  } catch {
    location.hash = 'plan=' + toHash(source.value);
    prompt('Copy this share link:', url);
  }
});
document.querySelectorAll<HTMLButtonElement>('[data-export]').forEach(button => {
  button.addEventListener('click', () => void exportPlan(button.dataset.export!));
});
document.querySelector('#syntax-button')!.addEventListener('click', () => syntaxDialog.showModal());
syntaxDialog.querySelector('.close-dialog')!.addEventListener('click', () => syntaxDialog.close());
syntaxDialog.addEventListener('click', event => { if (event.target === syntaxDialog) syntaxDialog.close(); });
document.querySelector('#example-button')!.addEventListener('click', () => loadExample());
document.querySelector('#empty-example-button')!.addEventListener('click', () => loadExample());
document.querySelector('#reset-demo')!.addEventListener('click', () => {
  localStorage.removeItem(DEMO_KEY);
  loadExample(false);
  announce('Demo reset to the Garden studio sample.');
});
document.querySelectorAll<HTMLButtonElement>('.mobile-tabs button').forEach(button => {
  button.addEventListener('click', () => setMobilePanel(button.dataset.panel as 'source' | 'preview'));
});

function updateOnline(): void {
  offlineBanner.hidden = navigator.onLine;
}

addEventListener('online', updateOnline);
addEventListener('offline', updateOnline);
addEventListener('popstate', () => showRoute(true));
bindRouteLinks();
showRoute(false);
updateOnline();
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  addEventListener('load', () => void navigator.serviceWorker.register('/sw.js'));
}

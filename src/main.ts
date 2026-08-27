import './style.css';
import { EXAMPLE } from './example';
import { parse } from './parser';
import { renderSvg } from './renderer';
import { makePdf } from './pdf';

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
let renderTimer = 0;
let toastTimer = 0;
let lastValid = parse(EXAMPLE).plan;

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

function initialSource(): string {
  const shared = fromHash();
  if (shared !== null) return shared;
  return localStorage.getItem('floorplan-text-source') ?? EXAMPLE;
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
    objectCount.textContent = result.plan.items.length + ' ' + nouns + ' · live';
    sheetInfo.textContent = result.plan.paper + ' ' + result.plan.orientation + ' · 1:' + result.plan.scale + ' · ' + result.plan.units;
    const overflow = Math.max(rendered.layout.requiredWidth - (rendered.layout.width - 28), rendered.layout.requiredHeight - (rendered.layout.height - 28));
    fitInfo.textContent = rendered.layout.fits ? 'Fits at true scale · print at 100%' : 'Too large by ' + overflow.toFixed(1) + ' mm';
    fitInfo.classList.toggle('danger', !rendered.layout.fits);
    localStorage.setItem('floorplan-text-source', source.value);
    saveState.textContent = 'Saved locally';
  } else {
    objectCount.textContent = errors.length + ' ' + (errors.length === 1 ? 'error' : 'errors') + ' · last valid preview';
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
  const heading = issues.some(issue => issue.severity === 'error') ? 'Check the marked line' : 'A note before you export';
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
    announce('Fix source errors before exporting.');
    focusLine(errors[0].line);
    return false;
  }
  const rendered = renderSvg(lastValid);
  if (!rendered.layout.fits) {
    announce('The drawing does not fit this sheet at true scale.');
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
    canvas.toBlob(blob => { if (blob) download(blob, filename('png'), 'image/png'); }, 'image/png');
  }
  announce(kind.toUpperCase() + ' export started.');
  document.querySelector<HTMLDetailsElement>('#export-menu')!.open = false;
}

function loadExample(): void {
  if (source.value.trim() && source.value !== EXAMPLE && !confirm('Replace the current source with the garden studio example? Your locally saved draft will be replaced.')) return;
  source.value = EXAMPLE;
  render();
  announce('Garden studio example loaded.');
}

source.value = initialSource();
render();
source.addEventListener('input', scheduleRender);
source.addEventListener('scroll', updateLines);
source.addEventListener('keydown', event => {
  if (event.key === 'Tab') {
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
    announce('Source file saved.');
  }
});

document.querySelector('#new-button')!.addEventListener('click', () => {
  if (source.value.trim() && !confirm('Start a blank plan? Your current source will be replaced in local storage. Save it first if you need a copy.')) return;
  source.value = ['plan v1', 'title "Untitled plan"', 'units cm', 'scale 1:50', 'sheet A3 landscape', '', ''].join('\n');
  render();
  source.focus();
});
document.querySelector('#open-button')!.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  if (file.size > 500_000) {
    announce('That file is larger than 500 KB. Choose a text floorplan file.');
    return;
  }
  source.value = await file.text();
  render();
  announce(file.name + ' opened.');
  fileInput.value = '';
});
document.querySelector('#save-button')!.addEventListener('click', () => {
  download(source.value, filename('floorplan'), 'text/plain');
  announce('Source file saved.');
});
document.querySelector('#share-button')!.addEventListener('click', async () => {
  const url = location.origin + location.pathname + '#plan=' + toHash(source.value);
  if (url.length > 12_000) {
    announce('This plan is too long for a reliable URL. Save the source file instead.');
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    announce('Private share link copied.');
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
document.querySelector('#example-button')!.addEventListener('click', loadExample);
document.querySelector('#empty-example-button')!.addEventListener('click', loadExample);
document.querySelectorAll<HTMLButtonElement>('.mobile-tabs button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.mobile-tabs button').forEach(tab => {
      const active = tab === button;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll<HTMLElement>('[data-panel-name]').forEach(panel => {
      panel.classList.toggle('active', panel.dataset.panelName === button.dataset.panel);
    });
  });
});

function updateOnline(): void {
  offlineBanner.hidden = navigator.onLine;
}
addEventListener('online', updateOnline);
addEventListener('offline', updateOnline);
updateOnline();
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  addEventListener('load', () => void navigator.serviceWorker.register('/sw.js'));
}

import { format } from './parser';
import { paperSize, UNIT_TO_MM, type Dimension, type Door, type Plan, type Point, type Wall, type WindowItem } from './model';

export interface Layout {
  width: number;
  height: number;
  factor: number;
  offsetX: number;
  offsetY: number;
  fits: boolean;
  requiredWidth: number;
  requiredHeight: number;
}

const MARGIN = 14;
const INK = '#172b35';
const PAPER = '#fffdf5';
const GRID = '#dbe5dc';
const ACCENT = '#a5352d';
const MUTED = '#52656a';

function esc(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]!);
}

function bounds(plan: Plan): { minX: number; minY: number; maxX: number; maxY: number } {
  const points: Point[] = [];
  for (const item of plan.items) {
    if (item.kind === 'wall' || item.kind === 'dimension') points.push(item.from, item.to);
    if (item.kind === 'label') points.push(item.at);
  }
  if (!points.length) return { minX: 0, minY: 0, maxX: 100, maxY: 100 };
  return {
    minX: Math.min(...points.map(point => point.x)), minY: Math.min(...points.map(point => point.y)),
    maxX: Math.max(...points.map(point => point.x)), maxY: Math.max(...points.map(point => point.y)),
  };
}

export function makeLayout(plan: Plan): Layout {
  const [width, height] = paperSize(plan);
  const raw = bounds(plan);
  const factor = UNIT_TO_MM[plan.units] / plan.scale;
  const requiredWidth = (raw.maxX - raw.minX) * factor;
  const requiredHeight = (raw.maxY - raw.minY) * factor;
  return {
    width, height, factor,
    offsetX: MARGIN + (width - MARGIN * 2 - requiredWidth) / 2 - raw.minX * factor,
    offsetY: MARGIN + (height - MARGIN * 2 - requiredHeight) / 2 - raw.minY * factor,
    fits: requiredWidth <= width - MARGIN * 2 && requiredHeight <= height - MARGIN * 2,
    requiredWidth, requiredHeight,
  };
}

export function toPaper(point: Point, layout: Layout): Point {
  return { x: point.x * layout.factor + layout.offsetX, y: point.y * layout.factor + layout.offsetY };
}

export function wallOpening(wall: Wall, offset: number, width: number): { start: Point; end: Point; normal: Point; angle: number } {
  const dx = wall.to.x - wall.from.x;
  const dy = wall.to.y - wall.from.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  return {
    start: { x: wall.from.x + ux * offset, y: wall.from.y + uy * offset },
    end: { x: wall.from.x + ux * (offset + width), y: wall.from.y + uy * (offset + width) },
    normal: { x: -uy, y: ux },
    angle: Math.atan2(dy, dx) * 180 / Math.PI,
  };
}

function line(x1: number, y1: number, x2: number, y2: number, attrs = ''): string {
  return `<line x1="${x1.toFixed(3)}" y1="${y1.toFixed(3)}" x2="${x2.toFixed(3)}" y2="${y2.toFixed(3)}" ${attrs}/>`;
}

function renderDoor(item: Door, wall: Wall, layout: Layout): string {
  const opening = wallOpening(wall, item.offset, item.width);
  const start = toPaper(opening.start, layout);
  const end = toPaper(opening.end, layout);
  const width = item.width * layout.factor;
  const hinge = item.swing === 'left' ? start : end;
  const closed = item.swing === 'left' ? end : start;
  const nx = opening.normal.x * width;
  const ny = opening.normal.y * width;
  const open = { x: hinge.x + nx, y: hinge.y + ny };
  const sweep = item.swing === 'left' ? 1 : 0;
  return `<g class="door" data-id="${esc(item.id)}">
    ${line(start.x, start.y, end.x, end.y, `stroke="${PAPER}" stroke-width="${Math.max(1.3, wall.thickness * layout.factor + 0.8).toFixed(3)}"`)}
    ${line(hinge.x, hinge.y, open.x, open.y, `stroke="${INK}" stroke-width="0.55"`)}
    <path d="M ${closed.x.toFixed(3)} ${closed.y.toFixed(3)} A ${width.toFixed(3)} ${width.toFixed(3)} 0 0 ${sweep} ${open.x.toFixed(3)} ${open.y.toFixed(3)}" fill="none" stroke="${MUTED}" stroke-width="0.35" stroke-dasharray="1.4 1"/>
    <circle cx="${hinge.x.toFixed(3)}" cy="${hinge.y.toFixed(3)}" r="0.75" fill="${ACCENT}"/>
  </g>`;
}

function renderWindow(item: WindowItem, wall: Wall, layout: Layout): string {
  const opening = wallOpening(wall, item.offset, item.width);
  const start = toPaper(opening.start, layout);
  const end = toPaper(opening.end, layout);
  const n = opening.normal;
  return `<g class="window" data-id="${esc(item.id)}">
    ${line(start.x, start.y, end.x, end.y, `stroke="${PAPER}" stroke-width="${Math.max(1.4, wall.thickness * layout.factor + 0.8).toFixed(3)}"`)}
    ${line(start.x + n.x * 0.75, start.y + n.y * 0.75, end.x + n.x * 0.75, end.y + n.y * 0.75, `stroke="${INK}" stroke-width="0.4"`)}
    ${line(start.x - n.x * 0.75, start.y - n.y * 0.75, end.x - n.x * 0.75, end.y - n.y * 0.75, `stroke="${INK}" stroke-width="0.4"`)}
    ${line(start.x - n.x * 1.6, start.y - n.y * 1.6, start.x + n.x * 1.6, start.y + n.y * 1.6, `stroke="${INK}" stroke-width="0.45"`)}
    ${line(end.x - n.x * 1.6, end.y - n.y * 1.6, end.x + n.x * 1.6, end.y + n.y * 1.6, `stroke="${INK}" stroke-width="0.45"`)}
  </g>`;
}

function renderDimension(item: Dimension, plan: Plan, layout: Layout): string {
  const a = toPaper(item.from, layout);
  const b = toPaper(item.to, layout);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy) || 1;
  const nx = -dy / length;
  const ny = dx / length;
  const offset = item.offset * layout.factor;
  const da = { x: a.x + nx * offset, y: a.y + ny * offset };
  const db = { x: b.x + nx * offset, y: b.y + ny * offset };
  const measured = Math.hypot(item.to.x - item.from.x, item.to.y - item.from.y);
  const text = item.text ?? `${format(measured)} ${plan.units}`;
  const tx = (da.x + db.x) / 2;
  const ty = (da.y + db.y) / 2 - 1.8;
  return `<g class="dimension">
    ${line(a.x, a.y, da.x + nx * 2, da.y + ny * 2, `stroke="${MUTED}" stroke-width="0.3"`)}
    ${line(b.x, b.y, db.x + nx * 2, db.y + ny * 2, `stroke="${MUTED}" stroke-width="0.3"`)}
    ${line(da.x, da.y, db.x, db.y, `stroke="${ACCENT}" stroke-width="0.35" marker-start="url(#arrow)" marker-end="url(#arrow)"`)}
    <text x="${tx.toFixed(3)}" y="${ty.toFixed(3)}" text-anchor="middle" fill="${ACCENT}" font-size="3.2" font-family="ui-monospace, monospace">${esc(text)}</text>
  </g>`;
}

export function renderSvg(plan: Plan): { svg: string; layout: Layout } {
  const layout = makeLayout(plan);
  const walls = new Map(plan.items.filter(item => item.kind === 'wall').map(wall => [wall.id, wall]));
  const body: string[] = [];
  for (const item of plan.items) {
    if (item.kind === 'wall') {
      const a = toPaper(item.from, layout); const b = toPaper(item.to, layout);
      body.push(`<g class="wall" data-id="${esc(item.id)}">${line(a.x, a.y, b.x, b.y, `stroke="${INK}" stroke-width="${Math.max(0.55, item.thickness * layout.factor).toFixed(3)}" stroke-linecap="square"`)}</g>`);
    }
  }
  for (const item of plan.items) {
    if (item.kind === 'door') { const wall = walls.get(item.wallId); if (wall) body.push(renderDoor(item, wall, layout)); }
    if (item.kind === 'window') { const wall = walls.get(item.wallId); if (wall) body.push(renderWindow(item, wall, layout)); }
    if (item.kind === 'label') {
      const at = toPaper(item.at, layout);
      const size = Math.max(2.8, item.size * layout.factor);
      body.push(`<text x="${at.x.toFixed(3)}" y="${at.y.toFixed(3)}" text-anchor="middle" dominant-baseline="middle" fill="${INK}" font-size="${size.toFixed(3)}" font-family="Georgia, serif">${esc(item.text)}</text>`);
    }
    if (item.kind === 'dimension') body.push(renderDimension(item, plan, layout));
  }
  const empty = plan.items.length === 0 ? `<g aria-label="Empty plan"><path d="M ${layout.width / 2 - 15} ${layout.height / 2} h30 M ${layout.width / 2} ${layout.height / 2 - 15} v30" stroke="${GRID}" stroke-width="0.6"/><text x="${layout.width / 2}" y="${layout.height / 2 + 24}" text-anchor="middle" fill="${MUTED}" font-size="4" font-family="ui-monospace, monospace">Start with a wall</text></g>` : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="plan-title plan-desc" width="${layout.width}mm" height="${layout.height}mm" viewBox="0 0 ${layout.width} ${layout.height}">
  <title id="plan-title">${esc(plan.title)}</title><desc id="plan-desc">Floor plan at 1:${plan.scale} on ${plan.paper} ${plan.orientation}, containing ${plan.items.length} drawing objects.</desc>
  <defs><pattern id="minor-grid" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M 5 0 L 0 0 0 5" fill="none" stroke="${GRID}" stroke-width="0.18"/></pattern><marker id="arrow" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 3 L 6 0 L 4.4 3 L 6 6 Z" fill="${ACCENT}"/></marker></defs>
  <rect width="100%" height="100%" fill="${PAPER}"/><rect x="7" y="7" width="${layout.width - 14}" height="${layout.height - 14}" fill="url(#minor-grid)" opacity="0.62"/>
  ${empty}${body.join('\n  ')}
  <g aria-label="Drawing information"><path d="M ${layout.width - 88} ${layout.height - 24} h81 v17 h-81 z M ${layout.width - 88} ${layout.height - 17} h81" fill="${PAPER}" stroke="${INK}" stroke-width="0.35"/><text x="${layout.width - 85}" y="${layout.height - 18.9}" fill="${INK}" font-size="3.2" font-family="Georgia, serif">${esc(plan.title)}</text><text x="${layout.width - 85}" y="${layout.height - 11}" fill="${MUTED}" font-size="2.7" font-family="ui-monospace, monospace">SCALE 1:${plan.scale} · ${esc(plan.paper.toUpperCase())} · ${esc(plan.units.toUpperCase())}</text></g>
  <text x="7" y="${layout.height - 3}" fill="${MUTED}" font-size="2.3" font-family="ui-monospace, monospace">Floorplan Text DSL v1 · Verify dimensions before construction.</text>
</svg>`;
  return { svg, layout };
}

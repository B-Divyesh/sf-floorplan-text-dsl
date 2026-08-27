import type { Plan, Point, Wall } from './model';
import { format } from './parser';
import { makeLayout, toPaper, wallOpening } from './renderer';

const PT = 72 / 25.4;
const rgb = { ink: '0.090 0.169 0.208', muted: '0.322 0.396 0.416', accent: '0.647 0.208 0.176', paper: '1 0.992 0.961' };
const n = (value: number) => (value * PT).toFixed(3);
const pdfPoint = (point: Point, height: number): string => `${n(point.x)} ${n(height - point.y)}`;
const safe = (value: string) => value.replace(/[^\x20-\x7E]/g, '?').replace(/([\\()])/g, '\\$1');

export function makePdf(plan: Plan): Uint8Array {
  const layout = makeLayout(plan);
  const commands: string[] = [`${rgb.paper} rg 0 0 ${n(layout.width)} ${n(layout.height)} re f`, '1 J 1 j'];
  const walls = new Map(plan.items.filter(item => item.kind === 'wall').map(wall => [wall.id, wall]));
  for (const item of plan.items) {
    if (item.kind !== 'wall') continue;
    const a = toPaper(item.from, layout); const b = toPaper(item.to, layout);
    commands.push(`${rgb.ink} RG ${n(Math.max(.55, item.thickness * layout.factor))} w ${pdfPoint(a, layout.height)} m ${pdfPoint(b, layout.height)} l S`);
  }
  for (const item of plan.items) {
    if (item.kind === 'door') { const wall = walls.get(item.wallId); if (wall) pdfDoor(commands, item, wall, layout); }
    if (item.kind === 'window') { const wall = walls.get(item.wallId); if (wall) pdfWindow(commands, item, wall, layout); }
    if (item.kind === 'label') {
      const at = toPaper(item.at, layout); const size = Math.max(2.8, item.size * layout.factor) * PT;
      commands.push(`${rgb.ink} rg BT /F1 ${size.toFixed(2)} Tf 1 0 0 1 ${n(at.x - item.text.length * size / PT * .24)} ${n(layout.height - at.y)} Tm (${safe(item.text)}) Tj ET`);
    }
    if (item.kind === 'dimension') {
      const a = toPaper(item.from, layout); const b = toPaper(item.to, layout);
      const dx = b.x - a.x; const dy = b.y - a.y; const length = Math.hypot(dx, dy) || 1;
      const nx = -dy / length; const ny = dx / length; const offset = item.offset * layout.factor;
      const da = { x: a.x + nx * offset, y: a.y + ny * offset }; const db = { x: b.x + nx * offset, y: b.y + ny * offset };
      commands.push(`${rgb.muted} RG ${n(.3)} w ${pdfPoint(a, layout.height)} m ${pdfPoint({x: da.x + nx * 2, y: da.y + ny * 2}, layout.height)} l S`, `${pdfPoint(b, layout.height)} m ${pdfPoint({x: db.x + nx * 2, y: db.y + ny * 2}, layout.height)} l S`, `${rgb.accent} RG ${n(.35)} w ${pdfPoint(da, layout.height)} m ${pdfPoint(db, layout.height)} l S`);
      tick(commands, da, dx / length, dy / length, layout.height); tick(commands, db, dx / length, dy / length, layout.height);
      const measured = Math.hypot(item.to.x - item.from.x, item.to.y - item.from.y);
      const text = safe(item.text ?? `${format(measured)} ${plan.units}`); const center = { x: (da.x + db.x) / 2, y: (da.y + db.y) / 2 };
      commands.push(`${rgb.accent} rg BT /F2 9 Tf 1 0 0 1 ${n(center.x - text.length * 1.5)} ${n(layout.height - center.y + 1.8)} Tm (${text}) Tj ET`);
    }
  }
  commands.push(`${rgb.ink} RG ${n(.35)} w ${n(layout.width - 88)} ${n(7)} ${n(81)} ${n(17)} re S`, `${rgb.ink} rg BT /F1 10 Tf 1 0 0 1 ${n(layout.width - 85)} ${n(19)} Tm (${safe(plan.title)}) Tj ET`, `${rgb.muted} rg BT /F2 8 Tf 1 0 0 1 ${n(layout.width - 85)} ${n(11)} Tm (SCALE 1:${plan.scale} - ${safe(plan.paper.toUpperCase())} - ${safe(plan.units.toUpperCase())}) Tj ET`);
  return assemblePdf(layout.width * PT, layout.height * PT, commands.join('\n'));
}

function pdfDoor(out: string[], item: Extract<Plan['items'][number], {kind:'door'}>, wall: Wall, layout: ReturnType<typeof makeLayout>): void {
  const opening = wallOpening(wall, item.offset, item.width); const start = toPaper(opening.start, layout); const end = toPaper(opening.end, layout);
  const width = item.width * layout.factor; const hinge = item.swing === 'left' ? start : end;
  const open = { x: hinge.x + opening.normal.x * width, y: hinge.y + opening.normal.y * width };
  out.push(`${rgb.paper} RG ${n(Math.max(1.3, wall.thickness * layout.factor + .8))} w ${pdfPoint(start, layout.height)} m ${pdfPoint(end, layout.height)} l S`, `${rgb.ink} RG ${n(.55)} w ${pdfPoint(hinge, layout.height)} m ${pdfPoint(open, layout.height)} l S`);
}

function pdfWindow(out: string[], item: Extract<Plan['items'][number], {kind:'window'}>, wall: Wall, layout: ReturnType<typeof makeLayout>): void {
  const opening = wallOpening(wall, item.offset, item.width); const start = toPaper(opening.start, layout); const end = toPaper(opening.end, layout); const normal = opening.normal;
  out.push(`${rgb.paper} RG ${n(Math.max(1.4, wall.thickness * layout.factor + .8))} w ${pdfPoint(start, layout.height)} m ${pdfPoint(end, layout.height)} l S`);
  for (const side of [-.75, .75]) {
    const a = {x: start.x + normal.x * side, y: start.y + normal.y * side}; const b = {x: end.x + normal.x * side, y: end.y + normal.y * side};
    out.push(`${rgb.ink} RG ${n(.4)} w ${pdfPoint(a, layout.height)} m ${pdfPoint(b, layout.height)} l S`);
  }
}

function tick(out: string[], at: Point, ux: number, uy: number, height: number): void {
  const a = {x: at.x - ux * 1.4 - uy * 1.4, y: at.y - uy * 1.4 + ux * 1.4}; const b = {x: at.x + ux * 1.4 + uy * 1.4, y: at.y + uy * 1.4 - ux * 1.4};
  out.push(`${pdfPoint(a, height)} m ${pdfPoint(b, height)} l S`);
}

function assemblePdf(width: number, height: number, stream: string): Uint8Array {
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width.toFixed(3)} ${height.toFixed(3)}] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>`,
    `<< /Length ${new TextEncoder().encode(stream).length} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>',
  ];
  let pdf = '%PDF-1.4\n% floorplan-text-dsl\n'; const offsets = [0];
  objects.forEach((object, index) => { offsets.push(new TextEncoder().encode(pdf).length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = new TextEncoder().encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map(offset => String(offset).padStart(10, '0') + ' 00000 n ').join('\n')}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}

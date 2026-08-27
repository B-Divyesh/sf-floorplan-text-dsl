import { defaultPlan, type Door, type Issue, type ParseResult, type Plan, type Point, type Unit, type PaperName, type Orientation } from './model';

const NUMBER = '-?(?:\\d+(?:\\.\\d*)?|\\.\\d+)';
const POINT = `(${NUMBER})\\s*,\\s*(${NUMBER})`;
const ID = '[A-Za-z][A-Za-z0-9_-]*';

function num(value: string): number { return Number.parseFloat(value); }
function point(x: string, y: string): Point { return { x: num(x), y: num(y) }; }

export function parse(source: string): ParseResult {
  const plan = defaultPlan();
  const issues: Issue[] = [];
  const ids = new Map<string, number>();
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  let sawVersion = false;

  const error = (line: number, message: string) => issues.push({ line, message, severity: 'error' });
  const addId = (id: string, line: number) => {
    const previous = ids.get(id);
    if (previous) error(line, `“${id}” was already defined on line ${previous}.`);
    else ids.set(id, line);
  };

  lines.forEach((raw, index) => {
    const line = index + 1;
    const text = raw.trim();
    if (!text || text.startsWith('#')) return;
    let match: RegExpMatchArray | null;

    if ((match = text.match(/^plan\s+v(\d+)$/i))) {
      sawVersion = true;
      if (match[1] !== '1') error(line, `DSL v${match[1]} is not supported. Use “plan v1”.`);
      return;
    }
    if ((match = text.match(/^title\s+"([^"]+)"$/i))) { plan.title = match[1]; return; }
    if ((match = text.match(/^units\s+(mm|cm|m|in|ft)$/i))) { plan.units = match[1].toLowerCase() as Unit; return; }
    if ((match = text.match(/^scale\s+1\s*:\s*(\d+(?:\.\d+)?)$/i))) {
      plan.scale = num(match[1]);
      if (plan.scale <= 0) error(line, 'Scale denominator must be greater than zero.');
      return;
    }
    if ((match = text.match(/^sheet\s+(A4|A3|A2|Letter|Tabloid)\s+(portrait|landscape)$/i))) {
      const paper = match[1].toLowerCase();
      plan.paper = (paper.startsWith('a') ? paper.toUpperCase() : paper[0].toUpperCase() + paper.slice(1)) as PaperName;
      plan.orientation = match[2].toLowerCase() as Orientation;
      return;
    }
    if ((match = text.match(new RegExp(`^wall\\s+(${ID})\\s+from\\s+${POINT}\\s+to\\s+${POINT}\\s+thickness\\s+(${NUMBER})$`, 'i')))) {
      const [, id, x1, y1, x2, y2, thickness] = match;
      addId(id, line);
      if (num(thickness) <= 0) error(line, 'Wall thickness must be greater than zero.');
      if (x1 === x2 && y1 === y2) error(line, 'A wall needs two different endpoints.');
      plan.items.push({ kind: 'wall', id, from: point(x1, y1), to: point(x2, y2), thickness: num(thickness), line });
      return;
    }
    if ((match = text.match(new RegExp(`^door\\s+(${ID})\\s+on\\s+(${ID})\\s+at\\s+(${NUMBER})\\s+width\\s+(${NUMBER})(?:\\s+swing\\s+(left|right))?$`, 'i')))) {
      const [, id, wallId, offset, width, swing = 'left'] = match;
      addId(id, line);
      if (num(width) <= 0) error(line, 'Door width must be greater than zero.');
      plan.items.push({ kind: 'door', id, wallId, offset: num(offset), width: num(width), swing: swing.toLowerCase() as Door['swing'], line });
      return;
    }
    if ((match = text.match(new RegExp(`^window\\s+(${ID})\\s+on\\s+(${ID})\\s+at\\s+(${NUMBER})\\s+width\\s+(${NUMBER})$`, 'i')))) {
      const [, id, wallId, offset, width] = match;
      addId(id, line);
      if (num(width) <= 0) error(line, 'Window width must be greater than zero.');
      plan.items.push({ kind: 'window', id, wallId, offset: num(offset), width: num(width), line });
      return;
    }
    if ((match = text.match(new RegExp(`^label\\s+"([^"]+)"\\s+at\\s+${POINT}(?:\\s+size\\s+(${NUMBER}))?$`, 'i')))) {
      const [, labelText, x, y, size = '18'] = match;
      if (num(size) <= 0) error(line, 'Label size must be greater than zero.');
      plan.items.push({ kind: 'label', text: labelText, at: point(x, y), size: num(size), line });
      return;
    }
    if ((match = text.match(new RegExp(`^dimension\\s+from\\s+${POINT}\\s+to\\s+${POINT}\\s+offset\\s+(${NUMBER})(?:\\s+text\\s+"([^"]+)")?$`, 'i')))) {
      const [, x1, y1, x2, y2, offset, customText] = match;
      plan.items.push({ kind: 'dimension', from: point(x1, y1), to: point(x2, y2), offset: num(offset), text: customText, line });
      return;
    }
    error(line, 'I could not read this line. Open “Syntax guide” for valid forms.');
  });

  if (!sawVersion && source.trim()) issues.push({ line: 1, message: 'Add “plan v1” so future versions can read this file safely.', severity: 'warning' });
  validateReferences(plan, issues);
  return { plan, issues };
}

function validateReferences(plan: Plan, issues: Issue[]): void {
  const walls = new Map(plan.items.filter(item => item.kind === 'wall').map(wall => [wall.id, wall]));
  for (const item of plan.items) {
    if (item.kind !== 'door' && item.kind !== 'window') continue;
    const wall = walls.get(item.wallId);
    if (!wall) {
      issues.push({ line: item.line, message: `Wall “${item.wallId}” does not exist. Define it before attaching ${item.kind} “${item.id}”.`, severity: 'error' });
      continue;
    }
    const length = Math.hypot(wall.to.x - wall.from.x, wall.to.y - wall.from.y);
    if (item.offset < 0 || item.offset + item.width > length) {
      issues.push({ line: item.line, message: `${item.kind === 'door' ? 'Door' : 'Window'} “${item.id}” runs beyond wall “${wall.id}” (${format(length)} ${plan.units} long).`, severity: 'error' });
    }
  }
}

export function format(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}

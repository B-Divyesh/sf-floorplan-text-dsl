export type Unit = 'mm' | 'cm' | 'm' | 'in' | 'ft';
export type PaperName = 'A4' | 'A3' | 'A2' | 'Letter' | 'Tabloid';
export type Orientation = 'portrait' | 'landscape';

export interface Point { x: number; y: number }
export interface Wall { kind: 'wall'; id: string; from: Point; to: Point; thickness: number; line: number }
export interface Door { kind: 'door'; id: string; wallId: string; offset: number; width: number; swing: 'left' | 'right'; line: number }
export interface WindowItem { kind: 'window'; id: string; wallId: string; offset: number; width: number; line: number }
export interface Label { kind: 'label'; text: string; at: Point; size: number; line: number }
export interface Dimension { kind: 'dimension'; from: Point; to: Point; offset: number; text?: string; line: number }
export type Item = Wall | Door | WindowItem | Label | Dimension;

export interface Plan {
  version: 1;
  units: Unit;
  scale: number;
  paper: PaperName;
  orientation: Orientation;
  title: string;
  items: Item[];
}

export interface Issue {
  line: number;
  message: string;
  severity: 'error' | 'warning';
}

export interface ParseResult { plan: Plan; issues: Issue[] }

export const PAPER_MM: Record<PaperName, [number, number]> = {
  A4: [210, 297], A3: [297, 420], A2: [420, 594], Letter: [215.9, 279.4], Tabloid: [279.4, 431.8],
};

export const UNIT_TO_MM: Record<Unit, number> = { mm: 1, cm: 10, m: 1000, in: 25.4, ft: 304.8 };

export function paperSize(plan: Pick<Plan, 'paper' | 'orientation'>): [number, number] {
  const [short, long] = PAPER_MM[plan.paper];
  return plan.orientation === 'portrait' ? [short, long] : [long, short];
}

export function defaultPlan(): Plan {
  return { version: 1, units: 'cm', scale: 50, paper: 'A3', orientation: 'landscape', title: 'Untitled plan', items: [] };
}

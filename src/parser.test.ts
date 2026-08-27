import { describe, expect, it } from 'vitest';
import { EXAMPLE } from './example';
import { parse } from './parser';
import { renderSvg } from './renderer';
import { makePdf } from './pdf';

describe('Floorplan Text DSL', () => {
  it('parses the complete example with architectural primitives', () => {
    const result = parse(EXAMPLE);
    expect(result.issues).toEqual([]);
    expect(result.plan.title).toBe('Garden studio');
    expect(result.plan.items.filter(item => item.kind === 'wall')).toHaveLength(4);
    expect(result.plan.items.filter(item => item.kind === 'door')).toHaveLength(1);
    expect(result.plan.items.filter(item => item.kind === 'window')).toHaveLength(2);
    expect(result.plan.items.filter(item => item.kind === 'dimension')).toHaveLength(2);
  });

  it('reports useful line-specific reference and syntax errors', () => {
    const result = parse(['plan v1', 'units cm', 'door d1 on missing at 0 width 90', 'banana'].join('\n'));
    expect(result.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ line: 3, severity: 'error', message: expect.stringContaining('does not exist') }),
      expect.objectContaining({ line: 4, severity: 'error', message: expect.stringContaining('could not read') }),
    ]));
  });

  it('rejects an opening that extends beyond its wall', () => {
    const result = parse(['plan v1', 'wall short from 0,0 to 100,0 thickness 10', 'window wide on short at 50 width 80'].join('\n'));
    expect(result.issues[0].message).toContain('runs beyond wall');
  });

  it('renders physical A3 landscape dimensions at true scale', () => {
    const plan = parse(EXAMPLE).plan;
    const rendered = renderSvg(plan);
    expect(rendered.svg).toContain('width="420mm" height="297mm"');
    expect(rendered.layout.factor).toBe(0.2);
    expect(rendered.layout.requiredWidth).toBe(120);
  });

  it('escapes user text in SVG output', () => {
    const plan = parse(['plan v1', 'label "<room & hall>" at 0,0'].join('\n')).plan;
    expect(renderSvg(plan).svg).toContain('&lt;room &amp; hall&gt;');
  });

  it('creates a one-page vector PDF with the selected paper box', () => {
    const pdf = new TextDecoder().decode(makePdf(parse(EXAMPLE).plan));
    expect(pdf.startsWith('%PDF-1.4')).toBe(true);
    expect(pdf).toContain('/Type /Page');
    expect(pdf).toContain('/MediaBox [0 0 1190.551 841.890]');
    expect(pdf.endsWith('%%EOF')).toBe(true);
  });
});

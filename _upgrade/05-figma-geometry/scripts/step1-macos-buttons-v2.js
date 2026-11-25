// Step 1 (v2): Read-only verification on macOS 27 Buttons page + full page list (compact, <= 44KB)
const pages = figma.root.children.map((p) => ({ id: p.id, name: p.name }));
const target =
  figma.root.children.find((p) => p.id === '207:14487') ||
  figma.root.children.find((p) => /buttons/i.test(p.name));

if (!target) {
  return { fileName: figma.root.name, pages, error: 'Buttons page not found' };
}

await figma.setCurrentPageAsync(target);

function round(v) {
  return typeof v === 'number' ? Number(v.toFixed(2)) : v;
}

function getRadius(node) {
  if (!('cornerRadius' in node)) return undefined;
  if (typeof node.cornerRadius === 'number') return round(node.cornerRadius);
  if (node.cornerRadius === figma.mixed) {
    return [round(node.topLeftRadius), round(node.topRightRadius), round(node.bottomRightRadius), round(node.bottomLeftRadius)];
  }
  return undefined;
}

function getEffects(node) {
  if (!('effects' in node) || !Array.isArray(node.effects)) return undefined;
  const vis = node.effects.filter((e) => e.visible !== false && (e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW' || e.type === 'BACKGROUND_BLUR'));
  if (!vis.length) return undefined;
  return vis.map((e) => ({
    t: e.type === 'DROP_SHADOW' ? 'DS' : e.type === 'INNER_SHADOW' ? 'IS' : 'BB',
    r: round(e.radius),
    s: e.spread ? round(e.spread) : undefined,
    o: e.offset ? [round(e.offset.x), round(e.offset.y)] : undefined,
    a: e.color ? Number(e.color.a.toFixed(3)) : undefined,
  }));
}

function summarize(node) {
  const rec = {
    id: node.id,
    n: node.name,
    p: node.parent ? node.parent.name : null,
    w: round(node.width),
    h: round(node.height),
  };
  const cr = getRadius(node);
  if (cr !== undefined && cr !== 0) rec.cr = cr;
  if ('cornerSmoothing' in node && typeof node.cornerSmoothing === 'number' && node.cornerSmoothing > 0) {
    rec.cs = Number(node.cornerSmoothing.toFixed(3));
  }
  if ('layoutMode' in node && node.layoutMode && node.layoutMode !== 'NONE') {
    rec.lm = node.layoutMode[0];
    rec.pad = [round(node.paddingTop), round(node.paddingRight), round(node.paddingBottom), round(node.paddingLeft)];
    if (node.itemSpacing) rec.gap = round(node.itemSpacing);
  }
  const eff = getEffects(node);
  if (eff) rec.eff = eff;
  return rec;
}

const sets = target.findAllWithCriteria({ types: ['COMPONENT_SET'] });
const comps = target.findAllWithCriteria({ types: ['COMPONENT'] });

// Deduplicate components by (parentName, h, cr, cs, pad, gap) to drop identical state/theme variants
const seen = new Set();
const uniqueComps = [];
for (const c of comps) {
  const s = summarize(c);
  const sig = JSON.stringify([s.p, s.h, s.cr, s.cs, s.pad, s.gap]);
  if (!seen.has(sig)) {
    seen.add(sig);
    uniqueComps.push(s);
  }
}

const out = {
  fileName: figma.root.name,
  pages,
  page: { id: target.id, name: target.name },
  counts: { sets: sets.length, totalComps: comps.length, uniqueComps: uniqueComps.length },
  sets: sets.map((s) => ({ id: s.id, n: s.name, w: round(s.width), h: round(s.height) })),
  comps: uniqueComps,
};

const bytes = JSON.stringify(out).length;
if (bytes > 44000) {
  return { error: 'OVER_BUDGET', bytes, pages, counts: out.counts };
}
return { ...out, bytes };

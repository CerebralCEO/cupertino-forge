// Step 2 (iOS Batch A): Full iOS 27 page list + scale check + Controls pages geometry (read-only, <= 44KB)
const allPages = figma.root.children.map((p) => ({ id: p.id, name: p.name }));

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
  const vis = node.effects.filter(
    (e) => e.visible !== false && (e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW' || e.type === 'BACKGROUND_BLUR')
  );
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

// Pick up to 8 iOS controls + device/bezel pages dynamically
const wanted = figma.root.children
  .filter((p) => /bezel|device|button|toggle|switch|slider|segmented|stepper|page control|text field|search/i.test(p.name))
  .slice(0, 8);

const out = {};
for (const page of wanted) {
  await figma.setCurrentPageAsync(page);
  const comps = page.findAllWithCriteria({ types: ['COMPONENT'] });
  const seen = new Set();
  const unique = [];
  for (const c of comps) {
    const s = summarize(c);
    const sig = JSON.stringify([s.p, s.w, s.h, s.cr, s.cs, s.pad, s.gap, s.eff]);
    if (!seen.has(sig)) {
      seen.add(sig);
      unique.push(s);
    }
  }
  const parts = [];
  const partSeen = new Set();
  const named = page.findAllWithCriteria({ types: ['FRAME', 'ELLIPSE', 'RECTANGLE'] });
  for (const f of named) {
    if (!/^(knob|thumb|track|dot|indicator|iphone|ipad|screen|display|status bar|home indicator|safe area|field|bezel)/i.test(f.name)) continue;
    const s = summarize(f);
    const sig = JSON.stringify([s.n, s.w, s.h, s.cr, s.cs, s.eff]);
    if (!partSeen.has(sig) && parts.length < 20) {
      partSeen.add(sig);
      parts.push(s);
    }
  }
  out[page.name] = { pageId: page.id, totalComps: comps.length, comps: unique.slice(0, 28), parts };
}

const payload = { fileName: figma.root.name, allPages, pages: out };
const bytes = JSON.stringify(payload).length;
if (bytes > 44000) {
  // Trim comps per page if over 44KB so we never waste the call!
  for (const k of Object.keys(out)) {
    out[k].comps = out[k].comps.slice(0, 14);
    out[k].parts = out[k].parts.slice(0, 10);
  }
  const trimmedBytes = JSON.stringify(payload).length;
  return { ...payload, bytes: trimmedBytes, trimmed: true };
}
return { ...payload, bytes };

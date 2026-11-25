// Step 2 (macOS Batch A): Read-only geometry for Windows, Sidebars, Toolbars, Alerts, Dialogs, Sheets, Popovers, Menus
const targetIds = [
  '207:14504', // Windows
  '207:14495', // Sidebars
  '207:14501', // Toolbars
  '207:14468', // Alerts
  '207:14490', // Dialogs
  '207:14493', // Sheets
  '207:14483', // Popovers
  '207:14481', // Menus
];

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

const out = {};
for (const pid of targetIds) {
  const page = figma.root.children.find((p) => p.id === pid);
  if (!page) continue;
  await figma.setCurrentPageAsync(page);
  const comps = page.findAllWithCriteria({ types: ['COMPONENT'] });
  const seen = new Set();
  const unique = [];
  for (const c of comps) {
    // Skip internal helper components starting with _ unless they are key structural parts
    if (c.parent && c.parent.name.startsWith('_') && !/traffic|titlebar|window|sidebar|toolbar|popover|sheet|alert|menu|item|row|separator/i.test(c.parent.name)) {
      continue;
    }
    const s = summarize(c);
    const sig = JSON.stringify([s.p, s.w, s.h, s.cr, s.cs, s.pad, s.gap, s.eff]);
    if (!seen.has(sig)) {
      seen.add(sig);
      unique.push(s);
    }
  }
  // Also capture key named sub-frames (traffic lights, titlebar, window frame, popover container) from first 3 unique comps if relevant
  const parts = [];
  const partSeen = new Set();
  const namedFrames = page.findAllWithCriteria({ types: ['FRAME', 'ELLIPSE'] });
  for (const f of namedFrames) {
    if (!/^(window controls|traffic|close|minimize|zoom|titlebar|toolbar|sidebar|popover|sheet|alert|menu|separator|grabber)/i.test(f.name)) continue;
    const s = summarize(f);
    const sig = JSON.stringify([s.n, s.w, s.h, s.cr, s.cs, s.pad, s.gap, s.eff]);
    if (!partSeen.has(sig) && parts.length < 25) {
      partSeen.add(sig);
      parts.push(s);
    }
  }
  out[page.name] = { pageId: page.id, totalComps: comps.length, comps: unique.slice(0, 35), parts };
}

const bytes = JSON.stringify(out).length;
if (bytes > 44000) {
  for (const k of Object.keys(out)) {
    out[k].comps = out[k].comps.slice(0, 14);
    out[k].parts = out[k].parts.slice(0, 10);
  }
  return { bytes: JSON.stringify(out).length, trimmed: true, pages: out };
}
return { bytes, pages: out };

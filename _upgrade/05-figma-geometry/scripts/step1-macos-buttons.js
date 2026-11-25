// Step 1: Read-only verification call on macOS 27 kit — Buttons page (207:14487) + full page list
const pages = figma.root.children.map((p) => ({ id: p.id, name: p.name }));
const target =
  figma.root.children.find((p) => p.id === '207:14487') ||
  figma.root.children.find((p) => /buttons/i.test(p.name));

if (!target) {
  return { fileName: figma.root.name, pages, error: 'Buttons page not found' };
}

await figma.setCurrentPageAsync(target);

function pickEffects(node) {
  if (!('effects' in node) || !Array.isArray(node.effects) || node.effects.length === 0) return undefined;
  const visible = node.effects.filter((e) => e.visible !== false);
  if (visible.length === 0) return undefined;
  return visible.map((e) => ({
    type: e.type,
    radius: e.radius,
    spread: e.spread,
    offset: e.offset,
    color: e.color
      ? {
          r: Math.round(e.color.r * 255),
          g: Math.round(e.color.g * 255),
          b: Math.round(e.color.b * 255),
          a: Number(e.color.a.toFixed(3)),
        }
      : undefined,
  }));
}

function summarize(node) {
  const rec = {
    id: node.id,
    name: node.name,
    type: node.type,
    parentName: node.parent ? node.parent.name : null,
    parentType: node.parent ? node.parent.type : null,
    w: Number(node.width.toFixed(2)),
    h: Number(node.height.toFixed(2)),
  };
  if ('cornerRadius' in node) {
    if (typeof node.cornerRadius === 'number') {
      rec.cornerRadius = Number(node.cornerRadius.toFixed(2));
    } else if (node.cornerRadius === figma.mixed) {
      rec.cornerRadius = {
        tl: node.topLeftRadius,
        tr: node.topRightRadius,
        br: node.bottomRightRadius,
        bl: node.bottomLeftRadius,
      };
    }
  }
  if ('cornerSmoothing' in node && typeof node.cornerSmoothing === 'number') {
    rec.cornerSmoothing = Number(node.cornerSmoothing.toFixed(3));
  }
  if ('layoutMode' in node && node.layoutMode && node.layoutMode !== 'NONE') {
    rec.layoutMode = node.layoutMode;
    rec.pad = [node.paddingTop, node.paddingRight, node.paddingBottom, node.paddingLeft];
    rec.gap = node.itemSpacing;
  }
  const eff = pickEffects(node);
  if (eff) rec.effects = eff;
  return rec;
}

const sets = target.findAllWithCriteria({ types: ['COMPONENT_SET'] });
const comps = target.findAllWithCriteria({ types: ['COMPONENT'] });

const result = {
  fileName: figma.root.name,
  pageCount: pages.length,
  pages,
  page: { id: target.id, name: target.name },
  componentSetCount: sets.length,
  componentCount: comps.length,
  componentSets: sets.map(summarize),
  components: comps.map(summarize),
};

const bytes = JSON.stringify(result).length;
return { ...result, byteLength: bytes };

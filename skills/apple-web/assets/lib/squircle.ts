// Continuous corner (squircle) path generator matching Apple's corner smoothing.
// Port of the Figma corner smoothing algorithm (MIT, phamfoo/figma-squircle), simplified for equal corners.
// Use when CSS corner-shape: squircle is unsupported (Safari, Firefox).

export interface SquircleOptions { width: number; height: number; radius: number; smoothing?: number }

function cornerParams(radius: number, smoothing: number, maxSide: number) {
  let p = (1 + smoothing) * radius;
  const maxSmoothing = maxSide / radius - 1;
  if (p > maxSide) { smoothing = Math.min(smoothing, maxSmoothing); p = Math.min(p, maxSide); }
  const arcMeasure = 90 * (1 - smoothing);
  const arcSectionLength = Math.sin(toRad(arcMeasure / 2)) * radius * Math.sqrt(2);
  const angleAlpha = (90 - arcMeasure) / 2;
  const p3ToP4 = radius * Math.tan(toRad(angleAlpha / 2));
  const angleBeta = 45 * smoothing;
  const c = p3ToP4 * Math.cos(toRad(angleBeta));
  const d = c * Math.tan(toRad(angleBeta));
  let b = (p - arcSectionLength - c - d) / 3;
  let a = 2 * b;
  if (smoothing === 0) { a = 0; b = 0; }
  return { a, b, c, d, p, arcSectionLength, radius };
}
const toRad = (deg: number) => (deg * Math.PI) / 180;

export function squirclePath({ width: w, height: h, radius, smoothing = 0.6 }: SquircleOptions): string {
  const r = Math.min(radius, w / 2, h / 2);
  if (r <= 0) return `M0 0H${w}V${h}H0Z`;
  const { a, b, c, d, p, arcSectionLength: s } = cornerParams(r, smoothing, Math.min(w, h) / 2);
  const f = (n: number) => +n.toFixed(3);
  return [
    `M${f(w - p)} 0`,
    `c${f(a)} 0 ${f(a + b)} 0 ${f(a + b + c)} ${f(d)}`,
    `a${f(r)} ${f(r)} 0 0 1 ${f(s)} ${f(s)}`,
    `c${f(d)} ${f(c)} ${f(d)} ${f(b + c)} ${f(d)} ${f(a + b + c)}`,
    `L${w} ${f(h - p)}`,
    `c0 ${f(a)} 0 ${f(a + b)} ${f(-d)} ${f(a + b + c)}`,
    `a${f(r)} ${f(r)} 0 0 1 ${f(-s)} ${f(s)}`,
    `c${f(-c)} ${f(d)} ${f(-(b + c))} ${f(d)} ${f(-(a + b + c))} ${f(d)}`,
    `L${f(p)} ${h}`,
    `c${f(-a)} 0 ${f(-(a + b))} 0 ${f(-(a + b + c))} ${f(-d)}`,
    `a${f(r)} ${f(r)} 0 0 1 ${f(-s)} ${f(-s)}`,
    `c${f(-d)} ${f(-c)} ${f(-d)} ${f(-(b + c))} ${f(-d)} ${f(-(a + b + c))}`,
    `L0 ${f(p)}`,
    `c0 ${f(-a)} 0 ${f(-(a + b))} ${f(d)} ${f(-(a + b + c))}`,
    `a${f(r)} ${f(r)} 0 0 1 ${f(s)} ${f(-s)}`,
    `c${f(c)} ${f(-d)} ${f(b + c)} ${f(-d)} ${f(a + b + c)} ${f(-d)}`,
    'Z',
  ].join(' ');
}

export function supportsCornerShape(): boolean {
  return typeof CSS !== 'undefined' && CSS.supports?.('corner-shape', 'squircle') === true;
}

// Deliberately broken TSX sample matching the 9 seeded defects for lint.mjs verification.
export function DefectsSample() {
  return (
    <main className="p-4">
      <p style={{ fontSize: '23px' }}>Defect 1: Off-scale font size</p>
      <p style={{ color: '#123456' }}>Defect 2: Raw hex</p>
      <button type="button" className="w-[30px] h-[30px]">X</button>
      <button type="button" className="outline-none focus:outline-none">No Focus</button>
      <div style={{ transition: 'transform 250ms ease' }}>Ease timing</div>
      <div style={{ borderRadius: '15px' }}>Wrong radius</div>
      <p style={{ color: '#999999', backgroundColor: '#FFFFFF' }}>Low contrast</p>
      <div className="cf-glass bg-bg">Solid glass override</div>
      <div className="animate-spin">Ignores reduced motion</div>
    </main>
  );
}

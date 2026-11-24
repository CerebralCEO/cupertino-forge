'use client';
// Original synthesized UI sounds (no Apple assets). Off by default.
// Sounds are generated in real time with Web Audio so there are no files to ship on the web.
// Spec per sound lives in tokens/feedback.json. Flutter and Tauri use the rendered WAVs.

export type SoundName = 'tap' | 'toggle-on' | 'toggle-off' | 'tick' | 'success' | 'error' | 'send' | 'refresh' | 'keyboard';

let enabled = false;
let ctx: AudioContext | null = null;
let last = 0;
const MASTER = 0.35;
const THROTTLE_MS = 40;

export function setSoundsEnabled(v: boolean) { enabled = v; }

function ac() {
  if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function env(g: GainNode, t: number, peak: number, attack: number, decay: number) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

function tone(freq: number, start: number, dur: number, peak: number, type: OscillatorType = 'sine', glideTo?: number) {
  const c = ac();
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, start);
  if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, start + dur);
  env(g, start, peak * MASTER, 0.004, dur);
  o.connect(g).connect(c.destination);
  o.start(start); o.stop(start + dur + 0.05);
}

function click(start: number, centerHz: number, dur: number, peak: number) {
  const c = ac();
  const len = Math.floor(c.sampleRate * 0.01);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  src.buffer = buf;
  const bp = c.createBiquadFilter();
  bp.type = 'bandpass'; bp.frequency.value = centerHz; bp.Q.value = 1.2;
  const g = c.createGain();
  env(g, start, peak * MASTER, 0.001, dur);
  src.connect(bp).connect(g).connect(c.destination);
  src.start(start);
}

export function playSound(name: SoundName) {
  if (!enabled || typeof window === 'undefined') return;
  const now = performance.now();
  if (now - last < THROTTLE_MS) return;
  last = now;
  const t = ac().currentTime + 0.001;
  switch (name) {
    case 'tap': click(t, 4500, 0.025, 0.2); tone(1800, t, 0.025, 0.08); break;
    case 'toggle-on': tone(1200, t, 0.04, 0.12); tone(2400, t + 0.018, 0.04, 0.1); break;
    case 'toggle-off': tone(2400, t, 0.04, 0.1); tone(1200, t + 0.018, 0.04, 0.12); break;
    case 'tick': click(t, 6000, 0.012, 0.08); break;
    case 'success': tone(1318.5, t, 0.22, 0.12); tone(1975.5, t + 0.09, 0.26, 0.12); break;
    case 'error': tone(440, t, 0.12, 0.12, 'triangle'); tone(349.2, t + 0.11, 0.16, 0.12, 'triangle'); break;
    case 'send': {
      const c = ac();
      const len = Math.floor(c.sampleRate * 0.3);
      const buf = c.createBuffer(1, len, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      const src = c.createBufferSource(); src.buffer = buf;
      const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 2;
      bp.frequency.setValueAtTime(400, t); bp.frequency.exponentialRampToValueAtTime(3000, t + 0.3);
      const g = c.createGain(); env(g, t, 0.15 * MASTER, 0.08, 0.22);
      src.connect(bp).connect(g).connect(c.destination); src.start(t);
      break;
    }
    case 'refresh': tone(900, t, 0.03, 0.12, 'sine', 600); break;
    case 'keyboard': click(t, 3200, 0.008, 0.12); tone(180, t, 0.015, 0.1); break;
  }
}

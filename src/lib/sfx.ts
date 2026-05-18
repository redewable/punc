"use client";

/**
 * Tiny synthesized TV sound effects via Web Audio API.
 *
 * Synthesized rather than file-based so we ship 0 bytes of audio.
 * Mute state is persisted to localStorage and broadcast via a
 * CustomEvent so the toggle button and any other listener can stay
 * in sync without React state plumbing.
 */

const MUTE_KEY = "punc.sfx.muted";
const MUTE_EVT = "punc:sfx:mute";

let ctx: AudioContext | null = null;
const getCtx = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  try {
    ctx = new Ctor();
  } catch {
    ctx = null;
  }
  return ctx;
};

export const isMuted = (): boolean => {
  if (typeof window === "undefined") return true;
  // Default to MUTED — sites that autoplay sound get bounced.
  return localStorage.getItem(MUTE_KEY) !== "0";
};

export const setMuted = (m: boolean) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(MUTE_KEY, m ? "1" : "0");
  window.dispatchEvent(new CustomEvent(MUTE_EVT, { detail: m }));
};

export const onMuteChange = (cb: (muted: boolean) => void) => {
  const handler = (e: Event) => cb((e as CustomEvent<boolean>).detail);
  window.addEventListener(MUTE_EVT, handler);
  return () => window.removeEventListener(MUTE_EVT, handler);
};

/** Mechanical "click" — the chunky button on an old remote. */
export const playClick = () => {
  if (isMuted()) return;
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume();

  const now = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(1400, now);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
  osc.connect(gain).connect(c.destination);
  osc.start(now);
  osc.stop(now + 0.07);
};

/** Brief static hiss — the "snow" between channels. */
export const playStatic = (durationMs = 180) => {
  if (isMuted()) return;
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume();

  const sec = durationMs / 1000;
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * sec), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.7;

  const src = c.createBufferSource();
  src.buffer = buf;
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1200;
  const gain = c.createGain();
  const now = c.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.1, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + sec);
  src.connect(hp).connect(gain).connect(c.destination);
  src.start(now);
  src.stop(now + sec);
};

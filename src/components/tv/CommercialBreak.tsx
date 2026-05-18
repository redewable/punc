"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  /** Increments on every channel change. */
  signal: number;
  /** Trigger every Nth change. Default 4. */
  every?: number;
  /** Chance (0..1) the bumper actually fires when N is hit. Default 0.7. */
  chance?: number;
}

const BUMPERS = [
  "WE'LL BE RIGHT BACK",
  "STAY TUNED",
  "DO NOT TOUCH THAT DIAL",
  "MORE PURPLE UNC AFTER THIS",
  "DON'T BE A $PUNC",
  "DON'T BE A $PUNC ABOUT IT",
];

export function CommercialBreak({ signal, every = 4, chance = 0.7 }: Props) {
  const [visible, setVisible] = useState(false);
  const [copy, setCopy] = useState(BUMPERS[0]);
  const lastSignal = useRef(signal);
  const count = useRef(0);

  useEffect(() => {
    if (signal === lastSignal.current) return;
    lastSignal.current = signal;
    count.current += 1;
    if (count.current > 0 && count.current % every === 0 && Math.random() < chance) {
      setCopy(BUMPERS[Math.floor(Math.random() * BUMPERS.length)]);
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 1500);
      return () => clearTimeout(t);
    }
  }, [signal, every, chance]);

  if (!visible) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-black/85 commercial-fade">
      <div className="absolute inset-0 tv-static opacity-25" />
      <div className="relative text-center font-display flicker">
        <div className="text-unc-300 text-xs tracking-[0.5em] mb-3">
          A WORD FROM OUR SPONSORS
        </div>
        <div className="text-unc-50 text-5xl md:text-7xl crt-text">{copy}</div>
        <div className="text-unc-200 text-sm tracking-[0.4em] mt-3">
          (THERE ARE NO SPONSORS)
        </div>
      </div>
    </div>
  );
}

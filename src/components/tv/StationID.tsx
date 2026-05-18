"use client";

/**
 * Brief "station ID" card that shows on first load — like a TV channel
 * announcing itself before the show starts.
 */
import { useEffect, useState } from "react";

export function StationID() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1600);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center bg-black">
      <div className="flicker text-center font-display">
        <div className="text-unc-300 text-xs tracking-[0.5em] mb-3">YOU ARE TUNED TO</div>
        <div className="text-unc-50 text-6xl md:text-8xl crt-text">$PUNC TV</div>
        <div className="text-unc-200 text-sm tracking-[0.4em] mt-3">
          THE PURPLE CHANNEL · CH 13
        </div>
      </div>
      <div className="tv-static absolute inset-0 opacity-25" />
    </div>
  );
}

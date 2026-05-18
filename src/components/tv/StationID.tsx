"use client";

/**
 * Brief "station ID" card that shows on first load — like a TV channel
 * announcing itself before the show starts.
 */
import Image from "next/image";
import { useEffect, useState } from "react";

export function StationID() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1800);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center bg-black">
      <div className="flicker text-center font-display">
        <div className="text-unc-300 text-xs tracking-[0.5em] mb-4">
          YOU ARE TUNED TO
        </div>
        <Image
          src="/punctvbug.png"
          alt="$PUNC TV"
          width={520}
          height={260}
          priority
          className="mx-auto h-auto w-[260px] sm:w-[420px] md:w-[520px]"
        />
        <div className="text-unc-200 text-sm tracking-[0.4em] mt-4">
          THE PURPLE CHANNEL · CH 13
        </div>
        <div className="text-unc-300 text-[10px] tracking-[0.5em] mt-6">
          DON&apos;T BE A $PUNC
        </div>
      </div>
      <div className="tv-static absolute inset-0 opacity-25" />
    </div>
  );
}

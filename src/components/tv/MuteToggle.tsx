"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { isMuted, onMuteChange, playClick, setMuted } from "@/lib/sfx";

/**
 * Floating speaker icon — only audible chrome on the page. Defaults
 * muted (autoplay-sound sites get bounced) and persists per-user.
 */
export function MuteToggle() {
  const [muted, setLocal] = useState(true);

  useEffect(() => {
    setLocal(isMuted());
    return onMuteChange(setLocal);
  }, []);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setLocal(next);
    // Confirm the toggle with the very sound you just enabled.
    if (!next) setTimeout(playClick, 0);
  };

  return (
    <button
      onClick={toggle}
      aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
      aria-pressed={!muted}
      title={muted ? "Sound off — tap to enable TV clicks" : "Sound on"}
      className="fixed left-3 z-50 rounded-full border border-unc-300/40 bg-ink-800/90 p-2 text-unc-200 backdrop-blur hover:border-unc-300 hover:text-unc-50
                 bottom-[calc(env(safe-area-inset-bottom)+148px)]
                 md:bottom-6 md:left-6 md:p-2.5"
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
  );
}

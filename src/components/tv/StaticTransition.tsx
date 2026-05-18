"use client";

import { useEffect, useState } from "react";

/**
 * Fullscreen TV-static overlay shown briefly while switching channels.
 * Triggered by changing the `signal` prop.
 */
export function StaticTransition({ signal }: { signal: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 320);
    return () => clearTimeout(t);
  }, [signal]);

  if (!visible) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      <div className="tv-static absolute inset-0" />
      <div className="absolute inset-0 bg-black/15" />
    </div>
  );
}

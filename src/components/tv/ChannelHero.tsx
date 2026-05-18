"use client";

import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  /** Optional caption rendered as a lower-third inside the TV frame. */
  caption?: string;
  /** Aspect ratio. Defaults to 16/9, set "square" for the rare 1:1 panel. */
  aspect?: "video" | "square";
}

/**
 * Themed "TV thumbnail" for the top of each channel. Wraps the channel's
 * meme art in a CRT frame so it reads as a tuned-in show rather than a
 * decoration. Reused across CH 02 / 04 / 06 / 11.
 */
export function ChannelHero({ src, alt, caption, aspect = "video" }: Props) {
  return (
    <div
      className={[
        "relative mb-6 w-full overflow-hidden rounded-xl border border-unc-700/60 bg-black shadow-2xl sm:mb-8",
        aspect === "video" ? "aspect-[16/9]" : "aspect-square",
      ].join(" ")}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(min-width: 1024px) 1024px, 100vw"
        className="object-cover"
      />
      {/* CRT scanlines + vignette */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(0,0,0,0.5) 0 1px, transparent 1px 3px)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.6)_100%)]" />
      {caption && (
        <div className="absolute bottom-2 left-2 right-2 rounded bg-black/70 px-2 py-1 backdrop-blur md:bottom-3 md:left-3 md:right-3 md:px-3 md:py-1.5">
          <div className="font-display text-unc-100 text-[10px] tracking-[0.25em] md:text-xs">
            {caption}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

/**
 * The Vault — meme hub. Reads from /public/memes/manifest.json if present
 * (drop images into /public/memes/ and add filenames to the manifest, OR
 * the env can wire this to a CMS later). Falls back to a polite empty state.
 */

import { useEffect, useState } from "react";

interface MemeEntry {
  src: string;
  caption?: string;
  credit?: string;
}

export function Channel08Vault() {
  const [memes, setMemes] = useState<MemeEntry[] | null>(null);

  useEffect(() => {
    fetch("/memes/manifest.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((d: MemeEntry[]) => setMemes(Array.isArray(d) ? d : []))
      .catch(() => setMemes([]));
  }, []);

  return (
    <section className="tune-in mx-auto max-w-7xl px-6 pt-24 pb-40">
      <div className="mb-6">
        <div className="font-display text-unc-200 text-xs tracking-[0.4em] mb-1">
          ARCHIVE · RECOVERED FROM A DESKTOP FOLDER NAMED "stuff"
        </div>
        <h2 className="font-display text-4xl md:text-5xl text-unc-50 crt-text">
          THE VAULT
        </h2>
        <p className="mt-2 max-w-2xl text-unc-100/80">
          Memes the Unc has been saving since 2011. Right-click. Save. Repost
          without credit. The way he&apos;d want it.
        </p>
      </div>

      {memes && memes.length > 0 ? (
        <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
          {memes.map((m, i) => (
            <figure
              key={i}
              className="mb-4 break-inside-avoid overflow-hidden rounded-lg border border-unc-700/50 bg-black/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.src} alt={m.caption ?? "meme"} className="w-full" />
              {(m.caption || m.credit) && (
                <figcaption className="border-t border-unc-700/40 p-2 text-xs text-unc-100">
                  {m.caption} {m.credit && <span className="text-unc-300">— {m.credit}</span>}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-unc-700/60 bg-black/30 p-10 text-center">
          <div className="font-display text-unc-50 text-2xl crt-text">
            VAULT IS LOADING…
          </div>
          <p className="mx-auto mt-3 max-w-md text-unc-100/80">
            Drop meme files into{" "}
            <code className="rounded bg-black/60 px-1 py-0.5 text-unc-200">
              /public/memes/
            </code>{" "}
            and list them in{" "}
            <code className="rounded bg-black/60 px-1 py-0.5 text-unc-200">
              /public/memes/manifest.json
            </code>
            . The vault refreshes on reload.
          </p>
          <div className="mt-4 inline-block rounded border border-unc-700/60 bg-black/60 p-3 text-left font-mono text-[11px] text-unc-100">
{`[
  { "src": "/memes/unc-grills.png", "caption": "the unc, grilling" },
  { "src": "/memes/unc-chart.jpg",  "caption": "TA enthusiast" }
]`}
          </div>
        </div>
      )}
    </section>
  );
}

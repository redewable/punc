"use client";

/**
 * Late Night with the Unc — X Spaces recap channel.
 *
 * Reads from /public/spaces/manifest.json. Each entry is one Space.
 * Twitter's free API doesn't expose Spaces, so this is manifest-driven —
 * after a Space, drop a new entry in the JSON file and redeploy.
 */
import { useEffect, useState } from "react";

interface SpaceEntry {
  title: string;
  date: string; // ISO or human-readable
  host?: string;
  url?: string; // x.com/i/spaces/...
  recapUrl?: string; // optional link to recording
  durationMin?: number;
  guests?: string[];
  bullets?: string[]; // short recap notes
}

export function Channel03Spaces() {
  const [spaces, setSpaces] = useState<SpaceEntry[] | null>(null);

  useEffect(() => {
    fetch("/spaces/manifest.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((d: SpaceEntry[]) => setSpaces(Array.isArray(d) ? d : []))
      .catch(() => setSpaces([]));
  }, []);

  return (
    <section className="tune-in mx-auto max-w-7xl px-6 pt-24 pb-40">
      <div className="mb-6">
        <div className="font-display text-unc-200 text-xs tracking-[0.4em] mb-1">
          TALK SHOW · LIVE-ISH · NOT REHEARSED
        </div>
        <h2 className="font-display text-4xl md:text-5xl text-unc-50 crt-text">
          LATE NIGHT WITH THE UNC
        </h2>
        <p className="mt-2 max-w-2xl text-unc-100/80">
          Recaps from the X Space couch. The Unc says he&apos;s on mute. He is
          never on mute.
        </p>
      </div>

      {spaces && spaces.length > 0 ? (
        <ol className="space-y-4">
          {spaces.map((s, i) => (
            <li
              key={i}
              className="rounded-xl border border-unc-700/60 bg-black/40 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-display text-unc-300 text-[10px] tracking-[0.4em]">
                    EP {(spaces.length - i).toString().padStart(2, "0")} ·{" "}
                    {s.date}
                    {s.durationMin ? ` · ${s.durationMin} min` : ""}
                  </div>
                  <div className="mt-1 font-display text-unc-50 text-2xl crt-text">
                    {s.title}
                  </div>
                  {(s.host || (s.guests && s.guests.length > 0)) && (
                    <div className="mt-1 text-unc-200 text-xs tracking-[0.2em]">
                      {s.host && <>HOST: {s.host}</>}
                      {s.guests && s.guests.length > 0 && (
                        <>
                          {s.host && " · "}
                          GUESTS: {s.guests.join(", ")}
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 font-display">
                  {s.url && (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded border border-unc-300/40 bg-black/60 px-3 py-1 text-xs text-unc-100 tracking-[0.2em] hover:border-unc-400"
                    >
                      ON X ↗
                    </a>
                  )}
                  {s.recapUrl && (
                    <a
                      href={s.recapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded border border-unc-300 bg-unc-500 px-3 py-1 text-xs text-white tracking-[0.2em] btn-glow"
                    >
                      LISTEN ↗
                    </a>
                  )}
                </div>
              </div>

              {s.bullets && s.bullets.length > 0 && (
                <ul className="mt-4 space-y-1.5 text-unc-100/85 text-sm">
                  {s.bullets.map((b, j) => (
                    <li key={j} className="flex gap-3">
                      <span className="text-unc-400 mt-0.5">▸</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <div className="rounded-2xl border border-dashed border-unc-700/60 bg-black/30 p-10 text-center">
          <div className="font-display text-unc-50 text-2xl crt-text">
            DEAD AIR · SPACE NOT YET RECORDED
          </div>
          <p className="mx-auto mt-3 max-w-md text-unc-100/80">
            After a Space, append a new entry to{" "}
            <code className="rounded bg-black/60 px-1 py-0.5 text-unc-200">
              /public/spaces/manifest.json
            </code>{" "}
            and redeploy. Twitter&apos;s free API doesn&apos;t expose Spaces, so
            this stays manifest-driven.
          </p>
          <div className="mt-4 inline-block rounded border border-unc-700/60 bg-black/60 p-3 text-left font-mono text-[11px] text-unc-100">
{`[{
  "title": "We Talk to Cousins (Episode 1)",
  "date": "Sat · 11 PM ET",
  "host": "@purpleunc",
  "url": "https://x.com/i/spaces/...",
  "durationMin": 47,
  "bullets": ["Unc on monetary policy", "Hot takes on Raydium"]
}]`}
          </div>
        </div>
      )}
    </section>
  );
}

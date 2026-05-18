"use client";

/**
 * THE FAMILY GROUP CHAT — Channel 03.
 *
 * Static iMessage-style chat between the Unc and the cuz.
 * No live-stream commitment, no API: just a hand-written script that
 * tells the launch story in 2am uncle-text energy. Easy to extend by
 * adding entries to MESSAGES below.
 */

import type { ReactNode } from "react";

type Sender =
  | { who: "unc" }
  | { who: "cuz"; name: string; color: string; android?: boolean };

interface Message {
  from: Sender;
  text: ReactNode;
  reactions?: string[];
  /** Renders the time chip above the bubble (group start marker). */
  time?: string;
}

const UNC: Sender = { who: "unc" };
const MARCUS: Sender = { who: "cuz", name: "MARCUS", color: "text-sky-300" };
const TINA: Sender = { who: "cuz", name: "TINA", color: "text-pink-300" };
// Ray is the one cuz still on Android. Bubbles render green, the rest of the
// chat will not let him forget it.
const RAY: Sender = { who: "cuz", name: "RAY", color: "text-green-300", android: true };

const MESSAGES: Message[] = [
  { from: UNC, time: "TODAY · 2:14 AM", text: "WHO WANTS IN ON SOMETHING" },
  { from: UNC, text: "ITS PURPLE" },
  { from: MARCUS, text: "unc you said that about the timeshare" },
  { from: UNC, text: "THIS IS DIFFERENT" },
  { from: TINA, text: "different how. like legally different." },
  { from: UNC, text: "ITS A COIN" },
  { from: UNC, text: "ON THE BLOCKCHAIN", reactions: ["🤨"] },
  { from: RAY, text: "is this the same as nfts" },
  { from: MARCUS, text: "ray. ray. is your phone broken again." },
  { from: TINA, text: "ray ur in green again 💔" },
  { from: RAY, text: "whats wrong with green" },
  { from: MARCUS, text: "the bubble. the COLOR. the entire vibe." },
  { from: TINA, text: "it's literally ruining the chat aesthetic" },
  { from: RAY, text: "i can read it just fine" },
  { from: UNC, text: "RAY GET AN IPHONE", reactions: ["💚"] },
  { from: RAY, text: "no" },
  { from: UNC, text: "NO" },
  { from: UNC, text: "WAIT" },
  { from: UNC, text: "I DONT KNOW", reactions: ["😂", "😂"] },
  {
    from: UNC,
    text: (
      <span className="inline-flex items-center gap-2 rounded border border-unc-700 bg-black/60 px-2 py-1 text-xs text-unc-300">
        📷 IMG_4042.HEIC · couldn&apos;t be delivered
      </span>
    ),
  },
  { from: UNC, text: "DID YALL GET THE PICTURE" },
  { from: MARCUS, text: "no" },
  { from: TINA, text: "no" },
  { from: RAY, text: "no" },
  {
    from: UNC,
    time: "TODAY · 2:31 AM",
    text: (
      <span className="font-mono text-[11px] break-all">
        PASTE_PUMPFUN_MINT_HERE
      </span>
    ),
  },
  { from: TINA, text: "unc that's just a string of letters" },
  { from: UNC, text: "THATS THE CONTRACT" },
  { from: UNC, text: "BUY IT" },
  { from: UNC, text: "DONT BE A $PUNC", reactions: ["❤️", "❤️", "👍"] },
  { from: TINA, text: "ok one — that's not how the english language works" },
  { from: TINA, text: "two — counsel advises against." },
  { from: MARCUS, text: "counsel advises i'm in for 3 SOL" },
  { from: TINA, text: "MARCUS." },
  { from: MARCUS, text: "what" },
  { from: RAY, text: "how do i buy this on robinhood" },
  { from: MARCUS, text: "you don't" },
  { from: RAY, text: "ok how about cash app" },
  { from: MARCUS, text: "ray. it's on solana." },
  { from: RAY, text: "i don't know what that means" },
  { from: UNC, text: "CHANNEL 04" },
  { from: UNC, text: "GO TO CHANNEL 04" },
  { from: UNC, text: "THE INFOMERCIAL EXPLAINS EVERYTHING" },
  { from: TINA, text: "did you just send us to a different tv channel from a text" },
  { from: UNC, text: "YES" },
  {
    from: UNC,
    time: "TODAY · 3:02 AM",
    text: "ALSO IM IN MIAMI",
  },
  { from: MARCUS, text: "you live in toledo" },
  { from: UNC, text: "DETAILS", reactions: ["💀"] },
];

function Bubble({ m }: { m: Message }) {
  const mine = m.from.who === "unc";
  const android = m.from.who === "cuz" && m.from.android === true;
  const senderLabel = m.from.who === "unc" ? "UNCLE" : m.from.name;
  const senderColor =
    m.from.who === "unc" ? "text-unc-300" : m.from.color;

  // Bubble palette: Unc gets the iMessage-blue treatment in $PUNC purple;
  // cuz default to dark; Android cuz (Ray) gets SMS green.
  const bubbleClass = mine
    ? "rounded-br-md bg-unc-500 text-white"
    : android
    ? "rounded-bl-md bg-green-600 text-white border border-green-500/70"
    : "rounded-bl-md bg-ink-700 text-unc-100 border border-unc-700/60";

  return (
    <div className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
      {m.time && (
        <div className="my-3 self-center text-[10px] tracking-[0.35em] text-unc-400">
          {m.time}
        </div>
      )}
      {!mine && (
        <div className={`mb-0.5 ml-3 text-[10px] tracking-[0.3em] ${senderColor}`}>
          CUZ {senderLabel}
          {android && (
            <span className="ml-1 rounded-sm border border-green-500/60 bg-green-900/40 px-1 text-[8px] tracking-[0.2em] text-green-300">
              SMS
            </span>
          )}
        </div>
      )}
      <div
        className={[
          "max-w-[78%] rounded-2xl px-4 py-2 text-sm leading-snug shadow-sm",
          bubbleClass,
        ].join(" ")}
      >
        {m.text}
      </div>
      {m.reactions && m.reactions.length > 0 && (
        <div
          className={`mt-0.5 flex gap-0.5 rounded-full border border-unc-700/60 bg-ink-800 px-1.5 py-0.5 text-xs ${mine ? "mr-2" : "ml-2"}`}
        >
          {m.reactions.map((r, i) => (
            <span key={i}>{r}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export function Channel03Spaces() {
  return (
    <section className="tune-in mx-auto max-w-7xl px-4 pt-20 pb-32 sm:px-6 sm:pt-24 md:pb-40">
      <div className="mb-6">
        <div className="font-display text-unc-200 text-[10px] sm:text-xs tracking-[0.35em] sm:tracking-[0.4em] mb-1">
          MESSAGES · LIVE-ISH · 47 UNREAD
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-unc-50 crt-text">
          THE FAMILY GROUP CHAT
        </h2>
        <p className="mt-2 max-w-2xl text-unc-100/80 text-sm sm:text-base">
          What your uncle is sending to the chat at 2 AM. The cuz muted him in
          2019. He is unaware.
        </p>
      </div>

      {/* The "phone" */}
      <div className="mx-auto max-w-2xl rounded-3xl border border-unc-700/60 bg-ink-900/80 p-3 shadow-2xl sm:p-4">
        {/* Chat header — Apple-ish but uncle-themed */}
        <div className="mb-2 flex items-center justify-between gap-3 rounded-t-xl border-b border-unc-700/50 px-3 py-2 font-display">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-unc-500 text-white text-xs">
              👨‍🦳
            </div>
            <div className="min-w-0">
              <div className="text-unc-50 text-sm crt-text truncate">
                UNC + THE CUZ
              </div>
              <div className="text-unc-300 text-[10px] tracking-[0.25em]">
                4 PEOPLE · DO NOT DISTURB
              </div>
            </div>
          </div>
          <div className="shrink-0 rounded-full border border-red-500/50 bg-black/60 px-2 py-0.5 text-[9px] tracking-[0.25em] text-red-300">
            MUTED
          </div>
        </div>

        {/* Messages */}
        <div className="flex flex-col gap-1.5 px-1 py-2 sm:px-2">
          {MESSAGES.map((m, i) => (
            <Bubble key={i} m={m} />
          ))}

          {/* Typing indicator */}
          <div className="mt-3 flex items-center gap-2 text-unc-300 text-[11px]">
            <div className="flex h-6 items-center gap-1 rounded-full border border-unc-700/60 bg-ink-700 px-3">
              <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-unc-300 [animation-delay:-0.3s]" />
              <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-unc-300 [animation-delay:-0.15s]" />
              <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-unc-300" />
            </div>
            <span className="tracking-[0.2em]">UNCLE IS TYPING…</span>
          </div>
        </div>

        {/* Receipt footer */}
        <div className="mt-3 border-t border-unc-700/50 px-3 py-2 text-center font-display text-[10px] tracking-[0.3em] text-unc-300">
          DELIVERED · READ BY 1,247 CUZ · ONE LEFT THE CHAT
        </div>
      </div>
    </section>
  );
}

// Channel registry. The site is structured as a TV with N channels;
// adding a new section = adding a new channel here.

export type ChannelId =
  | "ch02"
  | "ch03"
  | "ch04"
  | "ch06"
  | "ch08"
  | "ch11"
  | "ch13"
  | "ch99";

export interface Channel {
  id: ChannelId;
  number: string; // displayed as "02", "04" etc.
  callSign: string; // e.g. "THE NEWS AT 11"
  category: string; // e.g. "NEWS", "INFOMERCIAL", "VARIETY"
  tagline: string; // shown on the channel guide
  bumper: string; // shown in the lower-third when channel is active
}

export const CHANNELS: Channel[] = [
  {
    id: "ch13",
    number: "13",
    callSign: "WORD FROM THE UNC",
    category: "MONOLOGUE",
    tagline: "An open letter, read aloud, badly.",
    bumper: "BROADCASTING LIVE FROM THE COUCH",
  },
  {
    id: "ch02",
    number: "02",
    callSign: "THE NEWS AT 11",
    category: "MARKETS",
    tagline: "Live chart. Live cope. No commentary needed.",
    bumper: "TONIGHT'S WEATHER: PURPLE WITH A CHANCE OF SEND",
  },
  {
    id: "ch03",
    number: "03",
    callSign: "LATE NIGHT WITH THE UNC",
    category: "TALK SHOW",
    tagline: "Recaps from the X Space couch. Off-mic comments still on mic.",
    bumper: "LATE NIGHT · NO COMMERCIAL BREAKS · NO BAND",
  },
  {
    id: "ch04",
    number: "04",
    callSign: "INFOMERCIAL",
    category: "PAID PROGRAMMING",
    tagline: "How to get your hands on a bag. BUT WAIT, THERE'S MORE.",
    bumper: "OPERATORS ARE STANDING BY · CALL NOW · CALL ALSO LATER",
  },
  {
    id: "ch06",
    number: "06",
    callSign: "FAMILY HOUR",
    category: "REALITY",
    tagline: "Roll call. See who's on the couch with you.",
    bumper: "FAMILY HOUR · NO REFUNDS · NO HUGS",
  },
  {
    id: "ch08",
    number: "08",
    callSign: "THE VAULT",
    category: "ARCHIVE",
    tagline: "Memes the Unc has saved to his desktop for 14 years.",
    bumper: "FROM THE VAULT · UNC HAS A FOLDER · YOU DO NOT WANT TO OPEN IT",
  },
  {
    id: "ch11",
    number: "11",
    callSign: "COMING UP NEXT",
    category: "PREVIEW",
    tagline: "Promos for shows that may or may not air.",
    bumper: "COMING UP NEXT · MAYBE NEVER · WHO'S TO SAY",
  },
  {
    id: "ch99",
    number: "99",
    callSign: "STATIC",
    category: "OFF AIR",
    tagline: "Hold the antenna and don't move.",
    bumper: "DO NOT ADJUST YOUR SET",
  },
];

export const DEFAULT_CHANNEL: ChannelId = "ch13";

export const getChannel = (id: ChannelId) =>
  CHANNELS.find((c) => c.id === id) ?? CHANNELS[0];

export const nextChannel = (id: ChannelId): ChannelId => {
  const idx = CHANNELS.findIndex((c) => c.id === id);
  return CHANNELS[(idx + 1) % CHANNELS.length].id;
};

export const prevChannel = (id: ChannelId): ChannelId => {
  const idx = CHANNELS.findIndex((c) => c.id === id);
  return CHANNELS[(idx - 1 + CHANNELS.length) % CHANNELS.length].id;
};

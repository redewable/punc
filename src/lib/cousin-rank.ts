/**
 * Cousin-rank role table — shared by the holder dashboard, the NFT mint route,
 * and the metadata/image generators. Single source of truth.
 */

export const COUSIN_ROLES = [
  "THE PATRIARCH",
  "AUNTIE",
  "CUZ-IN-LAW",
  "FIRST CUZ",
  "SECOND CUZ",
  "DISTANT CUZ",
  "PLUS-ONE",
  "RANDOM GUY EATING ALL THE CHIPS",
  "PHOTOGRAPHER",
  "THE QUIET ONE",
] as const;

export type CousinRole = (typeof COUSIN_ROLES)[number];

export const roleForRank = (rank: number): string => {
  // rank is 1-indexed.
  const idx = Math.max(0, rank - 1);
  if (idx < COUSIN_ROLES.length) return COUSIN_ROLES[idx];
  return `CUZ #${idx + 1}`;
};

/** How many top-N holders are eligible to mint a cousin-rank NFT. */
export const COUSIN_RANK_ELIGIBLE_TOP_N = 25;

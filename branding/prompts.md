# $PUNC visual asset prompts — Midjourney / DALL-E / Flux

The site is themed as a bootleg late-night public-access TV channel hosted
by your degenerate uncle. Everything should look slightly damaged, very
purple, and like it was taped off a CRT in 1997.

**Core palette:** deep violet `#2E1065`, neon purple `#7C3AED`, lavender wash
`#EADBFF`, hot magenta accents, true black, scanline gray. Subtle CRT bleed.

---

## 1. Hero portrait — "The Unc on TV"

A medium close-up portrait of a middle-aged man — confident, slightly weathered,
warm smile, faint smirk — wearing a deep purple velour tracksuit and sunglasses
indoors. He's sitting in a wood-paneled basement, holding a cordless phone,
posed like he's hosting a late-night cable show. The shot is framed as if seen
THROUGH a CRT television — heavy scanlines, slight barrel distortion, RGB
chromatic aberration on the edges, vignetting at the corners. Behind him: a
crooked framed family photo, a beer can on a TV tray, the glow of a purple
neon sign that reads "$PUNC". Color grading: deep violet shadows, magenta
highlights. Aspect ratio 4:5. Square crop ok.

Negative: clean, modern, photorealistic without distortion, smooth skin,
generic crypto bro, lambo, rocket, moon.

---

## 2. Logo mark — "$PUNC TV bug"

A stylized TV-station "bug" logo (the small corner watermark broadcasters use).
The text "$PUNC" in a chunky retro VT323 / Press Start 2P-style pixel font,
glowing neon purple, with a small TV silhouette icon next to it. Slight CRT
glow halo. Transparent background. 1:1.

Negative: 3D rendering, gradient mesh, drop shadows, modern flat-icon style.

---

## 3. Channel-guide thumbnails — set of 6

A series of 6 small (1:1 square) thumbnail illustrations, one per channel.
Style: late-90s VHS box-art meets public-access. Limited palette: purple +
black + magenta + one accent yellow. Heavy grain, slight VHS color bleed.

1. **CH 02 — THE NEWS AT 11.** A folding card-table "anchor desk" with the
   Unc behind it, a coffee mug labeled "COPE", a stack of papers, a fake
   "BREAKING" chyron. Studio lights too bright.
2. **CH 04 — INFOMERCIAL.** The Unc holding up a vacuum-cleaner-style product
   box that says "$PUNC" on it, big "AS SEEN ON CABLE" sticker, pointing.
3. **CH 06 — FAMILY HOUR.** A wide, slightly cramped family-portrait setup
   on a beige couch — cousins, an auntie, a kid eating chips, the Unc front
   and center. Photo-album warmth.
4. **CH 08 — THE VAULT.** An overflowing manila folder labeled "MEMES" on a
   cluttered desk, polaroids spilling out, a chunky CRT monitor showing pixel
   noise in the background.
5. **CH 11 — COMING UP NEXT.** A "STAY TUNED" intermission card style — the
   Unc with finger raised, "TONIGHT ON PURPLE…" headline.
6. **CH 99 — STATIC.** Pure TV snow. A single antenna silhouette. Eerie.

---

## 4. Background texture — "Wallpaper of the basement"

A seamless tileable texture: dark wood paneling with very faint purple
stenciled wallpaper underneath, slight smoke yellowing, dust motes. Used as
a subtle background layer at ~5% opacity. 1024×1024, tileable.

---

## 5. Mascot full-body — "The Unc, full pose"

Full-body cutout illustration (transparent background) of the Purple Unc:
deep purple velour tracksuit, gold chain over a wife-beater, slippers, holding
an antenna in one hand and a beer in the other. Slight smirk, sunglasses
indoors. Standing slightly contrapposto. Hand-drawn style with VHS-era
poster sensibilities. Vector-friendly outlines. Transparent background.

This is the "pasted cutout" you can layer over hero backgrounds.

---

## 6. Banner — Twitter / X header

Wide-aspect (3:1) banner. The Unc seen from the side, lounging in a recliner
in front of a wall of stacked CRT televisions, each showing a different
channel from this site (a chart, a meme, family portraits, static, a
"$PUNC" logo). Glowing purple neon spelling out "THE PURPLE CHANNEL" along
the top edge. Heavy VHS scan effect. Color: deep violet + magenta + black.

---

## 7. PFP — circular profile picture

The Unc bust shot, framed in a circular "TV roundel" with a small CH-13
badge overlay. Tight crop on face + sunglasses. Background: pure purple
gradient. 1:1. Designed to read clearly at 64×64.

---

## Asset slot map — where each file goes

| File path | Source prompt | Notes |
|---|---|---|
| `/public/logo.jpg` | (already provided) | The Unc — currently used in the Ch 13 CRT |
| `/public/og.png` | #6 banner, re-cropped 1200×630 | Open Graph share image |
| `/public/pfp.png` | #7 PFP | X profile picture |
| `/public/banner.png` | #6 banner | X header |
| `/public/channels/ch02.png` | #3.1 | Optional — TV-guide thumbnail |
| `/public/channels/ch04.png` | #3.2 | Optional |
| `/public/channels/ch06.png` | #3.3 | Optional |
| `/public/channels/ch08.png` | #3.4 | Optional |
| `/public/channels/ch11.png` | #3.5 | Optional |
| `/public/channels/ch99.png` | #3.6 | Optional |
| `/public/memes/*.png` | — | Drop meme files here + register in `manifest.json` |

If you skip the optional channel thumbnails, the site falls back to the
existing typographic CRT treatment — still on-vibe.

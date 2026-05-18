# /public/memes — The Vault feed

Drop image files here (PNG, JPG, GIF, WebP). Then add them to `manifest.json`:

```json
[
  { "src": "/memes/unc-grills.png", "caption": "the unc, grilling" },
  { "src": "/memes/cope-chart.jpg", "caption": "TA enthusiast",      "credit": "@some_user" }
]
```

Channel 08 (The Vault) reads from `manifest.json` and renders a masonry gallery.
Empty array → polite "Vault is loading…" empty state, no errors.

# KYNORA WORKS — website

Homepage directions for **KYNORA WORKS**, a studio for software, marketing, design and culture.

> We build the work and the world around it.
> Technical in substance. Creative in expression. Cultural in spirit.

## About KYNORA

KYNORA WORKS is a creative and technical studio working across four disciplines: software, marketing, design and culture. Instead of a dev shop for the product, a creative agency for the identity, a marketing team for the launch and someone else for community, KYNORA brings it into one team. Strategy, build and story are made together from day one, so what launches already works and already has people talking.

- **Software** — apps, platforms and internal tools engineered to scale.
- **Marketing** — launches, content and campaigns made to be shared.
- **Design** — identity, product and motion, held to one standard.
- **Culture** — events, communities and moments that give a brand a place in people's lives.

## What's in here

| File | What it is |
|---|---|
| `ideas.html` | Switcher: flip between every direction (tabs, keys 1–5, `[` `]`) |
| `kynora-home.html` | Current homepage (source; body-only fragment) |
| `index.html` / `idea-current.html` | Current homepage wrapped as a full document |
| `idea-mono.html` | Mono: black-and-white photo hero, giant wordmark, floating menu |
| `idea-soft.html` | Soft: light, warm gradients, UI cards, pinned services |
| `idea-editorial.html` | Editorial: serif headline in a typed-glyph burst |
| `idea-wall.html` | Wall: endless WebGL wall you scroll, drag and fling, with a lens bend |
| `assets/`, `hero-options/` | Photos (Unsplash License) |

Every page is a single self-contained HTML file; libraries load from CDNs with pinned versions.

## Run it locally

```bash
python3 .claude/serve.py
```

Then open http://localhost:5173/ideas.html (the server sends no-cache headers so edits always show).

## Brand

- Colours: paper `#F0ECE2`, ink `#1F1B17`, vermilion `#E94627` (accent), plus ember, amber, blush, dusk and night.
- Type: Archivo (variable width) for display, Geist for body, Geist Mono for labels.
- Client names, results and quotes on the pages are placeholders.

# Asset sources & licenses

All third-party media is royalty-free and usable commercially without attribution under its license. Credits are listed anyway.

## Grading
All photos and videos are colour-graded with one ffmpeg chain so they match the Midnight Iris palette (violet/aqua):
`colorbalance=rs=-0.06:gs=-0.03:bs=0.07:rm=-0.04:bm=0.05:rh=-0.03:bh=0.04,eq=saturation=0.88–0.92:contrast=1.05:brightness=-0.03`.

## Videos (`/public/videos`) — Pexels License (https://www.pexels.com/license/), free for commercial use
Each clip comes in four files: `name.mp4` (H.264, 1280×720), `name.webm` (VP9), `name-m.mp4` and `name-m.webm` (720×1280 portrait centre crop for phones, picked with `<source media="(max-width:767px)">`). Each also has `name-poster.webp` and `name-poster-m.webp`. All are 24 fps, muted, played inline, with no audio track.
| File | Source | Notes |
|---|---|---|
| hero-loop | "Mesmerizing Abstract Energy Animation Loop" by Colin Jones — https://www.pexels.com/video/mesmerizing-abstract-energy-animation-loop-35262088/ | 10 s excerpt (from 0:20), CRF 28 |
| scrub | "Vibrant Purple and Blue Particle Explosion" by Nicola Narracci — https://www.pexels.com/video/vibrant-purple-and-blue-particle-explosion-35049014/ | **all-intra `-g 1`** for scroll scrubbing, CRF 31. MP4 only, because a VP9 all-intra encode was 20–28 MB. |
| cta-loop | "Abstract 3D Glowing Purple Shape Animation" by Nicola Narracci — https://www.pexels.com/video/abstract-3d-glowing-purple-shape-animation-34637934/ | CRF 28 |

## Photos (`/public/images`) — Pexels License, graded, WebP ≤1920px q74
| File | Pexels photo |
|---|---|
| vortex.webp | https://www.pexels.com/photo/36174639/ (Pușcaș Adryan) |
| data-rain.webp | https://www.pexels.com/photo/12489187/ (Marek Piwnicki) |
| tunnel.webp | https://www.pexels.com/photo/34997851/ (Carlos Misael Cruz López) |
| fibers.webp | https://www.pexels.com/photo/8640331/ (Georgie Devlin) |
| shapes.webp | https://www.pexels.com/photo/33839920/ (Steve A Johnson) |
| light-tunnel.webp | https://www.pexels.com/photo/14212240/ (Beyza Kaplan) |
| orb.webp | frame from the cta-loop Pexels video 34637934 |
| wave.webp | frame from Pexels video https://www.pexels.com/video/34550739/ (Nicola Narracci) |
| ai-network.webp | https://www.pexels.com/photo/8386440/ |
| connections.webp | https://www.pexels.com/photo/373543/ |
| neon-dashboard.webp | https://www.pexels.com/photo/5475750/ |
| robot-touch.webp | https://www.pexels.com/photo/6153354/ |
| code.webp | https://www.pexels.com/photo/1181675/ |
| team-insights.webp | https://www.pexels.com/photo/7688336/ |
| human-ai.webp | https://www.pexels.com/photo/8386434/ |
| team.webp | https://www.pexels.com/photo/3183150/ |
| servers.webp | https://www.pexels.com/photo/325229/ |
| reporting.webp | https://www.pexels.com/photo/590022/ |
| experience.webp | https://www.pexels.com/photo/8728382/ |
| laptop.webp | https://www.pexels.com/photo/1181244/ |

The six unknown-origin `design-*.webp` images taken from the supplied HTML have been **removed** and replaced with the Pexels images above.

## Brand
- `logo.svg`, `icon.svg` — placeholder wordmark/icon created for this project. Replace `public/logo.svg` (used only via `components/Logo.tsx`).
- `og.png` — generated from ai-network.webp.

## Fonts
- Sora (headings) and Inter (body): SIL Open Font License 1.1, loaded via next/font/google.
- Instrument Serif and Geist Mono: SIL Open Font License 1.1, loaded via next/font/google.
- Satoshi and Clash Display are no longer used, and their files have been removed.
- Icons: lucide-react (ISC License). The particle shapes are sampled from lucide icon outlines (`lib/iconShapes.ts`, generated from the lucide package).

## Design reference
The layout and visual direction are modelled on "AI Agency Website" by RedDevs on Dribbble (https://dribbble.com/shots/27798807-AI-Agency-Website). Screenshots are kept in `/workspace/evolviq/ref/` for internal reference only and are **not** shipped in the site.

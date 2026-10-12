# Asset sources & licenses

All third-party media is royalty-free and usable commercially without attribution under its license. Credits are listed anyway.

## Videos (`/public/videos`) — Pexels License (https://www.pexels.com/license/)
| File | Source | Processing |
|---|---|---|
| `hero-loop.mp4` + `hero-loop-poster.webp` | "Futuristic 3D Network Animation with Glowing Nodes" by Nicola Narracci — https://www.pexels.com/video/futuristic-3d-network-animation-with-glowing-nodes-33164595/ | 1280px, H.264 CRF 31, 10 s, no audio, hue-shifted to brand cyan, faststart |
| `scrub.mp4` + `scrub-poster.webp` | "Plexus Of Abstract Geometrical Lines And Figures" — https://www.pexels.com/video/plexus-of-abstract-geometrical-lines-and-figures-3129576/ | 1280px, 24 fps, **all-intra (`-g 1`)** for smooth scroll scrubbing, CRF 30, no audio |
| `cta-loop.mp4` + `cta-loop-poster.webp` | "Abstract Network of Connection Nodes in Purple" by Nicola Narracci — https://www.pexels.com/video/abstract-network-of-connection-nodes-in-purple-36245009/ | 1280px, CRF 29, no audio |

## Photos (`/public/images`) — Pexels License, converted to WebP (≤1600px, q72)
| File | Pexels photo |
|---|---|
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

## Extracted from the supplied design (`QuantaloomAI — Cinematic v3.html`)
`design-core/network/wave/orb/grid/tunnel.webp` were decoded from the base64 images embedded in the client-supplied HTML and re-encoded to WebP. Their original provenance is not documented in that file — **confirm the client holds rights before launch**, or swap for the Pexels images above.

## Brand
- `logo.svg`, `icon.svg` — placeholder wordmark/icon created for this project. Replace `public/logo.svg` (used only via `components/Logo.tsx`).
- `og.png` — generated from ai-network.webp.

## Fonts
- Satoshi, Clash Display — Indian Type Foundry via Fontshare, ITF Free Font License (free for commercial use). Self-hosted in `app/fonts/`.
- Instrument Serif, Geist Mono — SIL Open Font License 1.1, loaded via next/font/google.
- Icons: lucide-react — ISC License.

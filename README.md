# Evolviq AI — Website (Next.js)

Cinematic marketing site for **Evolviq AI**, translated from the "Cinematic v3" HTML design into Next.js (App Router, TypeScript, Tailwind CSS v4). All copy comes from `Evolviq_AI_Website_Content_Master.md` and lives in `lib/content.ts`.

## Run
```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run build && npm start   # production
```
Requires Node 20+.

## Environment (optional, `.env.local`)
| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical host for metadata, sitemap, OG (default `https://www.evolviq.ai`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public contact email (default `info@evolviqai.com`) |
| `NEXT_PUBLIC_BOOKING_URL` | "Schedule an AI Consultation" link on /contact |
| `RESEND_API_KEY` | Server-only Resend API key used by `/api/contact`; never expose it with a `NEXT_PUBLIC_` variable |
| `RESEND_FROM_EMAIL` | Optional sender address on a domain verified in Resend (defaults to `Evolviq AI <contact@evolviqai.com>`) |
| `RESEND_TEST_TO` | Optional destination for the Resend test script (defaults to `info@evolviqai.com`) |

The contact form emails submissions to `info@evolviqai.com` through Resend. Configure `RESEND_API_KEY` in `.env.local` for local development and in the deployment provider's server-side environment settings. For production, verify your sending domain in Resend and set `RESEND_FROM_EMAIL` to an address on that domain.

Example `.env.local`:

```dotenv
NEXT_PUBLIC_SITE_URL=https://www.evolviq.ai
NEXT_PUBLIC_CONTACT_EMAIL=info@evolviqai.com
RESEND_API_KEY=re_your_rotated_resend_api_key
RESEND_FROM_EMAIL="Evolviq AI <contact@evolviqai.com>"
```

Replace the key placeholder with your rotated API key. The default sender uses the verified `evolviqai.com` domain; you can override it with any sender address on a domain verified in your Resend account. Keep `.env.local` private and never use a `NEXT_PUBLIC_` prefix for the API key.

Run `npm run test:resend` to send a test email using these settings, or `npm run test:resend -- --dry-run` to check the configuration without sending. The key is read locally and is never printed by the script.

## Cinematic engine
- `components/ParticleField.tsx` — global fixed WebGL (three.js) particle field ported from the original: 12k points (5k mobile) morphing between 8 shapes (core, network, neural, helix, lattice, "AI" glyph, clusters, stack), fbm fog with tint crossfade, mouse repulsion + camera parallax, scroll-velocity jitter, signal pulse. Paused when the tab is hidden; static frame under reduced motion.
- `components/ParticleNetwork.tsx` — reusable 2D canvas particle network (rAF, DPR-aware, IntersectionObserver-paused, cursor-reactive).
- `components/FxChrome.tsx` — intro loader + iris reveal, custom cursor, chapter cards, section rail, letterbox, scramble-decode eyebrows, per-scene shape switching. Sections opt in with `data-scene data-shape data-x data-name [data-lb]`.
- `components/ZoomStack.tsx` — pinned zoom-through scene (used by Solutions, Phases, Principles).
- `lib/fx.ts` — shared camera/shape state.

## Structure
- `app/` — routes: `/`, `/about`, `/solutions`, `/use-cases`, `/industries`, `/products` (noindex holding page), `/contact`, `api/contact`, `sitemap.ts`, `robots.ts`
- `components/` — `Hero` (video loop + parallax), `ScrollVideo` (pinned section, video `currentTime` scrubbed by GSAP ScrollTrigger, text beats via framer-motion), `Workflow` (animated SVG graph), `SolutionsShowcase` (sticky stacking cards w/ parallax), `Marquee`, `AgentRing`, `Approach` (GSAP pinned horizontal scroll), `Phases` (tabs), `Mosaic`, `Manifesto` (scroll-lit words), `VideoCta`, `SmoothScroll` (Lenis ↔ ScrollTrigger), `Logo`, etc.
- `lib/content.ts` — all copy · `lib/site.ts` — nav & site config · `lib/meta.ts` — per-page metadata helper
- `public/videos`, `public/images` — optimized media (see `ASSETS.md`)

## Swapping the logo
Replace `public/logo.svg` (≈5.5:1 aspect). It's referenced only by `components/Logo.tsx`.

## Accessibility & motion
`prefers-reduced-motion` disables Lenis, GSAP pins, parallax, autoplaying video and the scrub section (replaced by static stacked text). Skip link, focus rings, semantic headings, keyboard-operable tabs/menus.

## Re-encoding a scrub video
```bash
ffmpeg -i input.mp4 -an -vf "scale=1280:-2,fps=24" -c:v libx264 -crf 30 -g 1 -pix_fmt yuv420p -movflags +faststart public/videos/scrub.mp4
```
`-g 1` (every frame a keyframe) makes seeking instant in both scroll directions.

## Before launch (from the content master)
Verify domain, email, booking link, policies; configure Resend; confirm rights on the `design-*.webp` images.

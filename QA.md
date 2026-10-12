# QA — Task 7 (13 Oct 2026, PKT)

Server: `next start` (production build) on :3100. Headless Chromium (swiftshader WebGL). Viewports: 1440×900, 1280×800, 768×1024, 390×844.
Screenshots: `/workspace/evolviq/shots7/` (`qa/` = per-route scroll captures).

## Particles vs light bands
- [x] Light (paper) bands are opaque (`background-color` on `[data-theme=light]`, `.section:not([data-theme=dark])`) and sit above the fixed canvas.
- [x] ParticleField probes the viewport (elementFromPoint at 30/50/75%) every 6 frames; on light it fades the canvas to 0 and pauses rendering after 600 ms. Verified at 1280 and 390: `fx.light=true`, `canvas opacity=0` (`light-band-1280.png`, `light-band-390.png`).
- [x] Wide shapes (brain, pipeline, icons) are scaled to fit the viewport width on phones (99.5th-percentile extent per shape).

## Shape placement next to media (dark sections)
- [x] Scenes mark the text column with `[data-fx-text]` and the media with `[data-fx-media]`. ParticleField measures the visible text column's bounding box (live, so it follows resizes) and moves and scales the shape onto that column. The existing `.scrim` stays in place.
- [x] When the text column is ≥70% of the viewport width (stacked mobile layouts, full-bleed video/CTA), the scene gets `[data-fx-stack]` and its media drops to 34% opacity with a top→bottom gradient mask.
- Covered sections: home Solutions showcase, Scroll-video beats, video CTA (every page), Products status band. Hero and PageHero keep their translucent full-bleed plates (30–40%).
- Results: solutions anchors to the text side at 1440/1280/768 and stacks at 390; scroll-video is side-by-side at 1440 and stacked at ≤1280; CTA is stacked (centred) at every width. See `media-text/`.

## Routes (all 4 viewports)
| Check | Result |
|---|---|
| Horizontal overflow | 0 px on every route/viewport |
| Console/page errors | none (the 404 route logs its expected 404 document) |
| Failed requests ≥400 | none |
| Broken images | none |
| Videos | all readyState 4; `-m` portrait variants are served at 390 |
| One `<h1>` per page | yes |
| 404 | `/nope` → HTTP 404 with custom page |

## Links (curl crawl)
- [x] Every internal href → 200 (`/`, `/about`, `/solutions`, `/use-cases`, `/industries`, `/products`, `/contact`, icons).
- [x] Anchors exist: `/solutions#workflow-automation, #voice-agents, #chatbots, #crm-automation, #custom-ai, #ai-websites, #analytics`, `/contact#form, #faqs`, `#main` (skip link).

## Navigation
- [x] Active state (`aria-current=page`) is correct, e.g. `/about`.
- [x] Logo links home; back/forward work (`/` ⇄ `/about`).
- [x] Mobile menu opens (visible, scroll locked), Tab focus is trapped, Escape closes and returns focus to the button, scroll unlocks, and the menu closes on route change (`mobile-menu-open.png`).
- [x] Footer links are all part of the crawl above.
- [x] Contact form: an empty submit is blocked and name/email/message are flagged invalid (`contact-validation.png`).

## Buttons audit
- Every `a.btn`, `button` and round link was checked for visible text and contrast (canvas-normalised colours) at 1280 and 390 on all routes.
- Text contrast was ≥4.5 everywhere it could be measured.
- Fixes:
  - The hamburger was icon-only; it now has a visible "Menu"/"Close" label.
  - The section-dot rail now shows its label on hover/focus, the active label is always visible, and each dot has the aria-label "Jump to section: …".
  - Showcase CTAs have aria-labels.
- Before/after crops: `buttons/before`, `buttons/after`.

## Products page
- Redesigned:
  - hero (dark, real-logo particle shape);
  - light band with product intro and four challenge cards (wording from content.md);
  - dark status band;
  - light "Core solutions" cards linking to the solutions;
  - video CTA.
- Still `noindex` and not in the sitemap, as content.md §07 requires. No invented names, pricing or dates.
- Overflow 0 and no errors at all 4 widths (`products/`).

## Logo
- Vector SVGs come from `final-logo.pdf`: background path removed, viewBox trimmed. svgo was skipped because it broke the crops.
  - `public/brand/logo-white.svg`, `logo-dark.svg`, `mark.svg`, `logo-full-*.svg`.
- Dark version on the nav pill; white version in the footer and loader.
- `app/icon.png`, `apple-icon.png`, `favicon.ico`, `public/icon.svg` and `og.png` are generated from the mark.
- The CTA/products particle shape samples the real wordmark.
- Shots: `logo-nav-desktop.png`, `logo-nav-mobile.png`, `logo-footer.png`, `logo-favicon.png`.

## Build
- `npm run lint` clean; `npm run build` passes.

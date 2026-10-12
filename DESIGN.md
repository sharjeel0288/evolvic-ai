# Evolviq AI — Design System ("Midnight Iris")

## Research (Oct 2026)
- 2026 web design trends: restrained depth, precise type, no "gradient soup" — https://aydesign.ai (2026 trends)
- Dark-mode SaaS UI patterns: tinted near-black surfaces, elevation through lighter surfaces — https://saasui.design
- Dark colour architecture, OKLCH/APCA contrast thinking — https://builtux.com
- Dark dashboard and landing-page patterns: hairline borders, one signature accent — https://aydesign.ai

Takeaways: never pure black; a single signature accent plus one support colour; 1px hairlines instead of heavy borders; glass used sparingly; display/body font pairing; mono for metadata.

## Direction
Calm, technical, premium. Iris violet is the signature colour, aqua is the support colour. Surfaces are tinted midnight. Glow appears only on interaction.

## Colour tokens (in `app/globals.css` `@theme`)
| Token | Hex | Use |
|---|---|---|
| bg | #07080c | page |
| s1 / s2 / s3 | #0d0f15 / #12151d / #1a1e28 | elevation 1–3 |
| ink | #ecedf1 | headings (~17:1 on bg) |
| ink2 | #b4b8c4 | body (~10:1) |
| mut | #8a90a0 | meta (~6:1, AA) |
| iris / violet | #a99cff / #8e7bff | accent, focus, labels |
| cyan | #5ce1e6 | secondary accent / live |
| blue | #6f8bff | gradients |
`--accent-grad`: #a99cff → #8e7bff → #5ce1e6. Hairlines: `--line` rgba(255,255,255,.07), `--line-2` .12.

## Type
- Display: Clash Display 500/600, tracking -0.022em, sentence case
- Body: Satoshi 400/500/700
- Accent: Instrument Serif italic
- Labels / numbers: Geist Mono, uppercase, tracking .14em

## Cards (`.nm`)
Glass surface (s1 at ~70% with backdrop blur), a 1px gradient hairline drawn in `::before`, an inner top highlight, and an iris spotlight with `--shadow-glow` on hover. Each card follows the same order: icon tile (lucide, 1.6 stroke) with `.num` index → `.card-title` → `.card-body` → chips/CTA.

## Spacing / radius / shadow
Radius: card 20px, small 12px, pill 999px. Spacing follows a 4px grid; cards use 28px padding with 16px gaps; sections use the existing `px-site` container (1200px).
Shadows: `--shadow-card` (soft ambient plus inset highlight) and `--shadow-glow` (iris, used on hover only).

## Components
Pill nav (blurred, active state shown as a filled pill), primary button (light pill with iris glow), secondary button (glass pill), fields with iris focus ring, radio chips, and a footer on s1 with a gradient top hairline.

# Evolviq AI — Design System v3: "Paper & Indigo"

## Reference
RedDevs, "AI Agency Website" (Utomic template) on Dribbble — https://dribbble.com/shots/27798807-AI-Agency-Website
Downloaded shots: `/workspace/evolviq/ref/ref-01…09` (`ref-04.jpg` is the full-length page; `long-0…5.jpg` are slices of it).

### What the reference does
- **Light and dark sections alternate.** Paper sections are `#f5f5f5` with pure-white cards. Feature, service and testimonial sections are pure black `#000` with near-black cards and 1px hairline borders.
- **Hero:** a vertical gradient from white/lilac (`#e9e7ff`, `#d6d4fd`) through indigo (`#4a3da9`, `#1d126e`) to deep navy (`#070040`) and black. A huge white wordmark ("COGNITIVE") is overlaid by a 3D wire head, and a translucent glass card sits to the right.
- **Accent:** a single electric violet, `#5b4cf5`. The CTA band at the bottom fades from paper to violet to indigo. The footer is black fading into indigo (`#281c7c`).
- **Type:** a light geometric grotesk (weight 300–400) with tight tracking for headings. Headings are often two-tone, black then grey ("…into clear, *scalable business intelligence*"). Body text is a neutral grotesk at 13–15px.
- **Eyebrows:** a small node glyph followed by a sentence-case label ("⁂ Who we are"), not mono caps.
- **Buttons:** compact pills, black on paper and white on dark, plus round arrow buttons.
- **Cards:** 16px radius and flat, with no glass or glow at rest. Large light-weight stat numerals ("250+", "94%").
- **Decoration:** a circular tick dial ("12+"), a logo marquee, and 3D purple product renders.

## Tokens (`app/globals.css`)
Everything resolves through `--c-*` variables. Add `data-theme="light"` (or use `.section`) to switch any subtree to the paper palette, and `data-theme="dark"` to switch back.

| Token | Dark | Light |
|---|---|---|
| bg | #000000 | #f5f5f5 |
| s1 / card | #0b0b0e / #0a0a0d | #ffffff |
| ink | #ffffff | #0a0a0a |
| ink2 | #c4c4cc | #3f3f46 |
| mut | #8d8d98 | #6b6b75 (AA on #f5f5f5) |
| iris (labels/links) | #b3abff | #5b4cf5 |
| line | rgba(255,255,255,.10) | rgba(10,10,10,.08) |

Fixed colours: violet `#5b4cf5`, indigo `#1d126e`, navy `#070040`, lilac `#d6d4fd`.
Gradients: `.hero-grad`, `.cta-grad`, `.foot-grad`.

## Type
- **Headings:** Sora 300/400/500, tracking -0.035em, sentence case. `.tone` gives the grey half of a two-tone heading.
- **Body:** Inter 400/500/600.
- **Accents:** Instrument Serif italic.
- **Data:** Geist Mono, kept only for small data labels.
- **Eyebrows (`.mono`):** Inter 500 13px with a node-glyph mask.

## Components
- **Cards (`.nm`):** flat, 16px radius. White on paper, near-black with a hairline on dark. On hover they lift with an indigo shadow and a violet gradient border. The scroll-linked sheen is kept. `.glass` is the translucent hero card.
- **Buttons:** `.btn.p` is an ink pill that turns violet on hover. `.btn` is a hairline pill. `.arrow-dot` is a round arrow button that rotates 45° on hover.
- **Nav:** a white pill with a dark logo, a black "Book a Consultation" pill, and a black round menu button on mobile, as in the reference.
- **Footer:** black fading to indigo, with a lilac hairline and an outline wordmark.
- **Decoration:** the `.dial` tick ring rotates slowly behind the hero particle brain.

## Section themes (home)
- **Dark:** hero (gradient), workflow, scroll-video, solutions, principles, approach, agent ring, manifesto, CTA, footer.
- **Paper:** use cases, mosaic (dark image panels on paper), phases (dark media card), products/about, insights.
- **Subpages:** dark page hero followed by paper `.section` blocks.

## Particles
The particle field is retinted to the indigo–lilac range. Shapes now match their content:
- brain (hero), pipeline (workflow), chaos → order (scroll-video);
- gear, phone, chat, database, agent and globe for the six solution slides;
- document, handshake and mail for principles and contact;
- chart (insights) and the Evolviq wordmark (CTA).

Sprite types are glowing orbs with hot cores, cross-flare sparkles and large faint bokeh. Every particle has its own size and twinkle, and morphs use a swirl. See `components/ParticleField.tsx`.

## Spacing / radius / shadow
- **Spacing:** 4px grid. Sections use `clamp(96px, 11vw, 150px)` vertical padding inside a 1200px container.
- **Radius:** cards 16px, small 12px, pills 999px.
- **Shadow:** none at rest. On hover, `0 24px 50px -28px rgba(29,18,110,.35)` on paper and `0 24px 60px -30px rgba(91,76,245,.55)` on dark.

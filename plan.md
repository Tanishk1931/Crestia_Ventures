# Premium 3D Animated Hero Page — Plan (updated)

Status: **implemented**.

Direction from the client: ignore the existing site theme, follow the original hero brief, blank the home/landing page, and keep only the RCM page with the 3D monitor animation.

Local preview: serve `public_html/` with any static server and open `/rcm/`.

---

## 1. Project structure overview

This workspace is a GoDaddy/cPanel account extract for `crestiaventures.com`. There is no WordPress install in it: no PHP, no `wp-content`, no theme.

| Path | What it is |
|---|---|
| `public_html/index.html` | Home / landing page. **Now intentionally blank** (empty dark document). |
| `public_html/rcm/` | **The RCM page (new).** `index.html`, `rcm.css`, `rcm.js`, `gsap.min.js` |
| `public_html/main-*.js`, `chunk-*.js`, `polyfills-*.js`, `styles-*.css` | Old compiled Angular homepage bundles. No longer loaded by `index.html`. Left on disk, unmodified. |
| `public_html/crestiaventures-backup.zip` | Backup of the old homepage (includes the original `index.html`). Restore from here if needed. |
| `public_html/Gemini_Generated_Image_*.png`, `favicon.ico` | Logo and favicon. Favicon of the RCM page points at the PNG. |
| `ssl/`, `.cpanel/`, `mail/`, `logs/`, `tmp/`, `etc/` and dotfiles | cPanel account data. Not touched. |

## 2. Existing WordPress theme architecture

None present. The old site was a compiled Angular app, and its theme (colors, fonts, nav, sections) is **not reused**. The RCM page has its own self-contained stylesheet, palette and font.

## 3. Frontend files identified for modification

Created:

- `public_html/rcm/index.html` — page markup, SVG dashboards
- `public_html/rcm/rcm.css` — layout, 3D monitors, responsive rules
- `public_html/rcm/rcm.js` — GSAP timeline and chart rendering
- `public_html/rcm/gsap.min.js` — GSAP 3.12.5, hosted locally (no CDN, no extra request)

Modified (explicitly requested):

- `public_html/index.html` — replaced with a blank page

## 4. Files that must remain untouched

- Old Angular bundles (`main-*`, `chunk-*`, `polyfills-*`, `styles-*`) — not edited, just no longer referenced
- `crestiaventures-backup.zip`, logo PNG, `favicon.ico`
- `ssl/`, `.cpanel/`, `.cl.selector/`, `.cagefs/`, `mail/`, `logs/`, `tmp/`, `etc/`, `public_ftp/`
- Any `wp-config.php`, core, plugin, database, deployment or hosting configuration (none exist here, nothing was created)

## 5. Hero section design

Pure black `#050505` page. Purple/blue accent (`#8b5cf6` to `#3b82f6`, cyan highlights). Font: Plus Jakarta Sans. Subtle radial ambient light only.

Two columns:

- **Left (~55%)**: three realistic desktop monitors (metallic dark-grey bezel, glass screen with reflection, neck, base, contact shadow, back plate for depth).
- **Right (~45%)**: stable copy, never moves during the animation.

Right-side copy (from the brief):

- Label: NEXT-GENERATION CRM PLATFORM
- Heading: Manage Smarter. Grow Faster.
- Description: Bring your leads, customers, sales and business analytics together in one powerful CRM platform. Simplify workflows and turn every opportunity into growth.
- Buttons: Get Started, Explore Features
- Trust line under the buttons

Below the hero (RCM page content from the company brochure): 12 RCM services, 6-step workflow, performance priorities, engagement note, contact block.

## 6. Three-monitor 3D animation sequence

Monitors sit on a 3D ring. A single GSAP timeline advances the active index; each monitor's `translateX`, `translateZ`, `rotateY` and `scale` are computed from its ring position every frame.

- Monitor 1 (Revenue Growth) rotates into the foreground and gets larger. The others stay visible behind it.
- Monitor 1 moves left/back; Monitor 2 (Lead Analytics) rotates forward.
- Monitor 2 moves left/back; Monitor 3 (Lead Distribution) rotates forward.
- Monitor 3 moves back; Monitor 1 returns. The loop repeats.

The active monitor is largest and closest. Inactive ones are smaller, dimmer and further back. The monitor that wraps around passes behind the active one, so the loop has no jump.

Timing (configurable in `CONFIG.timing` at the top of `rcm.js`, or via `window.RCM_HERO_CONFIG`):

| Time | Step |
|---|---|
| 0–1.5 s | Monitor 1 rotates into the foreground |
| 1.5–4 s | Line graph |
| 4–5 s | Transition to monitor 2 |
| 5–7.5 s | Bar chart |
| 7.5–8.5 s | Transition to monitor 3 |
| 8.5–11 s | Pie chart |
| 11–12 s | Transition back to monitor 1 |

## 7. Chart animation implementation strategy

All charts are inline SVG. Each chart is drawn from a single progress value (0 to 1) that the timeline tweens.

- **Revenue Growth (line):** Total Revenue `$84,290`, `+24.8%`. Starts at zero, draws left to right with `stroke-dasharray` / `stroke-dashoffset` through dips to a high peak. Counter counts up. The final point gets a glow.
- **Lead Analytics (bars):** Total Leads `1,284`, `+18.6%`. Seven bars grow one by one to different heights with easing. Counter counts up. Purple, blue and cyan gradients.
- **Lead Distribution (pie):** Organic 40%, Social Media 30%, Referral 20%, Others 10%. Segments are drawn one by one from an empty ring. Percentages count up, the center reaches 100%, and the active segment is highlighted.

Each chart clears while its monitor is hidden behind the active one, so no chart ever visibly snaps to empty. Dashboard numbers are labelled "Sample view".

## 8. WordPress-compatible technology stack

There is no WordPress here, so the page is plain static frontend: HTML5, CSS3 (3D transforms and perspective), vanilla JavaScript, GSAP (timeline), SVG. No React, Next.js, Node or build step. The `rcm/` folder can be dropped into a WordPress child theme later as a page template plus enqueued CSS/JS without changes to the code.

## 9. Responsive design strategy

- **Desktop (900px and up):** two columns, full 3D animation.
- **Tablet (620–899px):** copy stacked above the monitors, monitor size capped, spacing tightened, no overlap.
- **Mobile (under 620px):** stacked, larger monitors, side monitors peek in, smaller 3D tilt, no horizontal scroll (verified: page width equals viewport width).
- **`prefers-reduced-motion`:** the sequence still plays, but with a much gentler 3D swing (10-degree tilt, shallow depth). Scroll-reveal effects are turned off. If GSAP fails to load, the page shows a static three-monitor row with finished charts.

## 10. Performance and optimization strategy

- One CSS file, one JS file, one local library (GSAP, about 72 KB). One web font.
- Animation only changes `transform` and `opacity` (plus SVG dash offsets). No layout-affecting properties.
- Timeline pauses when the hero is off screen, and is killed on `pagehide`. Resize handler is throttled with `requestAnimationFrame`.
- Fixed stage heights, so no layout shift.
- No backend or API requests.

## 11. Implementation steps

1. Inspect the project and write this plan. Done.
2. Create the `rcm/` page: markup, SVG dashboards. Done.
3. Style the monitors, hero and sections. Done.
4. Add the GSAP timeline and chart renderers. Done.
5. Restyle to the original brief (black, purple/blue, CRM copy, Revenue Growth / Lead Analytics / Lead Distribution). Done.
6. Blank the home page. Done.
7. Test and update this plan. Done.

## 12. Testing and verification checklist

Checked in a browser against a local server:

- [x] Three monitors render with bezel, stand and shadow.
- [x] 3D rotation sequence runs left to right across all three monitors.
- [x] Line, bar and pie charts animate on the active screen.
- [x] Loop seam is continuous (monitor poses match at 11.999 s and 0.001 s; wrapped chart is hidden behind the active monitor).
- [x] Right-side text does not move.
- [x] Desktop (1440), tablet (about 700) and mobile (390) layouts; no horizontal scroll.
- [x] Reduced-motion mode plays the gentle version.
- [x] Home page `/` returns the blank document.
- [x] No 404s from the local server.

Not testable here: the live GoDaddy host, and old Angular routes (`/about`, `/contact`, etc.), which now resolve to the blank home page.

## 13. Hero animated background (digital grid + diagonal glass panels)

**Status:** implemented.

**Goal:** a futuristic animated background that sits behind the existing hero. The hero content, the three-monitor animation, the heading, text, buttons and layout stay exactly as they are. No other section is touched.

**Note on the reference video:** the video did not reach the chat and there is no video file in the project, so the effect is built from the written description. It can be tuned later if the video or frames are supplied. The "laptop animation" is taken to mean the existing three-monitor 3D animation.

### 13.1 Design
- Base colour `#080808` (deep black/charcoal), with a faint violet glow weighted toward the edges.
- Fine, low-opacity digital grid (about 56px cell, opacity 0.05 to 0.07).
- Dot matrix (about 22px pitch) plus a few tiny data-like ticks from an inline SVG.
- 7 to 9 translucent glass panels arranged diagonally in a 3D tunnel: thin neon-purple 1px border, inner purple illumination, faint diagonal reflection, slight blur on desktop only.
- A centre mask keeps the middle clean so the monitors and text keep their contrast. Purple intensity rises toward the edges.

### 13.2 Layer stack (inside `.hero`)
1. `.hero-bg` (new, `position:absolute; inset:0; z-index:0; pointer-events:none; overflow:hidden; aria-hidden`)
   - grid layer, dot layer, data-glyph SVG, glow layer, `.hb-tunnel` with `.hb-panel` elements, vignette/mask.
2. `.hero-inner` (existing content) raised with `position:relative; z-index:1`.
3. The existing `.hero::before` ambient glow (`z-index:-1`) is unchanged.

The background is a sibling layer, so the monitors' `perspective` / `preserve-3d` context is not affected.

### 13.3 Motion
- Panels drift diagonally with `transform` and `opacity` keyframes only (28 to 40s, soft linear flow, negative delays so it is already flowing on load).
- Seamless loop: each panel fades in at the far end, travels, and fades out at the near end.
- Parallax: near panels are faster, far panels slower. Grid and dots drift slowest.
- A purple edge-glow sweep travels along each panel border (`::after` gradient).
- No JavaScript and no new dependencies.

### 13.4 Responsive, accessibility and performance
- 899px and below: about 4 panels, smaller grid.
- 619px and below: no `backdrop-filter`, weaker glows.
- `prefers-reduced-motion: reduce`: (section 13 original, superseded by section 14.7) the hero background now keeps animating.
- `will-change: transform` only on panels. GPU-friendly properties only. The monitor timeline is not affected.

### 13.5 Files
| File | Change |
|------|--------|
| `plan.md` | This section |
| `public_html/rcm/hero-bg.css` | New: all background styles and keyframes |
| `public_html/rcm/index.html` | One `<link>` plus the `.hero-bg` block as first child of `.hero` |
| `public_html/rcm/rcm.css` | One rule: `.hero-inner { position: relative; z-index: 1; }` |

**Not touched:** `rcm.js`, `gsap.min.js`, the navbar, Services, Workflow, Performance, Engagement, Contact, footer, the blank home page, and all Angular, cPanel and backup files.

### 13.6 Checklist
- [x] Hero text, sizes, spacing and layout unchanged (before/after comparison).
- [x] Monitors fully visible, not covered by panels or grid.
- [x] Monitor timeline still plays.
- [x] Panel loop is seamless; centre stays clean; purple stronger toward the edges.
- [x] Desktop (1440), tablet (about 1024 and 820) and mobile (390) look correct; no horizontal scroll.
- [x] Reduced-motion shows a static frame.
- [x] No console errors; only the files listed above changed.

## 14. Interactive 3D hero

**Status:** implemented.

**Goal:** make the hero feel like a living 3D scene. The monitor stage (the "laptop") floats, lifts and tilts toward the cursor. The background is a set of separate parallax layers (perspective grid, floating glass panels, drifting lights) lit by a cursor spotlight. All hero text, buttons, layout, the navbar and the GSAP monitor timeline stay as they are.

### 14.1 Findings that shape the design
- `rcm.js` writes `transform` only on each `.monitor`. `#stage` (already `perspective` + `preserve-3d`), `.hero-stage-col` and `.hero-bg` have no JS transforms, so `#stage` carries float and tilt safely.
- Panel keyframes use `transform`, so cursor parallax goes on wrapper elements, never on the animated panels.
- `.btn` is shared with the navbar and the contact section, so hero button effects are scoped to `.hero-actions .btn`.
- Plain vanilla JS; no React and no new library.

### 14.2 Interaction model
- New `public_html/rcm/hero-fx.js` (defer). Passive `pointermove / pointerenter / pointerleave` on `#hero` set targets. One `requestAnimationFrame` loop smooths them (lerp) and writes only CSS variables on `#hero`: `--px`, `--py` (-1..1), `--sx`, `--sy` (trailing spotlight, px), `--sa` (spotlight alpha), `--hv` (stage hover 0..1), plus per-panel `--near`.
- The loop stops when values settle and the pointer is outside. It pauses off screen (IntersectionObserver) and when the tab is hidden.
- No pointer logic on `(hover: none)` or reduced motion; touch and small screens get slow autonomous drift (CSS only).

### 14.3 Stage ("laptop")
- Idle float: `stage-float` keyframes on the individual `translate` and `rotate` properties (about 9s, ease-in-out).
- Cursor tilt on `transform` (rotateX/rotateY from `--px/--py`, up to about 7 and 9 degrees); hover lift and slight scale from `--hv`, all smoothed in JS, so nothing snaps.
- Violet glow via `#stage::after` (opacity only), layered contact shadow on `.m-shadow` scaled by lift, moving glass reflection on `.m-glass::after`, subtle screen bloom.
- `.monitor` transforms and the chart animation are untouched.

### 14.4 Background layers (in `.hero-bg`)
- **A. Perspective grid:** `.hb-floor`, a rotated plane with violet grid lines fading toward the horizon, scrolling toward the viewer by exactly one cell (seamless). The old flat grid and dots stay as a faint back layer.
- **B. Glass panels:** 9 panels, each with its own depth tier, rotation, speed and direction. Wrapper `.hb-plane` / per-tier groups carry parallax. Violet edge glow and travelling sweep stay.
- **C. Lights:** three large soft radial lights drifting on long offset keyframes (low alpha).
- **Cursor light:** `.hb-spot` (screen blend) follows the trailing position; a brighter copy of the grid and floor is revealed through a radial mask at the cursor; panels brighten with `--near`; pooled ripple rings (2 to 3, reused, throttled) give soft light diffusion. Spotlight alpha is capped so text stays readable.

### 14.5 Parallax (multipliers on `--px/--py`)
Floor smallest (about 6px), lights about 14px, panels about 10 to 34px by depth tier, stage strongest (tilt). `.hero-inner` is never parallaxed, so layout is unchanged.

### 14.6 Micro-interactions (hero only)
- Load entrance: copy fades up (about 12px, `cubic-bezier(.22,.8,.24,1)`, short stagger), stage settles in, background fades from black. Visible by default if JS fails.
- Hero buttons: 2px lift, glow via pseudo-element opacity, gentle sheen, same easing. No exaggerated motion.

### 14.7 Responsive, accessibility, performance
- 899px and below or `(hover: none)`: autonomous drift only; fewer panels, no blur on mobile.
- `prefers-reduced-motion`: revised. The first version froze the background and switched off tilt, spotlight and ripples, which made the whole effect look broken on Windows laptops that report "reduce motion" by default. The hero now stays fully animated in this case, and only the pointer amplitude (tilt and parallax) is lowered to 60 percent. The monitor timeline keeps its gentle mode. The stylesheet and script links carry a ?v=4 suffix so browsers do not serve cached copies.
- Only `transform` and `opacity` animate; `will-change` on a few layers; no `box-shadow` animation; about a dozen new decorative elements; decorative layers `pointer-events:none`.

### 14.8 Files
| File | Change |
|------|--------|
| `plan.md` | This section |
| `public_html/rcm/hero-bg.css` | Floor, lights, panel variants, spotlight, ripple, reveal-mask grid |
| `public_html/rcm/hero-fx.js` | New pointer and rAF controller |
| `public_html/rcm/rcm.css` | Hero-only: stage float/tilt/glow/reflection, entrance, hero button hover |
| `public_html/rcm/index.html` | Extra decorative `.hb-*` elements and `<script defer src="hero-fx.js">` |

**Not touched:** `rcm.js`, `gsap.min.js`, navbar, every non-hero section, hero text and links, the blank home page, Angular, cPanel and backup files.

### 14.9 Checklist
- [x] Stage floats when idle.
- [x] Stage lifts, tilts and glows on hover, and eases back on leave.
- [x] Grid, panels and lights move independently.
- [x] Spotlight trails the cursor, fades on leave, and lights nearby grid and panels; ripple works.
- [x] Parallax offsets differ by layer; stage tilt is strongest.
- [x] Monitor timeline and charts still run.
- [x] Hero text, buttons and layout unchanged and readable.
- [x] 1440, 1024, 820, 390, touch and reduced-motion modes work; no horizontal scroll; no console errors.
- [x] No jank during pointer movement; rAF stops when idle.

### 14.10 Implementation notes
- Panel illumination (--near) is measured about 10 times per second inside the same animation loop, because panels move continuously and cached positions would go stale.
- Touch and no-hover devices use a CSS-only roaming light (.fx-auto); the cursor-lit grid and ripples are off there.
- Verified in the local browser: parallax offsets (far 8px, mid 19px, near 37px, floor 6px, grid 5px, lights 21px, stage tilt about 6 to 9 degrees); hero text and button boxes identical to before; animation loop idle (no requestAnimationFrame calls) after the cursor leaves; about 60 fps with avg 16.9 ms frames during continuous pointer movement; reduced motion freezes the background and disables tilt and float while the monitor timeline keeps its gentle mode. (Later revised: see 14.7; the hero now keeps animating under reduced motion.)

## 15. Scroll-driven medical billing stages

**Status:** implemented.

**Goal:** turn the 12 RCM services (the `#services` section, "Healthcare revenue cycle management") into a pinned, scroll-driven sequence like the reference frames: a central column of illustrated discs that travels vertically, with the active stage's text expanding beside it and the previous stage collapsing. The section heading, theme, colours and fonts stay as they are.

### 15.1 Structure
- The `.service-grid` card list is replaced by `.stages`: a pinned frame (`.stages-pin`) holding a clipped window (`.stages-view`) and a moving `.stages-track`.
- 12 rows (`<li class="stage">`), each with a text block (`.st-text`: number, title, description) and a disc illustration (`.st-disc`, an inline SVG with a stage-specific line icon). Odd stages put the text on the left, even stages on the right, as in the reference. Below 900px all text sits to the right of the discs.
- Titles and descriptions are the exact 12 pairs supplied in the brief. Illustrations: insurance card with check, document with approval stamp, coding document with code symbols, invoice with calculator, claim with submission arrow, billing statement with headset, rejected claim with recovery arrow, financial report with clock and tracking arrows, receipt with check, provider profile with verified badge, audit report with magnifier, analytics dashboard with graph.
- Without JavaScript or GSAP the rows show as a plain, fully expanded list.

### 15.2 Motion
- GSAP 3.12.5 plus ScrollTrigger 3.12.5, both stored locally in `public_html/rcm/` (no CDN at runtime).
- New `public_html/rcm/stages.js`: one GSAP timeline animates a progress value from stage 1 to stage 12 and is scrubbed by ScrollTrigger (`pin: true`, `scrub`). The mouse wheel is not hijacked; it is ordinary scrolling, and scrolling up reverses everything.
- Each stage has a short dwell: progress eases between whole stages, so the active row is expanded while stage changes happen in the middle of each step.
- For each row, an "activeness" value from its distance to the current progress drives the disc scale, opacity, a slight rotateY and violet edge intensity, plus the text expansion (description height and opacity, title scale). The track translates so the active disc stays centred.
- After stage 12 the pin releases and the page continues to scroll.
- Under `prefers-reduced-motion` the scroll-driven effect still runs, because it only moves when the user scrolls.

### 15.3 Files
| File | Change |
|------|--------|
| `plan.md` | This section |
| `public_html/rcm/index.html` | `#services` list replaced by the stages markup; script tags added |
| `public_html/rcm/rcm.css` | New "stages" block, plus the old `.service` card rules left in place |
| `public_html/rcm/stages.js` | New scroll controller |
| `public_html/rcm/ScrollTrigger.min.js` | New local library copy |

**Not touched:** hero, navbar, workflow, performance, engagement and contact sections, `rcm.js`, `hero-fx.js`, backend, hosting and deployment files.

### 15.4 Notes and verification
- Row classes are `.st-row` (not `.stage`) because `.stage` already names the hero monitor stage.
- Checked with a local server: the frame pins at the top, stage 1 to 12 activate in order (aria-current follows), the active disc stays centred in the window, the pin releases after stage 12 with the workflow section following directly, and scrolling back up reverses to stage 1. All 12 illustrations render. Layout checked in the narrow (stacked) and desktop (alternating) arrangements.
- Without JavaScript the same markup is a plain, fully expanded list.

## 16. Black-and-gold upgrade and ContainerScroll services showcase

**Status:** complete.

**Goal:** give the RCM page (only) a premium black-and-gold look, calm the hero lighting, and replace the pinned stages section with an animated 12-card services showcase placed right after the hero.

### 16.1 Decisions
- The showcase is a small React + Vite + framer-motion island (JSX, no TypeScript). Source lives in `rcm-services/` at the project root, outside `public_html`. Only the compiled `rcm-services.js` and `rcm-services.css` are copied into `public_html/rcm/`. The rest of the page stays static HTML, CSS and vanilla JS.
- The supplied ContainerScroll source was not attached, so the standard behaviour is used: the header moves up, the card rotates in 3D (rotateX about 20 to 0 degrees) and scales while scrolling.
- The pinned stages section (section 15) is removed; the showcase replaces it.
- The "Strict Requirements" list in the brief was empty; the existing project rules still apply (no backend, hosting, API, auth, WordPress or other-division changes).

### 16.2 Palette (RCM page only)
Background #080808, cards #171717, accent #D19F40, hover accent #E1B354, text #F2F0EB, secondary text #A6A6A6. Purple, blue, cyan, teal/mint and bright yellow are removed from the RCM page files.

### 16.3 Hero
- Existing laptop animation, text, buttons and layout stay.
- Continuous subtle float, gentle 3D tilt and lift on hover, restrained #D19F40 edge glow.
- Grid and glass panels keep moving independently; soft parallax; ambient gold light.
- The cursor-following spotlight, lit grid and ripples are removed (or reduced to a very faint glow).

### 16.4 Services showcase
- Eyebrow OUR EXPERTISE, heading "Every claim matters. Every step moves revenue forward.", subheading "One connected approach to revenue cycle management.", and the supplied description.
- 12 cards (number, Lucide icon, title, description, arrow), gold hairline border; 3 columns on desktop, 2 on tablet, 1 on mobile.
- Hover: lift, gold border glow, icon transition, subtle gradient, arrow shift.
- Scroll: perspective, rotateX and scale driven by `useScroll`; staggered card reveal; no fixed demo heights.
- Under reduced motion it stays active with a gentler amplitude.

### 16.5 Page polish
Entrance animations, gold button interactions, consistent type and spacing, decorative gold accents and restrained hovers across nav, workflow, performance, engagement, CTA and footer.

### 16.6 Files
| File | Change |
|------|--------|
| `plan.md` | This section |
| `rcm-services/` | New React + Vite source |
| `public_html/rcm/index.html` | Mount point, new bundle tags, stages markup removed, SVG chart colours |
| `public_html/rcm/rcm.css` | Gold tokens and colours, stages and old service styles removed, polish |
| `public_html/rcm/hero-bg.css` | Gold lights and panels, spotlight and ripples removed |
| `public_html/rcm/hero-fx.js` | Spotlight, lit grid and ripples removed |
| `public_html/rcm/rcm.js` | Chart colours |
| `public_html/rcm/stages.js`, `ScrollTrigger.min.js` | Removed (no longer used) |

### 16.7 Checklist
- [x] Section added before any code.
- [x] Build output lands in `public_html/rcm/`.
- [x] Showcase animates on scroll (straightens and scales), 12 cards, 3/2/1 columns.
- [x] No purple, blue, cyan, teal or bright yellow left on the RCM page.
- [x] Hero animation intact, spotlight removed, gold glow subtle.
- [x] Polish applied; 1440, 820 and 390 widths and reduced motion work; no console errors.

## 17. 3D service-card tunnel

**Status:** complete.

**Goal:** full-viewport hero (`100svh`), remove ContainerScroll, and replace the services showcase with a scroll-driven 3D card tunnel (6 left / 6 right around a central heading).

### 17.1 Hero
- `.hero` and `.hero-inner` use `min-height: 100svh` (including tablet/mobile).
- Laptop animation, copy, buttons, float/tilt, gold theme and background stay.
- Services remain below the hero until the user scrolls.

### 17.2 Tunnel (desktop)
- Sticky `100svh` scene inside a ~220vh scroll track; Framer `useScroll` / `useTransform`.
- Central heading: OUR EXPERTISE + "Every claim matters."
- Odd cards left, even cards right; far/small at centre → near/large outward as scroll progresses.
- Updated short descriptions for all 12 services. Gold theme unchanged.

### 17.3 Mobile
Below ~900px: stacked (or 2-col tablet) readable cards; no 3D tunnel. Reduced motion uses gentler amplitude.

### 17.4 Files
| File | Change |
|------|--------|
| `plan.md` | This section |
| `public_html/rcm/rcm.css` | Hero `100svh` |
| `rcm-services/src/ContainerScroll.jsx` | Deleted |
| `rcm-services/src/CardTunnel.jsx` | New |
| `rcm-services/src/ServicesShowcase.jsx` | Tunnel + copy |
| `rcm-services/src/showcase.css` | Tunnel + mobile |
| `public_html/rcm/rcm-services.*` | Rebuild |
| `public_html/rcm/index.html` | Cache-bust |

### 17.5 Checklist
- [x] Section added before any code.
- [x] Hero fills first viewport; services start below.
- [x] ContainerScroll removed.
- [x] Tunnel expands on scroll; 12 cards; workflow reachable.
- [x] Mobile readable fallback; reduced motion gentler; no console errors.

## 18. Page-wide background and true 3D corridor

**Status:** complete.

**Goal:** extend the animated gold grid across the whole RCM page, and rebuild the services showcase as a symmetrical corridor with a stationary straight heading and large left/right cards that travel depth-to-foreground with bidirectional scroll.

### 18.1 Page background
- `.page-bg` fixed behind all content; soft gold cursor glow; transparent section fills so the grid shows through.

### 18.2 Corridor
- Sticky scene; static central heading (no rotate/scale/fade).
- Six cards per side on continuous 3D rails; scroll progress drives travel; scroll-up reverses.
- Readable card size; heading safe zone; mobile list fallback.

### 18.3 Checklist
- [x] Section added before code.
- [x] Page-wide background and soft glow.
- [x] Corridor rebuilt; heading static; reverse scroll works.
- [x] Hero 100svh intact; mobile fallback; no console errors.

## 19. Auto-floating 3D service gallery

**Status:** complete.

**Goal:** replace scroll-driven corridor with a stationary top heading and 12 simultaneously visible symmetrical 3D cards that continuously float on their own (scroll does not drive, reverse or reset the motion).

### 19.1 Behaviour
- Heading at top, straight and static.
- All 12 cards visible; smaller toward centre depth, larger toward outer edges.
- Continuous auto float/glide with staggered timing; no sticky pin track.
- Mobile: readable list fallback. Reduced motion: gentler amplitude.

### 19.2 Checklist
- [x] Section added before code.
- [x] Scroll no longer controls card motion.
- [x] Heading top/static; 12 cards visible and floating.
- [x] Hero and page-bg preserved; mobile fallback works.

## 20. Corridor rail glide refine

**Status:** complete.

**Goal:** keep the auto-floating gallery architecture, but make cards glide along left/right 3D corridor rails (not local bobbing), with clearer spacing and no overlap.

### 20.1 Checklist
- [x] Section added before code.
- [x] Rail `pose(side, t)` drives continuous glide with stagger.
- [x] All 12 visible; heading static; scroll does not control motion.
- [x] Rebuild verified on desktop and mobile list.

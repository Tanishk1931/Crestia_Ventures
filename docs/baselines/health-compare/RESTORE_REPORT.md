# Healthcare Section Restore Report

## Video comparison (diagnosis)

| Aspect | Reference (`healthafter.mp4`) | Problem (`helthafter.mp4`) |
| --- | --- | --- |
| Specialization cards | Horizontal accordion strip visible; active card expands | Heading only; empty mint area under subtitle |
| Transforming circles | Circular photo + panel cards | Present but flattened/oval (wrong wrappers) |
| Recruitment process | Full staggered scroll-in of 01–06 | Partial (01–03 visible); later cards delayed/clipped |
| Progress UI under specs | Native thin teal scrollbar at tablet widths | Absent (cards not laid out) |

## Root cause

Not missing content arrays. Cards were in PHP/DOM but **collapsed to ~2×2px**.

1. **Specializations markup mismatch** — PHP used `healthcare-specializations-grid` while CSS requires `healthcare-specializations-scroll` → `healthcare-specializations-track` (height + flex). Cards had `height: 100%` of a zero-height parent.
2. **Circle class mismatch** — PHP used `recruitment-circle-wrap` / `recruitment-circle-image`; CSS expects `recruitment-circle-entry` / `recruitment-circle-photo` (aspect-ratio + absolute photo crop).
3. **Process animation** — simple once-fade did not match original scroll-scrubbed stagger (x / rotate / scale from center). Card 06 also used tone `soft` (no CSS) instead of `white`.

## Fixes

### `template-parts/healthcare/islands.php`
- Restored scroll/track wrappers for specializations
- Restored italic “Specializations” highlight
- Fixed circle entry/photo classes + aria-label
- Process card 06 tone → `white`

### `assets/js/healthcare.js`
- Specializations: `has-active-card`, hover expand/collapse matching original React behavior
- Circles: mouse hover open/close matching original
- Process: GSAP ScrollTrigger scrub timeline matching Framer `useScroll` timings
- ScrollTrigger.refresh after load/fonts

### `inc/enqueue.php`
- Cache-bust suffix `-hc-restore` for healthcare CSS/JS

## Validation

- 6 specialization cards render (~track height 484–880px); hover expands active flex-grow 4.5
- 3 circles 1:1 (250–360px)
- 6 process cards (Discover→Improve) opacity reaches 1 through section scroll
- No console errors; GSAP + ScrollTrigger loaded
- Frames saved: `fixed_specializations.png`, `fixed_circles.png`, `fixed_process.png`

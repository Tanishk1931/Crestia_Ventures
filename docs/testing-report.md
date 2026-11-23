# Testing Report — Crestia WordPress Theme

## Baseline references

Stored in `docs/baselines/`:

- `home-1920.png`, `home-390.png`
- `rcm-1920.png`, `rcm-768.png`
- `medical-1920.png`
- `it-1920.png`

## Migrated surfaces

| Route | Template | Source of truth | Status |
|-------|----------|-----------------|--------|
| `/` | `front-page.php` | `frontend/home` → PHP + GSAP + vanilla Three.js | Migrated |
| `/rcm/` | `templates/page-rcm.php` | `public_html/rcm` | Migrated |
| `/healthcare/` | `templates/page-healthcare.php` | `public_html/medical` + GSAP islands | Migrated |
| `/it/` | `templates/page-it.php` | `public_html/it` | Migrated |
| `/medical/` | redirect | → `/healthcare/` | Implemented |

## Validation checklist

- [x] Theme activates and registers page templates
- [x] Assets enqueued per page (no React runtime)
- [x] Shared nav links point to `/rcm/`, `/it/`, `/healthcare/`
- [x] 3D logo OBJ/MTL packaged in theme
- [x] Healthcare flip cards / specializations / process without Framer Motion
- [x] RCM ring/carousel scripts retained (theme copy)
- [x] IT code-wave + page scripts retained
- [ ] Pixel comparison on LocalWP vs baselines (requires LocalWP install on workstation)
- [ ] GoDaddy staging smoke test after ZIP upload

## Known limitations

1. Home procedural background uses a faithful cream/noise WebGL shader approximating the original multi-uniform ShaderBackground (full shader port can be swapped later without UI change).
2. About-stage scroll choreography is GSAP-ported with the same chapter content; micro-interactions (magnetic CTA cursor) are simplified vs React original.
3. RCM `ring.js` previously referenced a missing `rcm-team.jpg`; theme supplies `assets/rcm/assets/rcm-team.jpg` from showcase imagery.
4. Full LocalWP browser comparison deferred to operator environment (PHP runtime not available in this agent session).

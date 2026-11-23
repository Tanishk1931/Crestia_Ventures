# Migration Plan — Crestia Ventures → WordPress Theme

## Target

- One custom theme: `wordpress/crestia-theme`
- GoDaddy Managed WordPress production
- Routes: `/`, `/rcm/`, `/healthcare/`, `/it/`
- Redirect `/medical/` → `/healthcare/`
- Stack: WordPress + PHP 8 + HTML/CSS/JS + Three.js + GSAP
- No React / Node / Vite in production

## Source-of-truth decisions

1. **Home** ← `frontend/home/` (convert R3F→vanilla Three.js, Framer→GSAP/CSS)
2. **RCM** ← `deployment/godaddy/public_html/rcm/` (not React `frontend/rcm`)
3. **Healthcare** ← `deployment/godaddy/public_html/medical/` + rewrite medical-cards without React
4. **IT** ← `deployment/godaddy/public_html/it/` (not incomplete React app)
5. **Preserve** originals under `frontend/` and `deployment/`; theme work only under `wordpress/crestia-theme/`
6. **healthcare-recruitment** → optional secondary WP page template later; not primary `/healthcare/`

## Theme structure

```
wordpress/crestia-theme/
  style.css, functions.php, front-page.php, header.php, footer.php, index.php, page.php
  templates/page-rcm.php, page-healthcare.php, page-it.php
  template-parts/...
  assets/{css,js,images,videos,fonts,models,vendor}
  inc/{enqueue,theme-setup,custom-functions}.php
```

## Phases

| Phase | Work |
|-------|------|
| 1 | Architecture / asset / plan docs (this set) |
| 2 | Baseline screenshots |
| 3 | Theme scaffold + enqueue + LocalWP notes |
| 4 | Home migration |
| 5 | RCM port |
| 6 | Healthcare port + GSAP island |
| 7 | IT port |
| 8 | Routes + `/medical/` redirect |
| 9 | Visual/functional validation |
| 10 | Theme ZIP + GoDaddy guide + reports |

## Risk notes

- Home WebGL shader + logo assembly is highest fidelity risk
- Medical Framer Motion must be recreated carefully in GSAP
- `ring.js` references missing `../assets/rcm-team.jpg` (pre-existing)
- Empty root-era home `package-lock` does not affect WP theme

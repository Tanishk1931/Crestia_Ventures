# Asset Inventory — Crestia Ventures

## Home (`frontend/home/public/`)

| Asset | Path | Notes |
|-------|------|-------|
| Brand logo OBJ | `assets/brand-logo.obj` | Required named parts |
| Brand logo MTL | `assets/brand-logo.mtl` | Materials |
| About webps | `about/*-{800,1600}.webp` | RCM / IT / Healthcare |
| Service JPGs | `assets/service-*.jpg` | Cards |
| Showcase JPGs | `assets/showcase-*.jpg` | Showcase imagery |

## Archive 3D (`shared/3d-models/archive/`)

| Asset | Notes |
|-------|-------|
| `Untitled1.obj` / `.mtl` | Exact duplicate of brand-logo |
| `Untitled.glb` | Unused dump; keep archived |

## Deployment shared

| Asset | Path |
|-------|------|
| Brand PNG | `deployment/godaddy/public_html/Gemini_Generated_Image_wglq2wglq2wglq2w.png` |
| Favicon | `deployment/godaddy/public_html/favicon.ico` |
| Nav CSS/JS | `shared/home-navbar.css`, `global-nav.css`, `global-nav.js` |

## RCM (`deployment/godaddy/public_html/rcm/`)

CSS: `rcm.css`, `hero-bg.css`, `ring.css`, `rcm-sections.css`, `rcm-cycle.css`, `rcm-services.css`  
JS: `gsap.min.js`, `rcm.js`, `hero-fx.js`, `rcm-sections.js`, `rcm-cycle.js`, `ring.js`, legacy `rcm-services.js`  
HTML helpers: `rcm-cycle.html`, `rcm-sections.html`, `ring-snippet.html`, `page-not-found.html`  
Orphan: `medical.js` (duplicate of medical page script)

## Healthcare / medical (`.../medical/`)

| Asset | Notes |
|-------|-------|
| `hospital-staff.mp4` | Hero video (~5.6 MB) |
| `nurse-card.jpg`, `team-card.jpg` | Cards |
| `recruitment-*.jpg` | Process imagery |
| `specialization-*.jpg` | Five specialization images |
| `medical-cards.js/css` | Built React island |
| `medical.js/css` | Intro / GSAP shell |

## IT (`.../it/`)

| Asset | Notes |
|-------|-------|
| `hero-team.jpg`, `hero-team-b.jpg` | Flip hero |
| `it.css`, `it.js`, `code-wave.js` | Page behavior |

## IT React public (`frontend/it-recruitment/public/`)

`images/team.jpg` ≡ `public_html/it/hero-team.jpg`; favicon/icons SVG

## Legacy (retain, do not delete during migration)

- Angular chunks: `chunk-*.js`, `main-*.js`, `polyfills-*.js`, `styles-*.css`
- `crestiaventures-backup.zip`
- Blank `public_html/index.html`

## Libraries for theme production

| Lib | Use | Source |
|-----|-----|--------|
| three.js | Home 3D logo | npm / CDN copy into theme |
| GSAP + ScrollTrigger | Home, RCM, medical intro | Local copies |
| No Framer Motion | Recreate with GSAP/CSS | — |
| No React | Production stack | — |

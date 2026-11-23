# Original Architecture — Crestia Ventures

## Repository layout (post-reorganization)

```
frontend/home/           Main React 18 + Vite 6 home (Three.js, GSAP, Framer Motion)
frontend/rcm/            Legacy React islands (no longer mounted on live RCM page)
frontend/healthcare/     React islands → medical-cards.js
frontend/it-recruitment/ Incomplete React 19 + TS app (hero only)
deployment/godaddy/public_html/   Production static service pages
```

## Section map

| Section | Canonical production source | Dev/source apps | Live path today |
|---------|----------------------------|-----------------|-----------------|
| Home | `frontend/home/` | React 18, Vite 6, R3F, GSAP, Framer Motion | `/` (Vite build) |
| RCM | `deployment/godaddy/public_html/rcm/` | Static HTML/CSS/JS + GSAP + `ring.js` | `/rcm/` |
| Healthcare | `deployment/godaddy/public_html/medical/` | Static + `medical-cards.js` (React IIFE) | `/medical/` |
| IT | `deployment/godaddy/public_html/it/` | Static HTML/CSS/JS + canvas wave | `/it/` |

## Home architecture

- Entry: `frontend/home/src/main.jsx` → `App.jsx`
- Sections: Navbar, ShaderBackground, LogoAssembly (Three.js OBJ/MTL), Hero, LogoReveal, AboutStage, ServicesSection, closing/contact
- Scroll: GSAP ScrollTrigger in `ScrollController.jsx`
- Motion: Framer Motion on navbar links, cards, closing; GSAP for logo travel
- 3D: `@react-three/fiber` + `@react-three/drei`, parts `Gold`, `Navy_Big`, `Navy_Small`, `Green`
- Models: `frontend/home/public/assets/brand-logo.obj` / `.mtl`
- Build copies service dirs from `deployment/godaddy/public_html/` into `deployment/production-build/`

## RCM architecture (production)

- Full page HTML with hero dashboards, ring carousel (`ring.js`), cycle section, metrics, engagement, CTA
- GSAP (`gsap.min.js`), `rcm.js`, `hero-fx.js`, `rcm-sections.js`, `rcm-cycle.js`
- Shared nav CSS: `../shared/home-navbar.css`
- **Note:** `frontend/rcm` React ServicesShowcase is **not** referenced by current `rcm/index.html`

## Healthcare architecture (production)

- Shell: `medical/index.html` + `medical.css` + `medical.js` (GSAP video/intro)
- Island: `#medical-choices-root` → `medical-cards.js` / `medical-cards.css` (Framer Motion)
- Assets: `medical/assets/` (video + images)
- Alternate page: `healthcare-recruitment/` (not primary)

## IT architecture (production)

- Full multi-section page: hero, expertise, models, process, why, CTA
- `it.css`, `it.js`, `code-wave.js` (canvas)
- React app under `frontend/it-recruitment/` is incomplete (hero only) — **not** production truth

## Backend / APIs

- No application backend, no REST clients, no forms beyond `mailto:` links
- Contact: `info@crestiaventures.com`, home brand email in `brand.js`

## Navigation (current)

Home / RCM / IT / Medical all link: `/rcm/`, `/it/`, `/medical/`
Shared styles: `deployment/godaddy/public_html/shared/`

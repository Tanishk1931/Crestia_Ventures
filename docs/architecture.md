# Architecture

Crestia Ventures currently consists of **four independently developed website sections** that share one deployment tree for GoDaddy hosting.

## Sections

1. **Home** — React 18 + Vite 6 + Three.js + GSAP + Framer Motion (`frontend/home/`)
2. **RCM Services** — Static page in deployment + React 19 islands (`frontend/rcm/` → `deployment/godaddy/public_html/rcm/`)
3. **Healthcare** — Static HTML/CSS/JS in `deployment/godaddy/public_html/medical/` with React islands in `frontend/healthcare/`
4. **IT Recruitment** — Static page in `deployment/godaddy/public_html/it/` plus a separate React 19 + TypeScript app in `frontend/it-recruitment/`

## Current runtime model

- No application backend exists in this repository.
- Service pages are static files under `deployment/godaddy/public_html/`.
- The home Vite dev server can serve those service directories via middleware.
- RCM and healthcare React islands compile to IIFE bundles written into their static folders.

## Future unified domain

```
https://www.crestiaventures.com/       → Home
https://www.crestiaventures.com/rcm    → RCM
https://www.crestiaventures.com/healthcare → Healthcare
https://www.crestiaventures.com/it     → IT Recruitment
```

Unification into one technology stack and WordPress CMS integration is planned later. This repository layout prepares for that without merging apps yet.

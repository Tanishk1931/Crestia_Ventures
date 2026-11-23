# Deployment guide

See also: `deployment/deployment-guide.md` (GoDaddy-focused).

## What to deploy

1. **Service pages and shared assets** from `deployment/godaddy/public_html/`
2. **Home production build** from `deployment/production-build/` after `npm run build` in `frontend/home`

## Build order (recommended)

1. `frontend/rcm` → `npm run build`
2. `frontend/healthcare` → `npm run build`
3. `frontend/home` → `npm run build` (copies service folders into production-build)
4. Upload `deployment/production-build/` contents to the GoDaddy site root (or merge carefully with existing `public_html`)

## WordPress on GoDaddy (future)

- WordPress can own CMS routes while static/React builds continue to serve `/rcm`, `/medical` or `/healthcare`, and `/it`.
- Keep design by deploying the existing built CSS/JS unchanged.
- Do not convert React components to PHP for the first WordPress cutover.
- Confirm whether the GoDaddy plan supports only PHP/static hosting before adding any Node server.

## Hosting constraints

| Need | Typical GoDaddy WordPress plan |
|------|--------------------------------|
| Static HTML/CSS/JS | Supported |
| PHP (WordPress) | Supported |
| Node.js runtime for APIs | Often not available |
| Build tooling (Vite) | Run locally or in CI, not on the host |

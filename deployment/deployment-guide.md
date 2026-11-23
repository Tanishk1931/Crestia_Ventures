# Deployment guide (GoDaddy)

## Production files

The live static tree for hosting is:

`deployment/godaddy/public_html/`

| Path | Purpose |
|------|---------|
| `index.html` | Placeholder dark home document (React home is built separately) |
| `rcm/` | RCM services page + bundles |
| `it/` | IT staffing static page |
| `medical/` | Healthcare / medical staffing page |
| `healthcare-recruitment/` | Alternate healthcare recruitment page |
| `shared/` | Shared nav CSS/JS |
| `Gemini_Generated_Image_*.png`, `favicon.ico` | Brand assets |
| `chunk-*.js`, `main-*.js`, `polyfills-*.js`, `styles-*.css` | Legacy Angular homepage bundles (retained) |
| `crestiaventures-backup.zip` | Historical backup (retain) |

## Home production build

Building the main React site from `frontend/home/` writes to:

`deployment/production-build/`

That build also copies service directories from `deployment/godaddy/public_html/` into the production-build output.

## Run the complete site locally

The homepage Vite server also serves the static service pages from the GoDaddy web root:

```powershell
cd frontend/home
npm ci
npm run dev -- --host 0.0.0.0
```

Open the Vite URL (normally `http://localhost:5173/`). The service pages are available at
`/rcm/`, `/it/`, `/medical/`, and `/healthcare-recruitment/`.

For a production-like local preview, run `npm run build` and then `npm run preview`
from `frontend/home/`. The build output contains the React homepage and all four service routes.

## Upload to GoDaddy

1. Build home: `cd frontend/home && npm ci && npm run build`
2. Build RCM islands (optional if already current): `cd frontend/rcm && npm ci && npm run build`
3. Build healthcare islands (optional if already current): `cd frontend/healthcare && npm ci && npm run build`
4. Upload either:
   - Contents of `deployment/production-build/` as the site root, or
   - Contents of `deployment/godaddy/public_html/` for service pages, plus the home build assets as needed
5. Do not delete `crestiaventures-backup.zip` or legacy chunks unless you have verified nothing references them.

## Hosting requirements

- Static HTML/CSS/JS hosting is sufficient for current sections.
- Node.js is required for **local/CI builds only**, not necessarily on the GoDaddy server.
- Standard GoDaddy WordPress hosting may not support custom Node backends.
- See `docs/deployment-guide.md` for WordPress coexistence notes.

## Configuration files

cPanel/GoDaddy shell-related files are stored in:

`deployment/godaddy/configuration/`

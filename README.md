# Crestia Ventures

Crestia Ventures company website monorepo: main home experience, RCM services, healthcare pages, and IT recruitment — organized for future WordPress and GoDaddy hosting.

## Repository layout

| Path | Contents |
|------|----------|
| `frontend/home/` | Main React 18 + Vite brand site |
| `frontend/rcm/` | RCM React islands |
| `frontend/healthcare/` | Healthcare / medical React islands (static pages in deployment) |
| `frontend/it-recruitment/` | IT recruitment React 19 + TypeScript app |
| `deployment/godaddy/public_html/` | GoDaddy web root / service pages |
| `deployment/production-build/` | Home production build output |
| `wordpress/` | Future WordPress themes, plugins, integration notes |
| `backend/` | No backend yet |
| `shared/` | Shared / archived assets |
| `docs/` | Architecture, setup, and deployment documentation |

## Prerequisites

- Node.js 18 or newer
- npm

```powershell
node --version
npm --version
```

## Main website

```powershell
cd frontend/home
npm ci
npm run dev
```

Usually available at http://localhost:5173.

```powershell
npm run build
npm run preview
```

Production build writes to `deployment/production-build/` and copies service pages from `deployment/godaddy/public_html/`.

## IT recruitment application

```powershell
cd frontend/it-recruitment
npm ci
npm run dev
```

```powershell
npm run lint
npm run build
npm run preview
```

## RCM services application

```powershell
cd frontend/rcm
npm ci
npm run dev
```

```powershell
npm run build   # → deployment/godaddy/public_html/rcm/
```

## Healthcare / medical application

```powershell
cd frontend/healthcare
npm ci
npm run build   # → deployment/godaddy/public_html/medical/
```

## Documentation

- `docs/architecture.md`
- `docs/project-structure.md`
- `docs/setup-guide.md`
- `docs/deployment-guide.md`
- `deployment/deployment-guide.md`
- `wordpress/integration/README.md`

## Replace the 3D logo

The main scene loads `frontend/home/public/assets/brand-logo.obj` with materials from `brand-logo.mtl`. Replace both files together and keep the OBJ object names `Gold`, `Navy_Big`, `Navy_Small`, and `Green`.

Logo separation paths: `frontend/home/src/components/Logo3D.jsx`.  
Scroll timings: `frontend/home/src/components/ScrollController.jsx`.

## Change the background and company copy

Edit `frontend/home/src/data/brand.js`. Procedural background settings: `frontend/home/src/components/ui/ShaderBackground.jsx`.

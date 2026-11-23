# Healthcare / Medical

React islands and related source for the Crestia Ventures healthcare / medical staffing section.

## Source

| Path | Purpose |
|------|---------|
| `src/MedicalChoices.jsx` | Medical page React entry (IIFE mount) |
| `src/*Recruitment*`, `src/HealthcareSpecializations.jsx` | Healthcare page sections |
| `vite.config.js` | Builds into the static medical deployment folder |

## Static deployment pages

Editable/live static HTML for this section remains at:

- `deployment/godaddy/public_html/medical/`
- `deployment/godaddy/public_html/healthcare-recruitment/`

Shared nav assets: `deployment/godaddy/public_html/shared/`

## Commands

```powershell
cd frontend/healthcare
npm ci
npm run build
```

Build output: `deployment/godaddy/public_html/medical/` (`medical-cards.js` / `medical-cards.css`).

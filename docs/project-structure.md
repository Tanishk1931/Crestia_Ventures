# Project structure

```
crestia-ventures/
├── frontend/
│   ├── home/                 # Main React brand site
│   ├── rcm/                  # RCM React islands
│   ├── healthcare/           # Healthcare / medical React islands (static pages in deployment)
│   └── it-recruitment/       # Separate React + TypeScript IT app
├── backend/                  # Placeholder (no backend yet)
├── wordpress/
│   ├── themes/
│   ├── plugins/
│   └── integration/          # Future WP coexistence notes
├── deployment/
│   ├── godaddy/
│   │   ├── public_html/      # GoDaddy web root content
│   │   └── configuration/    # cPanel/shell hosting files
│   ├── production-build/     # Home Vite production output
│   └── deployment-guide.md
├── shared/
│   ├── images/               # Future cross-app images
│   ├── videos/
│   ├── fonts/
│   └── 3d-models/archive/    # Unused logo dump (brand logo still in frontend/home/public)
├── docs/
├── README.md
├── plan.md                   # Historical planning notes
└── .gitignore
```

## Important couplings

- Home `vite.config.js` reads and copies from `deployment/godaddy/public_html/`.
- Home `Navbar.jsx` imports `deployment/godaddy/public_html/shared/home-navbar.css`.
- RCM builds write into `deployment/godaddy/public_html/rcm/`.
- Healthcare builds write into `deployment/godaddy/public_html/medical/`.

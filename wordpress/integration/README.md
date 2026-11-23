# WordPress integration (future)

WordPress is **not installed** in this repository. This folder only prepares structure for a later GoDaddy + WordPress deployment.

## Goal

Serve one domain (`https://www.crestiaventures.com/`) with:

| Route | Current section |
|-------|-----------------|
| `/` | Home (React / Vite) |
| `/rcm` | RCM Services |
| `/healthcare` or `/medical` | Healthcare Services |
| `/it` | IT Recruitment |

## Recommended integration approach (no redesign)

1. Install WordPress on GoDaddy as the CMS for blog/content pages.
2. Keep the four existing frontends as **built static assets** (HTML/CSS/JS bundles) under the web root or a subdirectory.
3. Use WordPress only for content that benefits from a CMS; do not rewrite React components into PHP themes.
4. Options for mounting the existing UIs:
   - Deploy built files beside WordPress (`public_html/rcm`, `public_html/medical`, `public_html/it`, home `index` / assets).
   - Or load built bundles from a WordPress page template that only provides a mount point (`<div id="root">`) and enqueue scripts — preserving existing design.
5. Preserve current visual design by shipping the same production CSS/JS that already exists in `deployment/godaddy/public_html/`.

## Do not do in this phase

- Convert React components to PHP
- Install WordPress into this repo
- Overwrite existing GoDaddy deployment files
- Merge the four apps into one stack yet

## Themes / plugins

- `wordpress/themes/` — future custom theme packages
- `wordpress/plugins/` — future custom plugins

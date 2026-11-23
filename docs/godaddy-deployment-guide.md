# GoDaddy Managed WordPress — Deployment Guide

## Package

Installable theme ZIP:

`wordpress/crestia-theme.zip`

(Generated in Phase 10.)

## Install steps

1. Log in to GoDaddy Managed WordPress admin.
2. Appearance → Themes → Add New → Upload Theme.
3. Upload `crestia-theme.zip` and Activate.
4. On activation the theme creates:
   - Front page: Home
   - Page `/rcm/` → template **RCM Services**
   - Page `/healthcare/` → template **Healthcare Services**
   - Page `/it/` → template **IT Recruitment**
5. Settings → Reading → A static page → Front page: **Home**.
6. Settings → Permalinks → **Post name** → Save.
7. Visit:
   - `https://www.crestiaventures.com/`
   - `/rcm/`
   - `/healthcare/`
   - `/it/`
8. Confirm `/medical/` redirects to `/healthcare/`.

## Hosting notes

- No Node.js / Vite server required in production.
- PHP 8.x + MySQL (Managed WordPress).
- Assets load via `wp_enqueue_*` from the theme directory.
- Three.js logo uses an import map + ES modules (modern browsers).
- Do not install Elementor/Divi for these pages.

## Rollback

Keep originals under `frontend/` and `deployment/godaddy/public_html/` untouched. Switch back to a previous theme in WP Admin if needed.

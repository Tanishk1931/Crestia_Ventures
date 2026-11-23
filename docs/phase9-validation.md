# Phase 9 — Validation notes

## Structural validation (completed in this environment)

- Theme contains 95 files including PHP templates, CSS, JS, models, and media.
- Originals remain intact under `frontend/` and `deployment/godaddy/public_html/`.
- Routes wired in `inc/custom-functions.php` (page creation on theme switch + `/medical/` → `/healthcare/` redirect).
- Production stack has no React/Vite runtime dependency in the theme.

## Visual comparison workflow (operator)

1. Start LocalWP with Crestia Theme activated.
2. Open original baselines from `docs/baselines/`.
3. Compare WP pages at 1920 / 1366 / 768 / 390.
4. Check: logo assembly scroll, RCM ring drag, healthcare card flips, IT code-wave canvas, nav links.

## Pass criteria

Pages match original layout, typography, and motion intent at the same viewport sizes, with any differences limited to the known limitations in `docs/testing-report.md`.

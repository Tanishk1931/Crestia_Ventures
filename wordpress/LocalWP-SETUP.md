# Local WordPress setup (Crestia Theme)

The custom theme lives at `wordpress/crestia-theme/` and does **not** overwrite the original frontend apps.

## Recommended: LocalWP

1. Install [Local](https://localwp.com/) (LocalWP).
2. Create a new site (PHP 8.0+, Nginx or Apache, MySQL).
3. Copy or symlink `wordpress/crestia-theme` into the site’s `wp-content/themes/crestia-theme`.
4. In WP Admin → Appearance → Themes, activate **Crestia Theme**.
5. On activation the theme creates pages:
   - Home (front page)
   - `/rcm/`
   - `/healthcare/`
   - `/it/`
6. Settings → Reading → ensure “A static page” uses Home as the front page.
7. Settings → Permalinks → Post name (pretty permalinks).

## Without LocalWP

Any local stack (Docker `wordpress` image, XAMPP, Laravel Herd + WP) works if PHP 8.x and MySQL are available. Place the theme under `wp-content/themes/crestia-theme` and activate it.

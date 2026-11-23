<?php
/**
 * Styles and scripts.
 *
 * @package Crestia
 */

if (!defined('ABSPATH')) {
	exit;
}

add_action('wp_head', function () {
	if (!is_front_page()) {
		return;
	}
	$three = esc_url(crestia_asset('assets/vendor/three.module.js'));
	echo '<script type="importmap">' . wp_json_encode([
		'imports' => [
			'three' => $three,
		],
	], JSON_UNESCAPED_SLASHES) . '</script>' . "\n";
}, 1);

add_action('wp_enqueue_scripts', function () {
	$ver = CRESTIA_THEME_VERSION;

	$global_deps = [];
	// Home uses system fonts; Google families only on interior pages.
	if (!is_front_page()) {
		wp_enqueue_style(
			'crestia-fonts',
			'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;1,500&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&family=Manrope:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Syne:wght@600;700;750;800&display=swap',
			[],
			null
		);
		$global_deps[] = 'crestia-fonts';
	}

	wp_enqueue_style('crestia-global', crestia_asset('assets/css/global.css'), $global_deps, $ver . '-logo-z');
	wp_enqueue_style('crestia-shared-nav', crestia_asset('assets/shared/home-navbar.css'), ['crestia-global'], $ver);

	wp_enqueue_script('crestia-global', crestia_asset('assets/js/global.js'), [], $ver, true);

	if (is_front_page()) {
		wp_enqueue_style('crestia-home', crestia_asset('assets/css/home.css'), ['crestia-shared-nav'], $ver . '-home-opt');
		wp_enqueue_style('crestia-home-about', crestia_asset('assets/css/home-about.css'), ['crestia-home'], $ver . '-overline-hide');
		wp_enqueue_script('gsap', crestia_asset('assets/vendor/gsap.min.js'), [], '3.12.5', true);
		wp_enqueue_script('gsap-scrolltrigger', crestia_asset('assets/vendor/ScrollTrigger.min.js'), ['gsap'], '3.12.5', true);
		wp_enqueue_script('crestia-home-shader', crestia_asset('assets/js/home-shader.js'), [], $ver . '-home-opt', true);
		wp_enqueue_script('crestia-home', crestia_asset('assets/js/home.js'), ['gsap', 'gsap-scrolltrigger'], $ver . '-home-opt', true);
		wp_enqueue_script('crestia-home-logo', crestia_asset('assets/js/home-logo.js'), ['crestia-home'], $ver . '-logo-z', true);
		wp_script_add_data('crestia-home-logo', 'type', 'module');
		wp_localize_script('crestia-home', 'crestiaHome', [
			'themeUri' => CRESTIA_THEME_URI,
			'models'   => [
				'obj' => crestia_asset('assets/models/brand-logo.obj'),
				'mtl' => crestia_asset('assets/models/brand-logo.mtl'),
			],
			'about'    => crestia_asset('assets/home/about/'),
			'assets'   => crestia_asset('assets/home/assets/'),
		]);
	}

	if (is_page_template('templates/page-rcm.php')) {
		wp_enqueue_style('crestia-rcm', crestia_asset('assets/rcm/rcm.css'), ['crestia-shared-nav'], $ver);
		wp_enqueue_style('crestia-rcm-hero', crestia_asset('assets/rcm/hero-bg.css'), ['crestia-rcm'], $ver);
		wp_enqueue_style('crestia-rcm-ring', crestia_asset('assets/rcm/ring.css'), ['crestia-rcm'], $ver);
		wp_enqueue_style('crestia-rcm-sections', crestia_asset('assets/rcm/rcm-sections.css'), ['crestia-rcm'], $ver);
		wp_enqueue_style('crestia-rcm-cycle', crestia_asset('assets/rcm/rcm-cycle.css'), ['crestia-rcm'], $ver);
		wp_enqueue_script('gsap', crestia_asset('assets/vendor/gsap.min.js'), [], '3.12.5', true);
		wp_enqueue_script('crestia-rcm', crestia_asset('assets/rcm/rcm.js'), ['gsap'], $ver, true);
		wp_enqueue_script('crestia-rcm-hero-fx', crestia_asset('assets/rcm/hero-fx.js'), ['crestia-rcm'], $ver, true);
		wp_enqueue_script('crestia-rcm-sections', crestia_asset('assets/rcm/rcm-sections.js'), ['crestia-rcm'], $ver, true);
		wp_enqueue_script('crestia-rcm-cycle', crestia_asset('assets/rcm/rcm-cycle.js'), ['crestia-rcm'], $ver, true);
		wp_enqueue_script('crestia-rcm-ring', crestia_asset('assets/rcm/ring.js'), [], $ver, true);
		wp_script_add_data('crestia-rcm-ring', 'type', 'module');
	}

	if (is_page_template('templates/page-healthcare.php')) {
		wp_enqueue_style('crestia-healthcare', crestia_asset('assets/healthcare/medical.css'), ['crestia-shared-nav'], $ver);
		wp_enqueue_style('crestia-healthcare-cards', crestia_asset('assets/css/healthcare.css'), ['crestia-healthcare'], $ver . '-hc-restore');
		wp_enqueue_script('gsap', crestia_asset('assets/vendor/gsap.min.js'), [], '3.12.5', true);
		wp_enqueue_script('gsap-scrolltrigger', crestia_asset('assets/vendor/ScrollTrigger.min.js'), ['gsap'], '3.12.5', true);
		wp_enqueue_script('crestia-healthcare-intro', crestia_asset('assets/healthcare/medical.js'), ['gsap'], $ver, true);
		wp_enqueue_script('crestia-healthcare', crestia_asset('assets/js/healthcare.js'), ['gsap', 'gsap-scrolltrigger'], $ver . '-hc-restore', true);
		wp_localize_script('crestia-healthcare', 'crestiaHealthcare', [
			'assets' => crestia_asset('assets/healthcare/assets/'),
			'video'  => crestia_asset('assets/videos/hospital.mp4'),
		]);
	}

	if (is_page_template('templates/page-it.php')) {
		wp_enqueue_style('crestia-it', crestia_asset('assets/it/it.css'), ['crestia-shared-nav'], $ver . '-it-opt');
		wp_enqueue_script('crestia-it-wave', crestia_asset('assets/it/code-wave.js'), [], $ver . '-it-opt', true);
		wp_enqueue_script('crestia-it', crestia_asset('assets/it/it.js'), ['crestia-it-wave'], $ver . '-it-opt', true);
	}
});

/**
 * Ensure module scripts keep type=module.
 */
add_filter('script_loader_tag', function ($tag, $handle, $src) {
	$modules = ['crestia-home-logo', 'crestia-rcm-ring'];
	if (in_array($handle, $modules, true)) {
		$tag = preg_replace('/<script\s/', '<script type="module" ', $tag, 1);
	}
	return $tag;
}, 10, 3);

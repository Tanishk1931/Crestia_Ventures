<?php
/**
 * Helpers and routing helpers.
 *
 * @package Crestia
 */

if (!defined('ABSPATH')) {
	exit;
}

/**
 * Theme asset URI helper.
 */
function crestia_asset(string $relative_path): string {
	return trailingslashit(CRESTIA_THEME_URI) . ltrim($relative_path, '/');
}

/**
 * Detect Crestia page templates / front page for body classes.
 */
add_filter('body_class', function (array $classes): array {
	if (is_front_page()) {
		$classes[] = 'crestia-home';
	}
	if (is_page_template('templates/page-rcm.php')) {
		$classes[] = 'rcm-page';
		$classes[] = 'js';
	}
	if (is_page_template('templates/page-healthcare.php')) {
		$classes[] = 'medical-page';
	}
	if (is_page_template('templates/page-it.php')) {
		$classes[] = 'it-page';
		$classes[] = 'js';
	}
	return $classes;
});

/**
 * Redirect legacy /medical/ to /healthcare/ when the Healthcare page exists.
 */
add_action('template_redirect', function () {
	$request = trim($_SERVER['REQUEST_URI'] ?? '', '/');
	$path = strtok($request, '?');
	if ($path === 'medical' || str_starts_with((string) $path, 'medical/')) {
		$page = get_page_by_path('healthcare');
		if ($page instanceof WP_Post) {
			wp_safe_redirect(get_permalink($page), 301);
			exit;
		}
	}
});

/**
 * On theme switch, ensure core pages exist with correct templates and slugs.
 */
add_action('after_switch_theme', function () {
	$pages = [
		'rcm' => [
			'title'    => 'Revenue Cycle Management',
			'template' => 'templates/page-rcm.php',
		],
		'healthcare' => [
			'title'    => 'Healthcare',
			'template' => 'templates/page-healthcare.php',
		],
		'it' => [
			'title'    => 'IT Recruitment',
			'template' => 'templates/page-it.php',
		],
	];

	foreach ($pages as $slug => $config) {
		$existing = get_page_by_path($slug);
		if (!$existing) {
			$id = wp_insert_post([
				'post_title'  => $config['title'],
				'post_name'   => $slug,
				'post_status' => 'publish',
				'post_type'   => 'page',
			]);
			if (!is_wp_error($id) && $id) {
				update_post_meta($id, '_wp_page_template', $config['template']);
			}
		} else {
			update_post_meta($existing->ID, '_wp_page_template', $config['template']);
		}
	}

	$front = get_option('page_on_front');
	if (!$front) {
		$home = get_page_by_path('home');
		if (!$home) {
			$home_id = wp_insert_post([
				'post_title'  => 'Home',
				'post_name'   => 'home',
				'post_status' => 'publish',
				'post_type'   => 'page',
			]);
			if (!is_wp_error($home_id) && $home_id) {
				update_option('show_on_front', 'page');
				update_option('page_on_front', $home_id);
			}
		} else {
			update_option('show_on_front', 'page');
			update_option('page_on_front', $home->ID);
		}
	}
});

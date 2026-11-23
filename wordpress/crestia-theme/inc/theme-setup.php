<?php
/**
 * Theme supports and menus.
 *
 * @package Crestia
 */

if (!defined('ABSPATH')) {
	exit;
}

add_action('after_setup_theme', function () {
	add_theme_support('title-tag');
	add_theme_support('post-thumbnails');
	add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script']);
	add_theme_support('custom-logo', [
		'height'      => 84,
		'width'       => 84,
		'flex-height' => true,
		'flex-width'  => true,
	]);

	register_nav_menus([
		'primary' => __('Primary Navigation', 'crestia'),
	]);
});

<?php
/**
 * Crestia Theme functions.
 *
 * @package Crestia
 */

if (!defined('ABSPATH')) {
	exit;
}

define('CRESTIA_THEME_VERSION', '1.0.0');
define('CRESTIA_THEME_DIR', get_template_directory());
define('CRESTIA_THEME_URI', get_template_directory_uri());

require_once CRESTIA_THEME_DIR . '/inc/theme-setup.php';
require_once CRESTIA_THEME_DIR . '/inc/enqueue.php';
require_once CRESTIA_THEME_DIR . '/inc/custom-functions.php';
require_once CRESTIA_THEME_DIR . '/inc/api.php';

<?php
/**
 * Site header shell.
 *
 * @package Crestia
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="theme-color" content="<?php echo esc_attr(is_front_page() ? '#FFFAED' : '#FAF9F6'); ?>">
	<link rel="icon" href="<?php echo esc_url(crestia_asset('assets/images/favicon.ico')); ?>">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

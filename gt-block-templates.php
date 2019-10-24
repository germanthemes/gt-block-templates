<?php
/*
Plugin Name: GT Block Templates
Plugin URI: https://germanthemes.de/en/block-templates/
Description: Block Templates Plugin
Author: GermanThemes
Author URI: https://germanthemes.de/en/
Version: 1.0
Text Domain: gt-block-templates
Domain Path: /languages/
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

GT Block Templates
Copyright(C) 2019, germanthemes.de - support@germanthemes.de
*/

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main GermanThemes_Block_Templates Class
 *
 * @package GT Block Templates
 */
class GermanThemes_Block_Templates {

	/**
	 * Call all Functions to setup the Plugin
	 *
	 * @uses GermanThemes_Block_Templates::constants() Setup the constants needed
	 * @uses GermanThemes_Block_Templates::includes() Include the required files
	 * @uses GermanThemes_Block_Templates::setup_actions() Setup the hooks and actions
	 * @return void
	 */
	static function setup() {

		// Setup Constants.
		self::constants();

		// Setup Translation.
		add_action( 'plugins_loaded', array( __CLASS__, 'translation' ) );

		// Enqueue Block Styles.
		add_action( 'enqueue_block_assets', array( __CLASS__, 'enqueue_block_scripts' ) );

		// Enqueue Block Scripts and Styles for Gutenberg Editor.
		add_action( 'enqueue_block_editor_assets', array( __CLASS__, 'enqueue_block_editor_scripts' ) );

		// Add block category.
		add_filter( 'block_categories', array( __CLASS__, 'block_categories' ), 10, 2 );
	}

	/**
	 * Setup plugin constants
	 *
	 * @return void
	 */
	static function constants() {

		// Define Version Number.
		define( 'GT_BLOCK_TEMPLATES_VERSION', '1.0' );

		// Plugin Folder Path.
		define( 'GT_BLOCK_TEMPLATES_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

		// Plugin Folder URL.
		define( 'GT_BLOCK_TEMPLATES_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

		// Plugin Root File.
		define( 'GT_BLOCK_TEMPLATES_PLUGIN_FILE', __FILE__ );
	}

	/**
	 * Load Translation File
	 *
	 * @return void
	 */
	static function translation() {
		load_plugin_textdomain( 'gt-block-templates', false, dirname( plugin_basename( GT_BLOCK_TEMPLATES_PLUGIN_FILE ) ) . '/languages/' );
	}

	/**
	 * Enqueue Block Styles
	 *
	 * Used in Frontend and Backend
	 *
	 * @return void
	 */
	static function enqueue_block_scripts() {
		wp_enqueue_style( 'gt-block-templates', GT_BLOCK_TEMPLATES_PLUGIN_URL . 'assets/css/gt-block-templates.css', array(), GT_BLOCK_TEMPLATES_VERSION );
	}

	/**
	 * Enqueue Scripts and Styles for Blocks
	 *
	 * Used in Backend in Gutenberg Editor only
	 *
	 * @return void
	 */
	static function enqueue_block_editor_scripts() {
		// Enqueue GT Block Templates in Gutenberg.
		wp_enqueue_script( 'gt-block-templates-editor', GT_BLOCK_TEMPLATES_PLUGIN_URL . 'assets/js/gt-block-templates-editor.js', array(
			'wp-blocks',
			'wp-i18n',
			'wp-element',
			'wp-components',
			'wp-editor',
			'lodash',
		), GT_BLOCK_TEMPLATES_VERSION );

		// Transfer Data from PHP to GT Block Templates Redux Store.
		wp_add_inline_script( 'gt-block-templates-editor', self::get_dispatch_data(), 'after' );

		// Load javascript translation files.
		wp_set_script_translations( 'gt-block-templates-editor', 'gt-block-templates', GT_BLOCK_TEMPLATES_PLUGIN_DIR . 'languages' );

		// Enqueue Editor Stylesheet for GT Block Templates.
		wp_enqueue_style( 'gt-block-templates-editor', GT_BLOCK_TEMPLATES_PLUGIN_URL . 'assets/css/gt-block-templates-editor.css', array( 'wp-edit-blocks', 'gt-block-templates' ), GT_BLOCK_TEMPLATES_VERSION );
	}

	/**
	 * Generate Code to dispatch data from PHP to Redux store.
	 *
	 * @return $script Data Dispatch code.
	 */
	static function get_dispatch_data() {
		$script = '';

		// Add Plugin URL.
		$script .= sprintf( 'wp.data.dispatch( "gt-block-templates-store" ).setPluginURL( %s );', wp_json_encode( GT_BLOCK_TEMPLATES_PLUGIN_URL ) );

		return $script;
	}

	/**
	 * Define custom image sizes
	 *
	 * @return void
	 */
	static function block_categories( $categories, $post ) {
		return array_merge(
			$categories,
			array(
				array(
					'slug'  => 'gt-block-templates',
					'title' => __( 'GT Block Templates', 'gt-block-templates' ),
				),
			)
		);
	}
}

// Run Plugin.
GermanThemes_Block_Templates::setup();

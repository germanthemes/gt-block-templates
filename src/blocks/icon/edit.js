/**
 * External dependencies
 */
import classnames from 'classnames';
const { getComputedStyle } = window;

/**
 * WordPress dependencies
 */
const {
	Component,
	Fragment,
} = wp.element;

const { __ } = wp.i18n;
const { compose } = wp.compose;

const {
	AlignmentToolbar,
	BlockControls,
	ContrastChecker,
	InspectorControls,
	PanelColorSettings,
	withColors,
} = wp.editor;

const {
	PanelBody,
	SelectControl,
	withFallbackStyles,
} = wp.components;

/**
 * Internal dependencies
 */
import { default as IconPicker } from '../../components/icon-picker';

/**
 * Block Edit Component
 */
class IconEdit extends Component {
	getIconSizeInPixel( sizeStr ) {
		switch ( sizeStr ) {
			case 'small': {
				return 16;
			}
			case 'medium': {
				return 48;
			}
			case 'large': {
				return 64;
			}
			case 'extra-large': {
				return 96;
			}
			case 'huge': {
				return 128;
			}
		}

		return 32;
	}

	render() {
		const {
			attributes,
			backgroundColor,
			setBackgroundColor,
			fallbackBackgroundColor,
			textColor,
			setTextColor,
			fallbackTextColor,
			setAttributes,
			isSelected,
			className,
		} = this.props;

		const {
			icon,
			textAlignment,
			iconLayout,
			iconSize,
			iconPadding,
			borderWidth,
		} = attributes;

		const blockStyles = {
			textAlign: textAlignment,
		};

		const iconClasses = classnames( 'gt-icon', {
			[ `gt-icon-${ iconLayout }` ]: 'default' !== iconLayout,
			[ `gt-icon-${ iconPadding }-padding` ]: 'normal' !== iconPadding && 'default' !== iconLayout,
			[ `gt-icon-${ borderWidth }-border` ]: 'normal' !== borderWidth && 'outline' === iconLayout,
			'has-text-color': textColor.color,
			[ textColor.class ]: textColor.class,
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
		} );

		const iconStyles = {
			color: textColor.class ? undefined : textColor.color,
			backgroundColor: backgroundColor.class ? undefined : backgroundColor.color,
		};

		return (
			<Fragment>

				<BlockControls key="controls">

					<AlignmentToolbar
						value={ textAlignment }
						onChange={ ( newAlignment ) => setAttributes( { textAlignment: newAlignment } ) }
					/>

				</BlockControls>

				<InspectorControls key="inspector">

					<PanelBody title={ __( 'Icon Settings', 'gt-block-templates' ) } initialOpen={ true } className="gt-panel-icon-settings gt-panel">

						<SelectControl
							label={ __( 'Icon Style', 'gt-block-templates' ) }
							value={ iconLayout }
							onChange={ ( newStyle ) => setAttributes( { iconLayout: newStyle } ) }
							options={ [
								{ value: 'default', label: __( 'Default', 'gt-block-templates' ) },
								{ value: 'circular', label: __( 'Circular', 'gt-block-templates' ) },
								{ value: 'outline', label: __( 'Outline', 'gt-block-templates' ) },
								{ value: 'square', label: __( 'Square', 'gt-block-templates' ) },
								{ value: 'rounded', label: __( 'Rounded', 'gt-block-templates' ) },
								{ value: 'full', label: __( 'Full', 'gt-block-templates' ) },
							] }
						/>

						<SelectControl
							label={ __( 'Icon Size', 'gt-block-templates' ) }
							value={ iconSize }
							onChange={ ( newSize ) => setAttributes( { iconSize: newSize } ) }
							options={ [
								{ value: 'small', label: __( 'Small', 'gt-block-templates' ) },
								{ value: 'normal', label: __( 'Normal', 'gt-block-templates' ) },
								{ value: 'medium', label: __( 'Medium', 'gt-block-templates' ) },
								{ value: 'large', label: __( 'Large', 'gt-block-templates' ) },
								{ value: 'extra-large', label: __( 'Extra Large', 'gt-block-templates' ) },
								{ value: 'huge', label: __( 'Huge', 'gt-block-templates' ) },
							] }
						/>

						{ iconLayout !== 'default' && (
							<SelectControl
								label={ __( 'Icon Padding', 'gt-block-templates' ) }
								value={ iconPadding }
								onChange={ ( newPadding ) => setAttributes( { iconPadding: newPadding } ) }
								options={ [
									{ value: 'small', label: __( 'Small', 'gt-block-templates' ) },
									{ value: 'normal', label: __( 'Normal', 'gt-block-templates' ) },
									{ value: 'medium', label: __( 'Medium', 'gt-block-templates' ) },
									{ value: 'large', label: __( 'Large', 'gt-block-templates' ) },
								] }
							/>
						) }

						{ 'outline' === iconLayout && (
							<SelectControl
								label={ __( 'Border Width', 'gt-block-templates' ) }
								value={ borderWidth }
								onChange={ ( newWidth ) => setAttributes( { borderWidth: newWidth } ) }
								options={ [
									{ value: 'thin', label: __( 'Thin', 'gt-block-templates' ) },
									{ value: 'normal', label: __( 'Normal', 'gt-block-templates' ) },
									{ value: 'thick', label: __( 'Thick', 'gt-block-templates' ) },
								] }
							/>
						) }

					</PanelBody>

					<PanelColorSettings
						title={ __( 'Color Settings', 'gt-block-templates' ) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: backgroundColor.color,
								onChange: setBackgroundColor,
								label: __( 'Background Color', 'gt-block-templates' ),
							},
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __( 'Text Color', 'gt-block-templates' ),
							},
						] }
					>
						<ContrastChecker
							{ ...{
								textColor: textColor.color,
								backgroundColor: backgroundColor.color,
								fallbackTextColor,
								fallbackBackgroundColor,
							} }
							fontSize={ 32 }
						/>
					</PanelColorSettings>

				</InspectorControls>

				<div className={ className } style={ blockStyles }>
					<IconPicker
						icon={ icon }
						iconClasses={ iconClasses }
						iconStyles={ iconStyles }
						iconSize={ this.getIconSizeInPixel( iconSize ) }
						isSelected={ isSelected }
						onChange={ ( newIcon ) => setAttributes( { icon: newIcon } ) }
					/>
				</div>
			</Fragment>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } ),
	withFallbackStyles( ( node, ownProps ) => {
		const { textColor, backgroundColor } = ownProps.attributes;
		const editableNode = node.querySelector( '[contenteditable="true"]' );
		//verify if editableNode is available, before using getComputedStyle.
		const computedStyles = editableNode ? getComputedStyle( editableNode ) : null;
		return {
			fallbackBackgroundColor: backgroundColor || ! computedStyles ? undefined : computedStyles.backgroundColor,
			fallbackTextColor: textColor || ! computedStyles ? undefined : computedStyles.color,
		};
	} ),
] )( IconEdit );

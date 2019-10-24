/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { Component, Fragment } = wp.element;
const { compose } = wp.compose;
const { __ } = wp.i18n;
const { withSelect } = wp.data;
const { PlainText } = wp.editor;

const {
	Button,
	Modal,
	Placeholder,
	Tooltip,
} = wp.components;

/**
 * Internal dependencies
 */
import './editor.scss';

const ICONS = [
	'address-book', 'address-card', 'adjust', 'air-freshener', 'align-center', 'align-justify', 'align-left', 'align-right',
];

class TemplatePicker extends Component {
	constructor() {
		super( ...arguments );
		this.openModal = this.openModal.bind( this );
		this.closeModal = this.closeModal.bind( this );
		this.searchIcon = this.searchIcon.bind( this );

		this.state = {
			isModalActive: false,
			icons: ICONS,
		};
	}

	componentDidUpdate( prevProps, prevState ) {
		const { isModalActive } = this.state;

		// Reset icons when modal is openend.
		if ( isModalActive && ! prevState.isModalActive ) {
			this.setState( { icons: ICONS } );
		}
	}

	openModal() {
		this.setState( { isModalActive: true } );
	}

	closeModal() {
		this.setState( { isModalActive: false } );
	}

	setIcon( icon ) {
		const { onChange } = this.props;

		// Change Icon with function from parent.
		onChange( icon );

		// Hide TemplatePicker after icon is selected.
		this.closeModal();

		// Reset available icons.
		this.setState( { icons: ICONS } );
	}

	generateIconList() {
		const icons = this.state.icons;

		return (
			<div className="gt-icon-picker-grid">

				{
					icons.map( ( icon ) => {
						return (
							<Button
								key={ icon }
								className="gt-icon-link"
								onClick={ () => this.setIcon( icon ) }
							>
								<Tooltip text={ icon }>
									{ this.displayIcon( icon ) }
								</Tooltip>
							</Button>
						);
					} )
				}

			</div>
		);
	}

	searchIcon( input ) {
		const filtered = ICONS.filter( icon => icon.match( input.toLowerCase().trim() ) );
		this.setState( { icons: filtered } );
	}

	displayIcon( icon, iconSize = 32 ) {
		const { pluginURL } = this.props;

		const svgURL = pluginURL + 'assets/icons/fontawesome.svg#' + icon;
		const svgClass = classnames( 'icon', `icon-${ icon }` );
		const svgStyles = {
			width: iconSize !== 32 ? iconSize + 'px' : undefined,
			height: iconSize !== 32 ? iconSize + 'px' : undefined,
		};

		return (
			<span className="gt-icon-svg" data-icon={ icon }>
				<svg className={ svgClass } style={ svgStyles } aria-hidden="true" role="img">
					<use href={ svgURL }></use>
				</svg>
			</span>
		);
	}

	displayIconPlaceholder() {
		const {
			icon,
			iconClasses,
			iconStyles,
			iconSize,
			isSelected,
		} = this.props;

		return (
			<div className="gt-icon-placeholder-wrapper">

				{ ! icon ? (

					<Fragment>
						<Placeholder
							className="gt-icon-placeholder"
							instructions={ __( 'Choose an icon here.', 'gt-block-templates' ) }
							icon="info"
							label={ __( 'Icon', 'gt-block-templates' ) }
						>
							<Button isLarge onClick={ this.openModal }>
								{ __( 'Select icon', 'gt-block-templates' ) }
							</Button>
						</Placeholder>

					</Fragment>

				) : (

					<Fragment>

						{ isSelected ? (

							<Button className="gt-show-icon-picker" onClick={ this.openModal }>
								<Tooltip text={ __( 'Edit icon', 'gt-block-templates' ) }>
									<div className={ iconClasses } style={ iconStyles }>
										{ this.displayIcon( icon, iconSize ) }
									</div>
								</Tooltip>
							</Button>

						) : (

							<div className={ iconClasses } style={ iconStyles }>
								{ this.displayIcon( icon, iconSize ) }
							</div>

						) }

					</Fragment>

				) }

			</div>
		);
	}

	render() {
		const title = (
			<span className="gt-icon-picker-title">
				{ __( 'Select Icon', 'gt-block-templates' ) }
				<Button onClick={ () => this.setIcon( undefined ) } className="gt-remove-icon">
					{ __( 'Remove icon', 'gt-block-templates' ) }
				</Button>
			</span>
		);

		return (
			<Fragment>

				{ this.displayIconPlaceholder() }

				{ this.state.isModalActive && (
					<Modal
						className="gt-block-templates-icon-picker-modal"
						title={ title }
						closeLabel={ __( 'Close', 'gt-block-templates' ) }
						onRequestClose={ this.closeModal }
						focusOnMount={ false }
					>
						<PlainText
							className="gt-icon-picker-search"
							placeholder={ __( 'Search for icon', 'gt-block-templates' ) }
							onChange={ this.searchIcon }
							// eslint-disable-next-line jsx-a11y/no-autofocus
							autoFocus={ true }
						/>

						<div className="gt-icon-picker-list">
							{ this.generateIconList() }
						</div>

					</Modal>
				) }

			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select ) => {
		const pluginURL = select( 'gt-block-templates-store' ).getPluginURL();

		return { pluginURL };
	} ),
] )( TemplatePicker );

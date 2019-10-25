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

const TEMPLATES = [
	'address-book', 'address-card', 'adjust', 'air-freshener', 'align-center', 'align-justify', 'align-left', 'align-right',
];

class TemplatePicker extends Component {
	constructor() {
		super( ...arguments );
		this.openModal = this.openModal.bind( this );
		this.closeModal = this.closeModal.bind( this );

		this.state = {
			isModalActive: false,
			templates: TEMPLATES,
		};
	}

	componentDidUpdate( prevProps, prevState ) {
		const { isModalActive } = this.state;

		// Reset templates when modal is openend.
		if ( isModalActive && ! prevState.isModalActive ) {
			this.setState( { templates: TEMPLATES } );
		}
	}

	openModal() {
		this.setState( { isModalActive: true } );
	}

	closeModal() {
		this.setState( { isModalActive: false } );
	}

	setTemplate( template ) {
		const { onChange } = this.props;

		// Change Template with function from parent.
		onChange( template );

		// Hide TemplatePicker after template is selected.
		this.closeModal();

		// Reset available templates.
		this.setState( { templates: TEMPLATES } );
	}

	generateTemplateList() {
		const templates = this.state.templates;

		return (
			<div className="gt-template-picker-grid">

				{
					templates.map( ( template ) => {
						return (
							<Button
								key={ template }
								className="gt-template-link"
								onClick={ () => this.setTemplate( template ) }
							>
								<Tooltip text={ template }>
									{ this.displayTemplate( template ) }
								</Tooltip>
							</Button>
						);
					} )
				}

			</div>
		);
	}

	displayTemplate( template, templateSize = 32 ) {
		const { pluginURL } = this.props;

		const svgURL = pluginURL + 'assets/icons/fontawesome.svg#' + template;
		const svgClass = classnames( 'template', `template-${ template }` );
		const svgStyles = {
			width: templateSize !== 32 ? templateSize + 'px' : undefined,
			height: templateSize !== 32 ? templateSize + 'px' : undefined,
		};

		return (
			<span className="gt-template-svg" data-icon={ template }>
				<svg className={ svgClass } style={ svgStyles } aria-hidden="true" role="img">
					<use href={ svgURL }></use>
				</svg>
			</span>
		);
	}

	displayTemplatePlaceholder() {
		const {
			template,
			templateClasses,
			templateStyles,
			templateSize,
			isSelected,
		} = this.props;

		return (
			<div className="gt-template-placeholder-wrapper">

				{ ! template ? (

					<Fragment>
						<Placeholder
							className="gt-template-placeholder"
							instructions={ __( 'Choose an template here.', 'gt-block-templates' ) }
							template="info"
							label={ __( 'Template', 'gt-block-templates' ) }
						>
							<Button isLarge onClick={ this.openModal }>
								{ __( 'Select template', 'gt-block-templates' ) }
							</Button>
						</Placeholder>

					</Fragment>

				) : (

					<Fragment>

						{ isSelected ? (

							<Button className="gt-show-template-picker" onClick={ this.openModal }>
								<Tooltip text={ __( 'Edit template', 'gt-block-templates' ) }>
									<div className={ templateClasses } style={ templateStyles }>
										{ this.displayTemplate( template, templateSize ) }
									</div>
								</Tooltip>
							</Button>

						) : (

							<div className={ templateClasses } style={ templateStyles }>
								{ this.displayTemplate( template, templateSize ) }
							</div>

						) }

					</Fragment>

				) }

			</div>
		);
	}

	render() {
		const title = (
			<span className="gt-template-picker-title">
				{ __( 'Select Template', 'gt-block-templates' ) }
				<Button onClick={ () => this.setTemplate( undefined ) } className="gt-remove-template">
					{ __( 'Remove template', 'gt-block-templates' ) }
				</Button>
			</span>
		);

		return (
			<Fragment>

				{ this.displayTemplatePlaceholder() }

				{ this.state.isModalActive && (
					<Modal
						className="gt-block-templates-template-picker-modal"
						title={ title }
						closeLabel={ __( 'Close', 'gt-block-templates' ) }
						onRequestClose={ this.closeModal }
						focusOnMount={ false }
					>

						<div className="gt-template-picker-list">
							{ this.generateTemplateList() }
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

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
const { withSelect, dispatch } = wp.data;
const { parse } = wp.blockSerializationDefaultParser;
const { createBlock, rawHandler } = wp.blocks;

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
	{
		title: 'Homepage 1',
		category: 'homepage',
		image: 'address-book',
		file: 'homepage/homepage-1.json',
	},
	{
		title: 'Homepage 2',
		category: 'homepage',
		image: 'adjust',
		file: 'homepage/homepage-2.json',
	},
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

	createBlockObjects( blockData ) {
		if ( typeof blockData !== 'undefined' && blockData.length > 0 ) {
			return blockData.map( block => ( createBlock( block.blockName, { content: block.innerHTML, ...block.attrs }, this.createBlockObjects( block.innerBlocks ) ) ) );
		}

		return [];
	}

	async insertTemplate( template ) {

		// Load Block Template from json file.
		const tmpl = await require( '../../templates/' + template.file );

		// Parse Json to Block Objects.
		const blockData = parse( tmpl.content );

		console.log( blockData );

		// Create Blocks.
		const blocks = this.createBlockObjects( blockData );
		//const blocks = rawHandler( tmpl.content );

		console.log( blocks );

		// Insert Blocks into Content.
		//dispatch( 'core/editor' ).insertBlocks( blocks );

		// Hide TemplatePicker after template is selected.
		//this.closeModal();

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
								key={ template.file }
								className="gt-template-link"
								onClick={ () => this.insertTemplate( template ) }
							>
								<Tooltip text={ template.title }>
									{ this.displayTemplate( template ) }
								</Tooltip>
							</Button>
						);
					} )
				}

			</div>
		);
	}

	displayTemplate( template ) {
		const { pluginURL } = this.props;

		const svgURL = pluginURL + 'assets/icons/fontawesome.svg#' + template.image;
		const svgClass = classnames( 'template', `template-${ template.image }` );

		return (
			<span className="gt-template-svg" data-icon={ template.image }>
				<svg className={ svgClass } aria-hidden="true" role="img">
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
			isSelected,
		} = this.props;

		return (
			<div className="gt-template-placeholder-wrapper">

				{ ! template ? (

					<Fragment>
						<Placeholder
							className="gt-template-placeholder"
							instructions={ __( 'Choose an template here.', 'gt-block-templates' ) }
							icon="info"
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
										{ this.displayTemplate( template ) }
									</div>
								</Tooltip>
							</Button>

						) : (

							<div className={ templateClasses } style={ templateStyles }>
								{ this.displayTemplate( template ) }
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

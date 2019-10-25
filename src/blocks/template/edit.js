/**
 * WordPress dependencies
 */
const {
	Component,
	Fragment,
} = wp.element;

/**
 * Internal dependencies
 */
import { default as TemplatePicker } from '../../components/template-picker';

/**
 * Block Edit Component
 */
class TemplateEdit extends Component {
	render() {
		const {
			attributes,
			setAttributes,
			isSelected,
			className,
		} = this.props;

		const {
			template,
		} = attributes;

		return (
			<Fragment>
				<div className={ className }>
					<TemplatePicker
						template={ template }
						templateSize={ 64 }
						isSelected={ isSelected }
						onChange={ ( newTemplate ) => setAttributes( { template: newTemplate } ) }
					/>
				</div>
			</Fragment>
		);
	}
}

export default TemplateEdit;

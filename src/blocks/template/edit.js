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
			icon,
		} = attributes;

		return (
			<Fragment>
				<div className={ className }>
					<TemplatePicker
						icon={ icon }
						iconSize={ 64 }
						isSelected={ isSelected }
						onChange={ ( newIcon ) => setAttributes( { icon: newIcon } ) }
					/>
				</div>
			</Fragment>
		);
	}
}

export default TemplateEdit;

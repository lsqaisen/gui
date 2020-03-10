import { Form, Row, Col, Input } from 'antd';
import { FormInput } from 'library';
import { FormInputProps } from 'library/type/forminput/';
import { PureComponent } from 'react';

const FormItem = Form.Item;

export type Label = {
	key: string
	value: string
}
export interface LabelInputProps extends FormInputProps<Label> {
	others: Label[];
}

@(FormInput.create({ name: 'label' }) as any)
class LabelInput extends PureComponent<LabelInputProps, any> {
	static readonly defaultProps = {
		form: {} as any,
	}

	render() {
		const { value, others, form, ref } = this.props;
		const { key, value: _value } = value!;
		const { getFieldDecorator, getFieldError, setFields } = form;
		if (getFieldError('key') && !!key && others.every(v => v.key !== key)) {
			setFields({ key: { value: key, errors: undefined } })
		}
		return (
			<Row style={{ background: '#ECECEC', padding: '8px', marginBottom: '16px' }} ref={ref}>
				<Col span={24}>
					<FormItem >
						{getFieldDecorator('key', {
							initialValue: key,
							rules: [
								{ required: true, message: '名必须填写' },
								{
									validator: (_, yaml, callback) => {
										if (others.some(({ key }) => !!yaml && key === yaml)) {
											callback('存在相同的标签名')
										}
										callback()
									}
								}],
						})(
							<Input placeholder='请输入标签名' />
						)}
					</FormItem>
				</Col>
				<Col span={24}>
					<FormItem>
						{getFieldDecorator('value', {
							initialValue: _value,
							rules: [
								{ required: true, message: '值必须填写' },
							]
						})(
							<Input.TextArea style={{ width: '100%' }} />
						)}
					</FormItem>
				</Col>
			</Row>
		)
	}
}

export default LabelInput;
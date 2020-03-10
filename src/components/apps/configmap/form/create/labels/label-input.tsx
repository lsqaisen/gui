
import * as React from 'react';
import { Form, Row, Col, Input } from 'antd';
import * as YAML from 'js-yaml';
import { FormInput, Inputs } from 'library';
import { FormInputProps } from 'library/type/forminput/';

const FormItem = Form.Item;

export type Label = {
	key: string
	yaml: string
}
export interface LabelInputProps extends FormInputProps<Label> {
	others: Label[];
}

@(FormInput.create({ name: 'label' }) as any)
class LabelInput extends React.PureComponent<LabelInputProps, any> {
	static readonly defaultProps = {
		form: {} as any,
	}

	render() {
		const { value, others, form, ref } = this.props;
		const { key, yaml: _yaml } = value!;
		const { getFieldDecorator, getFieldError, setFields } = form;
		if (getFieldError('key') && !!key && others.every(v => v.key !== key)) {
			setFields({ key: { yaml: key, errors: undefined } })
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
						{getFieldDecorator('yaml', {
							initialValue: _yaml,
							rules: [
								{ required: true, message: '值必须填写' },
								{
									validator: (_, yaml, callback) => {
										try {
											YAML.load(yaml);
											callback();
										} catch (error) {
											callback('YAML格式不正确！')
										}
										callback();
									}
								}
							]
						})(
							<Inputs.Code style={{ width: '100%' }} autosize mode="yaml" />
						)}
					</FormItem>
				</Col>
			</Row>
		)
	}
}

export default LabelInput;
import { PureComponent } from 'react';
import { Form, Row, Col, Button, Select, InputNumber } from 'antd';
import { FormInput, Inputs } from 'library';
import { FormInputProps } from 'library/type/forminput/';

const Option = Select.Option;

const FormItem = Form.Item;



export type HostIPInputProps = FormInputProps<{ list: string[] }>

@(FormInput.create({}) as any)
class HostIPInput extends PureComponent<HostIPInputProps, any> {
	static readonly defaultProps: HostIPInputProps = {
		form: {} as any,
		value: [] as any
	}
	state = {
		start_ip: '',
		ip_number: 1,
		list: [],
	}
	setIps = () => {
		const { value, form } = this.props;
		const { start_ip, ip_number } = this.state;
		let list = [start_ip], select_list = value!.list || [];
		for (let i = 1; i < Number(ip_number); i++) {
			let items: any[] = start_ip.split('.');
			items = items.map(item => parseInt(item));
			items[3] += i;
			if (items[3] >= 255) {
				items[3] = items[3] - 254;
				items[2] += 1;
				if (items[2] > 255) {
					items[2] = 0;
					items[1] += 1;
					if (items[1] > 255) {
						items[1] = 0;
						items[0] += 1;
					}
				}
			}
			list.push(items.join('.'));
		}
		for (let i = 0; i < list.length; i++) {
			select_list.indexOf(list[i]) == -1 && select_list.push(list[i]);
		}
		this.setState({ list: select_list })
		form.setFieldsValue({ list: select_list })
	}
	render() {
		const { form } = this.props;
		const { start_ip, ip_number, list } = this.state;
		const { getFieldDecorator } = form;
		return (
			<Row gutter={16}>
				<Col>填写起始IP地址和连续接入的节点数，以批量设置IP地址</Col>
				<Col span={12}>
					<Inputs.IP
						value={start_ip}
						placeholder="节点IP起始地址"
						onChange={(v: any) => this.setState({ start_ip: v.target.value })}
					/>
				</Col>
				<Col span={6}>
					<InputNumber
						style={{ width: '100%' }}
						placeholder="IP数量"
						value={ip_number}
						onChange={(v: any) => this.setState({ ip_number: v })}
					/>
				</Col>
				<Col span={6}>
					<Button style={{ width: '100%' }} disabled={!start_ip} onClick={this.setIps}>追加</Button>
				</Col>
				<Col span={24}>
					<FormItem>
						{getFieldDecorator('list', {
							rules: [{ required: true, message: '至少选择一个主机IP!' }],
						})(
							<Select
								allowClear
								placeholder="请先添加IP地址/范围"
								mode="multiple"
								style={{ width: '100%' }}
								onChange={(v) => {
									this.setState({
										select_iplist: v,
									})
								}}
							>
								{list.map(ip => {
									return <Option key={ip}>{ip}</Option>
								})}
							</Select>
						)}
					</FormItem>
				</Col>
			</Row>
		)
	}
}

export default HostIPInput;
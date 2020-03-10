import {PureComponent} from 'react';
import {Form, Row, Col, Select, InputNumber} from 'antd';
import {FormInput} from 'library';
import {FormInputProps} from 'library/type/forminput/';
import {Port} from 'api/type/app/';

const Option = Select.Option;
const FormItem = Form.Item;

export type PortInputProps = FormInputProps<Port>;

@(FormInput.create({name: 'port'}) as any)
class PortInput extends PureComponent<PortInputProps, any> {
  static readonly defaultProps = {
    form: {} as any,
    value: {
      protocol: 'TCP',
      servicePort: undefined,
      containerPort: undefined,
    } as any,
  };

  render() {
    const {value, form} = this.props;
    const {protocol, node_port, target_port, port} = value!;
    const {getFieldDecorator} = form;
    return (
      <Row gutter={8}>
        <Col span={7}>
          <FormItem>
            {getFieldDecorator('protocol', {
              initialValue: protocol,
              rules: [{required: true}],
            })(
              <Select placeholder="选择协议" style={{width: '100%'}}>
                <Option value="TCP">TCP</Option>
                <Option value="UDP">UDP</Option>
                {/* <Option value="SCTP">SCTP</Option> */}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem>
            {getFieldDecorator('target_port', {
              initialValue: target_port,
              rules: [{required: true, message: '容器端口必填'}],
            })(
              <InputNumber
                placeholder="容器监听端口"
                min={1}
                max={65535}
                style={{width: '100%'}}
              />
            )}
          </FormItem>
        </Col>
        <Col span={1}>
          <p className="ant-form-split">:</p>
        </Col>
        <Col span={8}>
          <FormItem>
            {getFieldDecorator('port', {
              initialValue: port,
              rules: [{required: true, message: '服务端口必填'}],
            })(
              <InputNumber
                placeholder="服务端口，建议与容器端口一致"
                min={1}
                max={65535}
                style={{width: '100%'}}
              />
            )}
          </FormItem>
        </Col>
      </Row>
    );
  }
}

export default PortInput;

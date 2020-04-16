import * as React from 'react';
import {Form, Select, Input, InputNumber} from 'antd';
import {WrappedFormUtils} from 'antd/lib/form/Form';
import {NlbPortType} from 'api/type/app';

const FormItem = Form.Item;

export interface RuleInputProps {
  value: NlbPortType;
  onChange: (value: NlbPortType) => void;
  form: WrappedFormUtils;
}

@(Form.create({name: 'rule'}) as any)
class RuleInput extends React.PureComponent<RuleInputProps, any> {
  static readonly defaultProps = {
    form: {} as WrappedFormUtils
  };

  state = {
    servicePorts: []
  };

  render() {
    const {value, form} = this.props;
    const {protocol = 'TCP', port, target_port} = value!;
    const {getFieldDecorator, getFieldValue} = form;
    const {servicePorts} = this.state;
    const labelCol = {xs: 24, md: 5},
      wrapperCol = {xs: 24, md: 19};
    return (
      <>
        <FormItem {...{labelCol, wrapperCol}} label="协议">
          {getFieldDecorator('protocol', {
            initialValue: protocol,
            rules: [{required: true, message: '必须选择协议'}]
          })(
            <Select style={{width: '100%'}}>
              <Select.Option value="TCP">TCP</Select.Option>
              <Select.Option value="UDP">UDP</Select.Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...{labelCol, wrapperCol}} label="目标端口">
          {getFieldDecorator('target_port', {
            initialValue: target_port,
            rules: [{required: true, type: 'number', message: '必须是数字'}]
          })(
            <InputNumber
              style={{width: '100%'}}
              min={1}
              max={65535}
              placeholder="请输入目标端口"
            />
          )}
        </FormItem>
        <FormItem {...{labelCol, wrapperCol}} label="导出端口">
          {getFieldDecorator('port', {
            initialValue: port,
            rules: [{required: true, type: 'number', message: '必须是数字'}]
          })(
            <InputNumber
              style={{width: '100%'}}
              min={1}
              max={65535}
              placeholder="请输入导出端口"
            />
          )}
        </FormItem>
      </>
    );
  }
}

export default RuleInput;

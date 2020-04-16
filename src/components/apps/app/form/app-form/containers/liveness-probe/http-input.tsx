import * as React from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import { FormInput } from 'library';
import { FormInputProps } from 'library/type/forminput/';
import PortInput from './port-input';

const FormItem = Form.Item;

export interface HttpInputProps extends FormInputProps<{ scheme: string, host: string, port: number, path: string }> {
  labelCol: any
  wrapperCol: any
}

@(FormInput.create({ name: 'http' }) as any)
class HttpInput extends React.PureComponent<HttpInputProps, any> {
  static readonly defaultProps = {
    form: {} as any,
    value: {},
    onChange: () => null,
  }

  render() {
    const { value, form, labelCol, wrapperCol } = this.props;
    const { scheme = "HTTP", host, port, path } = value!;
    const { getFieldDecorator } = form;
    return (
      <React.Fragment>
        <FormItem
          {...{ labelCol, wrapperCol }}
          label="协议"
        >
          {getFieldDecorator('scheme', {
            initialValue: scheme.toLocaleUpperCase(),
          })(
            <Select style={{ width: '100%' }}>
              <Select.Option value="HTTP">HTTP</Select.Option>
              <Select.Option value="HTTPS">HTTPS</Select.Option>
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={labelCol} wrapperCol={wrapperCol} label="访问域名">
          {getFieldDecorator('host', {
            initialValue: host,
            rules: [{
              validator: (rule, value, callback) => {
                if (!`${host}${port}${value}`) {
                  callback('域、端口、路径选一项')
                }
                callback()
              }
            }],
          })(
            <Input placeholder="访问域名" />
          )}
        </FormItem>
        <FormItem labelCol={labelCol} wrapperCol={wrapperCol} label="监听端口">
          {getFieldDecorator('port', {
            initialValue: port,
            rules: [{ required: true, message: '监听端口不能为空！' }],
          })(
            <InputNumber
              style={{ width: 180 }}
              placeholder="监听端口"
              min={1}
              max={65535}
              step={1}
            />
          )}
        </FormItem>
        <FormItem labelCol={labelCol} wrapperCol={wrapperCol} label="监听路径">
          {getFieldDecorator('path', {
            initialValue: path,
            rules: [{
              validator: (rule, value, callback) => {
                if (!`${host}${port}${value}`) {
                  callback('域、端口、路径选一项')
                }
                callback()
              }
            }],
          })(
            <Input placeholder="路径，必须以‘/’开头" />
          )}
        </FormItem>
      </React.Fragment>
    )
  }
}

export default HttpInput;

import * as React from 'react';
import { Form, Input } from 'antd';
import { FormInput, Inputs } from 'library';

const FormItem = Form.Item;

export type TLS = {
  "key": string
  "crt": string
}


@(FormInput.create({ name: 'tls' }) as any)
class TLSInput extends React.PureComponent<any, any> {
  static readonly defaultProps = {
    form: {} as any,
  }

  render() {
    const { value = {} as TLS, form } = this.props;
    const { getFieldDecorator } = form;
    const { key, crt } = value;
    return (
      <>
        <FormItem
          label="TLS(.key)"
        >
          {getFieldDecorator("key", {
            initialValue: key,
            rules: [
              { required: true, message: 'tls(.key)文件必须选择' },
            ],
          })(
            <Inputs.File placeholder='请选择tls(.key)文件' rows={6} />
          )}
        </FormItem>
        <FormItem
          label="TLS(.crt)"
        >
          {getFieldDecorator("crt", {
            initialValue: crt,
            rules: [
              { required: true, message: 'tls(.crt)文件必须选择' },
            ]
          })(
            <Inputs.File placeholder='请选择tls(.crt)文件' rows={6} />
          )}
        </FormItem>
      </>
    )
  }
}

export default TLSInput;
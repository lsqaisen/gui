import * as React from 'react';
import { FormInput } from 'library';
import { IPrivilege } from '@/models/uesr/privileges';
import { Checkbox, Input, Form } from 'antd';

@(FormInput.create({
  onValuesChange: ({ onChange }, _, allValues) => {
    onChange(allValues)
  }
}) as any)
export default class extends React.PureComponent<any, any>{
  static readonly defaultProps = {
    form: {},
    value: {} as IPrivilege,
    onChange: () => null,
  };

  render() {
    const { value, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <>
        <Form.Item style={{ display: 'none' }}>
          {getFieldDecorator('module', {
            initialValue: value.module,
            rules: [],
          })(
            <Input />
          )}
        </Form.Item>
        <FormInput>
          {getFieldDecorator('modes', {
            initialValue: value.modes,
            rules: [],
          })(
            <Checkbox.Group
              options={
                [
                  { label: '查看', value: 'r' },
                  { label: '创建', value: 'c' },
                  { label: '更新', value: 'u' },
                  { label: '删除', value: 'd' },
                ]}
            />
          )}
        </FormInput>
      </>
    )
  }
}
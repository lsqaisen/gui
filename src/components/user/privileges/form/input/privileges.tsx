import * as React from 'react';
import { FormInput } from 'library';
import { IPrivilege } from '@/models/uesr/privileges';
import { Descriptions } from 'antd';
import { modules } from '../../index';
import Privilege from './privilege';

@(FormInput.create({
  onValuesChange: ({ onChange }, _, allValues) => {
    onChange(Object.values(allValues))
  }
}) as any)
export default class extends React.PureComponent<any, any>{
  static readonly defaultProps = {
    form: {},
    value: Object.keys(modules).map(module => ({ module, modes: ['c', 'r', 'u', 'd'] } as IPrivilege)),
    onChange: () => null,
  };

  render() {
    const { value, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Descriptions>
        {Object.keys(modules).map((key: string) => {
          const v = (value as IPrivilege[]).find(p => p.module === key) || { module: key, modes: [] };
          return (
            <Descriptions.Item span={3} label={modules[key]}>
              <FormInput>
                {getFieldDecorator(key, {
                  initialValue: v,
                  rules: [],
                })(
                  <Privilege />
                )}
              </FormInput>
            </Descriptions.Item>
          )
        })}
      </Descriptions>
    )
  }
}
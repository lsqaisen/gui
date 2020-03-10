import * as React from 'react';
import { ArrayInput, FormInput } from 'library';
import EnvInput from './env-input';
import { Env } from 'api/type/app';

@(FormInput.create({
  onValuesChange: ({ onChange }, _, allValues) => {
    onChange(allValues['envs-input'])
  }
}) as any)
export default class extends React.PureComponent<any, any>{
  static readonly defaultProps = {
    form: {},
    value: [],
    onChange: () => null,
  };

  render() {
    const { value, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <FormInput>
        {getFieldDecorator('envs-input', {
          initialValue: value,
          rules: [],
        })(
          <ArrayInput<Env>
            others={value || []}
            input={EnvInput}
            btnText="添加环境变量"
          />
        )}
      </FormInput>
    )
  }
}
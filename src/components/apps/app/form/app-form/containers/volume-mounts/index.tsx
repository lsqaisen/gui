import * as React from 'react';
import { ArrayInput, FormInput } from 'library';
import VolumeMountInput from './volume-mount-input';
import { VolumeMount } from 'api/type/app'

@(FormInput.create({
  onValuesChange: ({ onChange }, _, allValues) => {
    onChange(allValues['volumemounts-input'])
  }
}) as any)
export default class extends React.PureComponent<any, any>{
  static readonly defaultProps = {
    form: {},
    value: [],
    onChange: () => null,
  };

  render() {
    const { value, volumes, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <FormInput>
        {getFieldDecorator('volumemounts-input', {
          initialValue: value,
          rules: [],
        })(
          <ArrayInput<VolumeMount>
            others={value || []}
            input={VolumeMountInput}
            inputProps={{ volumes }}
            btnText="添加挂载点"
          />
        )}
      </FormInput>
    )
  }
}
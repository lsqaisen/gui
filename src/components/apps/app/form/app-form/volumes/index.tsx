import * as React from 'react';
import { ArrayInput, FormInput } from 'library';
import VolumeInput from './volume-input';
import { Volume } from 'api/type/app/';

@(FormInput.create({
  onValuesChange: ({ onChange }, _, allValues) => {
    onChange(allValues['volumes-input'])
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
        {getFieldDecorator('volumes-input', {
          initialValue: value,
          rules: [],
        })(
          <ArrayInput<Volume>
            others={value || []}
            input={VolumeInput}
            btnText="添加数据卷"
          />
        )}
      </FormInput>
    )
  }
}
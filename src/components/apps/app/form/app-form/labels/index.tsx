import * as React from 'react';
import { ArrayInput, FormInput } from 'library';
import LabelInput, { Label } from './label-input';

@(FormInput.create({
  onValuesChange: ({ onChange }, _, allValues) => {
    onChange(allValues['labels-input'])
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
        {getFieldDecorator('labels-input', {
          initialValue: value,
          rules: [],
        })(
          <ArrayInput<Label>
            others={value || []}
            input={LabelInput}
            btnText="添加标签"
          />
        )}
      </FormInput>
    )
  }
}
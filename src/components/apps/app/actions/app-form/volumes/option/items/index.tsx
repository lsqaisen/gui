import * as React from 'react';
import { ArrayInput, FormInput } from 'library';
import Item from './item';
import { VolumeItem } from 'api/type/app/';

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
    const { value, itemsData, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <FormInput>
        {getFieldDecorator('labels-input', {
          initialValue: value,
          rules: [],
        })(
          <ArrayInput<VolumeItem>
            others={value || []}
            input={Item}
            btnText="添加Item"
            inputProps={{ itemsData }}
          />
        )}
      </FormInput>
    )
  }
}
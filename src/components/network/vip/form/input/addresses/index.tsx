import { PureComponent } from 'react';
import { ArrayInput, FormInput } from 'library';
import AddressInput from './address';

@(FormInput.create({
  onValuesChange: ({ onChange }, _, allValues) => {
    onChange(allValues['addresses-input'])
  }
}) as any)
export default class extends PureComponent<any, any>{
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
        {getFieldDecorator('addresses-input', {
          initialValue: value,
          rules: [],
        })(
          <ArrayInput<string>
            actionTypes={['add', 'load']}
            others={value || []}
            input={AddressInput}
            btnText="添加网段"
          />
        )}
      </FormInput>
    )
  }
}
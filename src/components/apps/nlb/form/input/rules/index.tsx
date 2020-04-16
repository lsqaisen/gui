import * as React from 'react';
import {ArrayInput, FormInput} from 'library';
import RuleInput from './rule-form';
import {NlbPortType} from 'api/type/app';

@(FormInput.create({
  onValuesChange: ({onChange}, _, allValues) => {
    onChange(
      allValues['ports-input'].map((v: NlbPortType) => ({
        ...v,
        target_port: Number(v.target_port) || undefined,
        port: Number(v.port) || undefined
      }))
    );
  }
}) as any)
export default class extends React.PureComponent<any, any> {
  static readonly defaultProps = {
    form: {},
    value: [],
    onChange: () => null
  };

  render() {
    const {value, form} = this.props;
    const {getFieldDecorator} = form;
    console.log(value);
    return (
      <FormInput>
        {getFieldDecorator('ports-input', {
          initialValue: value,
          rules: []
        })(
          <ArrayInput<NlbPortType>
            disabledRemoveLastOne
            others={value || []}
            input={RuleInput}
            btnText="添加规则"
          />
        )}
      </FormInput>
    );
  }
}

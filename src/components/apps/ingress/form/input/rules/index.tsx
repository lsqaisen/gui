import * as React from 'react';
import {ArrayInput, FormInput} from 'library';
import RuleInput from './rule-form';
import {IngressRuleType} from 'api/type/app';

@(FormInput.create({
  onValuesChange: ({onChange}, _, allValues) => {
    onChange(
      allValues['rules-input'].map((v: IngressRuleType) => ({
        ...v,
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
    const {value, https, form} = this.props;
    const {getFieldDecorator} = form;
    return (
      <FormInput>
        {getFieldDecorator('rules-input', {
          initialValue: value,
          rules: []
        })(
          <ArrayInput<IngressRuleType>
            disabledRemoveLastOne
            others={value || []}
            input={RuleInput}
            inputProps={{https}}
            btnText="添加规则"
          />
        )}
      </FormInput>
    );
  }
}

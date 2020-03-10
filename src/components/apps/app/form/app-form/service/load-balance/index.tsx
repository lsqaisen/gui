import * as React from 'react';
import { Form, Radio } from 'antd';
import { FormInput } from 'library';
import { FormInputProps } from 'library/type/forminput/';
import { LoadBalance } from 'api/type/app/';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

export interface LoadBalanceInputProps extends FormInputProps<LoadBalance> { }

@(FormInput.create({ name: 'load-balance-input' }) as any)
class LoadBalanceInput extends React.PureComponent<LoadBalanceInputProps, any> {
  static readonly defaultProps = {
    value: {},
    form: {} as any,
  }

  render() {
    const { value, form } = this.props;
    const { auto_create } = value || {};
    const { getFieldDecorator } = form;
    return (
      <React.Fragment>
        <FormInput>
          {getFieldDecorator('auto_create', {
            initialValue: auto_create,
            rules: [],
          })(
            <RadioGroup>
              <Radio.Button value={true}>自动创建</Radio.Button>
              <Radio.Button value={false} disabled>使用已有</Radio.Button>
            </RadioGroup>
          )}
        </FormInput>
      </React.Fragment>
    )
  }
}

export default LoadBalanceInput;
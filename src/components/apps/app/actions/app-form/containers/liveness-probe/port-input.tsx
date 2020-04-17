import {PureComponent} from 'react';
import {Form, InputNumber} from 'antd';
import {FormInput} from 'library';
import {FormInputProps} from 'library/type/forminput/';

const FormItem = Form.Item;

export type PortInputProps = FormInputProps<{intVal: number}>;

@(FormInput.create({name: 'exec'}) as any)
class PortInput extends PureComponent<PortInputProps, any> {
  static readonly defaultProps = {
    form: {} as any,
    value: {},
    onChange: () => null
  };

  render() {
    const {value, form} = this.props;
    const {intVal} = value!;
    const {getFieldDecorator} = form;
    return (
      <FormItem>
        {getFieldDecorator('intVal', {
          initialValue: intVal,
          rules: [{required: true, message: '监听端口不能为空！'}]
        })(
          <InputNumber
            style={{width: 180}}
            placeholder="监听端口"
            min={1}
            max={65535}
            step={1}
          />
        )}
      </FormItem>
    );
  }
}

export default PortInput;

import {PureComponent} from 'react';
import {Form, InputNumber} from 'antd';
import {FormInput} from 'library';
import {FormInputProps} from 'library/type/forminput/';
import PortInput from './port-input';
const FormItem = Form.Item;

export type TcpInputProps = FormInputProps<any>;

@(FormInput.create({name: 'tcp'}) as any)
class TcpInput extends PureComponent<TcpInputProps, any> {
  static readonly defaultProps = {
    form: {} as any,
    value: {},
    onChange: () => null
  };

  render() {
    const {value, form} = this.props;
    const {port} = value!;
    const {getFieldDecorator} = form;
    return (
      <FormItem>
        {getFieldDecorator('port', {
          initialValue: port,
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

export default TcpInput;

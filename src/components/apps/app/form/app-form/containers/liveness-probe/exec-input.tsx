import {PureComponent, forwardRef} from 'react';
import {Form, Input} from 'antd';
import {FormInput} from 'library';
import {FormInputProps} from 'library/type/forminput/';
import {TextAreaProps} from 'antd/lib/input';

const FormItem = Form.Item;

export type ExecInputProps = FormInputProps<{command: string[]}>;

const CommandInput = forwardRef(
  ({value = [], onChange = () => null}: TextAreaProps, ref: any) => {
    return (
      <Input.TextArea
        value={((value || []) as any).join('\n')}
        onChange={e => onChange(e.target.value.split('\n') as any)}
      />
    );
  }
);

@(FormInput.create({name: 'exec'}) as any)
class ExecInput extends PureComponent<ExecInputProps, any> {
  static readonly defaultProps = {
    form: {} as any,
    value: {},
    onChange: () => null
  };

  render() {
    const {value, form} = this.props;
    const {command} = value!;
    const {getFieldDecorator} = form;
    return (
      <FormItem>
        {getFieldDecorator('command', {
          initialValue: command,
          validateFirst: true,
          rules: [
            {
              validator: (r, v, c) => {
                if (!v || (Array.isArray(v) && v.length <= 0)) {
                  c('检测命令必须填写');
                }
                c();
              }
            }
          ]
        })(<CommandInput placeholder="检测命令" />)}
      </FormItem>
    );
  }
}

export default ExecInput;

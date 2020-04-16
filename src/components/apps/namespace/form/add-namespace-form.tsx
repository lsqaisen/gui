import {PureComponent} from 'react';
import {Form, Input, Select} from 'antd';
import {FormComponentProps} from 'antd/lib/form';

const Option = Select.Option;
const TextArea = Input.TextArea;
const FormItem = Form.Item;

@(Form.create() as any)
class AddClusterForm extends PureComponent<FormComponentProps & any, any> {
  static readonly defaultProps = {
    formItemLayout: {
      labelCol: {xs: 24, md: 5},
      wrapperCol: {xs: 24, md: 19}
    }
  };
  checkName = (rule: any, value: any, callback: any) => {
    if (!!value) {
      if (value.length > 63) {
        callback('命名空间长度为1~63！');
      } else if (!/^[a-z0-9-]{1,}$/.test(value)) {
        callback(`命名空间由小写字母、数字和字符‘-’组成！`);
      } else if (/^\d/.test(value)) {
        callback(`开始字符不能是数字`);
      } else if (/^[-]/.test(value) || /[-]$/.test(value)) {
        callback('字符‘-’不能为开始和结束字符！');
      }
    }
    callback();
  };

  render() {
    const {ippools = [], formItemLayout, form} = this.props;
    const {getFieldDecorator} = form;
    return (
      <Form>
        <FormItem label="命名空间" required {...formItemLayout}>
          {getFieldDecorator('name', {
            rules: [
              {required: true, message: '命名空间不能为空!'},
              {validator: this.checkName}
            ]
          })(<Input placeholder="命名空间" />)}
        </FormItem>
      </Form>
    );
  }
}

export default AddClusterForm;

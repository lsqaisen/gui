import { PureComponent } from 'react';
import { Form, Input, Typography, Checkbox } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { SearchSelect } from 'library';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

export interface PrivateFromProps {
  formItemLayout?: any;
}

@(Form.create() as any)
class AddPrivateForm extends PureComponent<FormComponentProps & PrivateFromProps, any> {
  static readonly defaultProps = {
    form: {},
    formItemLayout: {
      labelCol: { xs: 24, md: 5 },
      wrapperCol: { xs: 24, md: 19 },
    },
  };

  render() {
    const { formItemLayout, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label="仓库域名">
          {getFieldDecorator('domain', {
            rules: [
              { required: true, message: '仓库域名不能为空!' },
            ],
          })(
            <Input placeholder='请输入工作仓库名称' />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="用户名称">
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '用户名称不能为空!' }],
          })(
            <Input autoComplete="new-password" placeholder='请输入用户名称' />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="用户密码"
        >
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '用户密码不能为空!' }],
          })(
            <Input.Password autoComplete="new-password" placeholder='请输入用户密码' />
          )}
        </FormItem>
      </Form>
    )
  }
}

export default AddPrivateForm;
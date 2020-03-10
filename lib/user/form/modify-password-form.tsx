import { PureComponent } from 'react';
import { Form, Input, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

const FormItem = Form.Item;

export interface ModifyPasswordFormProps {
  username: string;
  formItemLayout?: any;
}

@(Form.create() as any)
class ModifyPasswordForm extends PureComponent<FormComponentProps & ModifyPasswordFormProps, any> {
  static readonly defaultProps = {
    form: {},
    data: {},
    formItemLayout: {
      labelCol: { xs: 24, md: 5 },
      wrapperCol: { xs: 24, md: 19 },
    },
  };


  checkPassword = (_: any, value: any, callback: any) => {
    let pattern1 = /[^\!\@\#\$\%\^\&\*\(\\\)\-\=\_\+\,\.\?\/\:\;\{\}\[\]\~\w]/g;
    let pattern2 = /[a-z]+/;
    let pattern3 = /[A-Z]+/;
    let pattern4 = /[0-9]+/;
    let pattern5 = /[\!\@\#\$\%\^\&\*\(\\\)\-\=\_\+\,\.\?\/\:\;\{\}\[\]\~]+/;
    let count = 0;
    if (pattern2.test(value)) {
      count++;
    }
    if (pattern3.test(value)) {
      count++;
    }
    if (pattern4.test(value)) {
      count++;
    }
    if (pattern5.test(value)) {
      count++;
    }
    if (!value) {
      callback();
    } else if (value.length < 8) {
      callback('必须输入8个以上的字符');
    } else if (pattern1.test(value)) {
      callback('输入的字符不能为!@#$%^&*(\)-_=+,.?/:;{}[]~字母数字之外的');
    } else if (count < 2) {
      callback('输入包含大写，小写字母，数字，字符两种及以上');
    } else {
      callback();
    }
  }

  //检查两次输入密码是否一致
  checkPass = (_: any, value: any, callback: any) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('new')) {
      callback('两次输入的密码不一致');
    } else {
      callback();
    }
  }

  render() {
    const { username, formItemLayout, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label="原密码"
        >
          {getFieldDecorator('current', {
            rules: [{
              required: true, message: '请输入原密码!',
            }],
          })(
            <Input type="password" prefix={<Icon type="lock" />} placeholder="请输入原密码" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="新密码"
        >
          {getFieldDecorator('new', {
            rules: [{
              required: true,
              message: '请输入密码，至少8个字符',
            }, { validator: this.checkPassword }],
          })(
            <Input type="password" prefix={<Icon type="lock" />} placeholder="请输入密码，至少8个字符" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="确认密码"
          hasFeedback
        >
          {getFieldDecorator('cfmpassword', {
            rules: [{
              required: true,
              message: '再次确认新密码',
            }, { validator: this.checkPass }]
          })(
            <Input type="password" prefix={<Icon type="lock" />} placeholder="确认输入密码" />
          )}
        </FormItem>
      </Form>
    )
  }
}

export default ModifyPasswordForm;
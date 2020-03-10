import { PureComponent } from 'react';
import { Form, Input, Typography } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { IUser } from '@/models/uesr/user';
import UpdatePrivlieges from '@/components/user/privileges/update-privlieges';
import { IPrivilege } from '@/models/uesr/privileges';
import { modules } from '../../privileges';

const FormItem = Form.Item;

export interface UserFromProps extends FormComponentProps {
  admin?: boolean;
  edit?: boolean;
  user?: IUser;
  formItemLayout?: any;
}

@(Form.create() as any)
class UserForm extends PureComponent<UserFromProps, any> {
  static readonly defaultProps: UserFromProps = {
    form: new Object(null) as WrappedFormUtils,
    formItemLayout: {
      labelCol: { xs: 24, md: 5 },
      wrapperCol: { xs: 24, md: 19 },
    },
    edit: false,
    user: new Object(null) as IUser,
  };

  checkPassRule(value: any, callback: any, name: any, t: any) {
    let form = this.props.form;
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
    if (value.length < 8) {
      callback('必须输入8个以上的字符');
    } else if (pattern1.test(value)) {
      callback('输入的字符不能为!@#$%^&*(\)-_=+,.?/:;{}[]~字母数字之外的');
    } else if (count < 2) {
      callback('输入包含大写，小写字母，数字，字符两种及以上');
    } else if (!!name && name != value) {
      callback('两次输入的密码不一致');
    } else {
      if (!!name) {
        if (t) {
          form.setFields({
            qr: {
              value,
              errors: '',
            },
          });
        } else {
          form.setFields({
            password: {
              value,
              errors: '',
            },
          });
        }

      }
      callback();
    }
  }

  checkPassword(rule: any, value: any, callback: any, form: any, name: any) {
    if (!!value) {
      this.checkPassRule(value, callback, name, true);
    }
    callback();
  }

  render() {
    const { edit, user, formItemLayout, form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label="Email"
        >
          {getFieldDecorator('email', {
            initialValue: user!.email,
            rules: [
              { required: true, message: 'Email必须填写' },
              { type: 'email', message: 'Email地址不正确' },
              { max: 100, message: '最多100个字符' },
            ],

          })(
            <Input placeholder='请输入Email' disabled={edit} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="名称"
        >
          {getFieldDecorator('username', {
            initialValue: user!.username,
            rules: [{
              required: true, message: '名称不能为空'
            }, {
              max: 20, message: '输入字符不能超过20个'
            }, {
              pattern: /[A-Za-z\d\_]/g, message: "由大小写字母数字和字符'_'组成"
            }],
          })(
            <Input placeholder='请输入名称' disabled={edit} />
          )}
        </FormItem>
        {!edit && <FormItem
          {...formItemLayout}
          label="密码"
          hasFeedback
        >
          {getFieldDecorator('password', {
            initialValue: 'PASS1234',
            rules: [{
              required: true, message: '密码不能为空'
            }, {
              max: 20, message: '密码字符长度不能超过20'
            }, {
              validator: (r: any, v: any, c: any) => {
                const qr = getFieldValue('qr');
                this.checkPassword(r, v, c, form, qr);
              }
            }],
          })(
            <Input type="text" name="pass" placeholder='请输入密码' />
          )}
        </FormItem>}

        <FormItem
          {...formItemLayout}
          label="权限"
        >
          {getFieldDecorator('privileges', {
            initialValue: user!.privileges || Object.keys(modules).map(module => `${module}:curd`).join('|'),
            rules: [],
          })(
            <UpdatePrivlieges btnType="link" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="备注"
        >
          {getFieldDecorator('remark', {
            initialValue: user!.remark,
            rules: [{ max: 30, message: '最多30个字符' },]
          })(
            <Input.TextArea placeholder='请填写备注' />
          )}
        </FormItem>
      </Form>
    )
  }
}

export default UserForm;
import { PureComponent } from 'react';
import { Form, Input, Icon, Button, message, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form'
import { polyfill } from 'react-lifecycles-compat';
import QueueAnim from 'rc-queue-anim';
import { Logo } from 'library';
import NameInput from '../input/name-input';
import { checkPassword } from './checks';
import { loginRequest } from 'api/type/auth';
import styles from './style/index.less';

const FormItem = Form.Item;

export interface LoginFormProps {
  domains: any[];
  loading?: boolean;
  goResetPassword?: () => void;
  changeIsFirstLogin?: (isFirstLogin?: boolean) => void;
  onLogin?: (values: loginRequest) => any;
  modifyPassword?: (values: any) => any;
};

class LoginForm extends PureComponent<LoginFormProps & FormComponentProps, any> {
  state = {
    isFirstLogin: false,
    loginType: 'local',
    old_password: '',
  }

  _onSubmit: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement> = e => {
    e.preventDefault();
    const { form: { validateFields }, onLogin, modifyPassword, changeIsFirstLogin } = this.props;
    const { isFirstLogin, old_password } = this.state;
    validateFields(async (err, values) => {
      if (!err) {
        try {
          if (!isFirstLogin) {
            let code = await onLogin!(values);
            if (code === 203) {
              this.setState({
                isFirstLogin: true,
                old_password: values.password,
              }, () => changeIsFirstLogin!(true))
            }
          } else {
            let data: any = {
              username: values.username,
              old_password: old_password,
              new_password: values.new_password,
            }
            let error = await modifyPassword!(data);
            if (!error) {
              message.success('密码修改成功！')
              await onLogin!({
                username: data.username,
                password: data.new_password,
              } as loginRequest);
            }
          }
        } catch (error) {
        }
      }
    })
  }

  //检查两次输入密码是否一致
  checkPass(rule: any, value: string | undefined | null, callback: Function) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('new_password')) {
      callback('两次输入的密码不一致');
    } else {
      callback();
    }
  }

  render() {
    const { form, domains, loading, changeIsFirstLogin, goResetPassword } = this.props;
    const { getFieldDecorator } = form;
    const { loginType, isFirstLogin } = this.state;
    return (
      <QueueAnim
        delay={600}
        duration={400}
        animConfig={[
          { opacity: [1, 0] },
          { opacity: [1, 0] }
        ]}
      >
        <Form key="login" onSubmit={this._onSubmit as any}>
          <header className={styles.logo}>
            <Logo
              iconSrc={`/dist/oem${process.env.NODE_ENV === "development" ? process.env.OEM_NAME : ''}/icon.png`}
              logoSrc={`/dist/oem${process.env.NODE_ENV === "development" ? process.env.OEM_NAME : ''}/logo.png`}
            />
          </header>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [{
                whitespace: true,
              }, {
                required: true, message: '请输入用户名',
              }, {
                validator: (rule, value, callback) => {
                  if (value && loginType === 'relation') {
                    const [name = undefined, domain = undefined] = (value || '').split('@');
                    if (!name) callback('请输入账户名！');
                    else if (!domain) callback('请选择所属域！');
                  }
                  callback();
                }
              }],
            })(
              <NameInput disabled={isFirstLogin} domains={domains} />
            )}
          </FormItem>
          <QueueAnim
            appear={false}
            style={{ width: '100%', position: 'relative' }}
            duration={400}
            animConfig={[
              { marginTop: ['0', '164px'] },
              { opacity: [1, 0] }
            ]}
          >
            {!isFirstLogin ? (
              <div className={styles.item} key="password">
                <FormItem key="password">
                  {getFieldDecorator('password', {
                    rules: [{
                      required: true,
                      message: '请输入密码',
                    }],
                  })(
                    <Input type="password" prefix={<Icon type="lock" />} placeholder="请输入密码" />
                  )}
                </FormItem>
                <FormItem style={{ marginBottom: '16px' }}>
                  <Button className={styles[`btn`]} type="primary" loading={loading} htmlType="submit">登录</Button>
                </FormItem>
                <footer style={{ lineHeight: '24px' }}>
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    // goResetPassword!()
                    Modal.info({
                      title: '忘记密码',
                      content: '忘记密码，请联系管理员重置密码。'
                    })
                  }} >忘记密码</a>
                </footer>
              </div>
            ) : ([
              <div className={styles.item} key="new_password">
                <FormItem>
                  {getFieldDecorator('new_password', {
                    rules: [{
                      required: true,
                      message: '请输入密码，至少8位，区分大小写',
                    }, { validator: checkPassword }],
                  })(
                    <Input type="password" prefix={<Icon type="lock" />} placeholder="请输入密码，至少8位，区分大小写" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('cfmpassword', {
                    rules: [{
                      required: true,
                      message: '确认输入密码',
                    }, { validator: this.checkPass.bind(this) }]
                  })(
                    <Input type="password" prefix={<Icon type="lock" />} placeholder="确认输入密码" />
                  )}
                </FormItem>
                <FormItem style={{ marginBottom: '16px' }}>
                  <Button style={{ width: '186px' }} type="primary" loading={loading} htmlType="submit">修改密码并登录</Button>
                  <footer style={{ float: "right", lineHeight: '40px' }}>
                    <a href="#" onClick={(e) => {
                      e.preventDefault();
                      changeIsFirstLogin!(false);
                    }} >返回</a>
                  </footer>
                </FormItem>
              </div>
            ])}
          </QueueAnim>
        </Form>
      </QueueAnim>
    )
  }
}

polyfill(LoginForm);

export default Form.create<any>()(LoginForm);
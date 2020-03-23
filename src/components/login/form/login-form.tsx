import * as React from 'react';
import {Form, Input, Button, message, Modal} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import QueueAnim from 'rc-queue-anim';
import {Logo} from 'library';
import {checkPassword} from './checks';
import {loginRequest} from 'api/type/auth';
import styles from './style/index.less';

const Login = ({loading}: any) => {
  const [isFirstLogin, setFirstLogin] = React.useState(false);
  const [loginType, setLoginType] = React.useState('local');
  return (
    <Form key="login">
      <header className={styles.logo}>
        <Logo
          iconSrc={`/dist/oem${
            process.env.NODE_ENV === 'development' ? process.env.OEM_NAME : ''
          }/icon.png`}
          logoSrc={`/dist/oem${
            process.env.NODE_ENV === 'development' ? process.env.OEM_NAME : ''
          }/logo.png`}
        />
      </header>
      <Form.Item
        required
        name="username"
        rules={[
          {whitespace: true},
          {required: true, message: '请输入用户名'},
          {
            validator: (rule, value, callback) => {
              if (value && loginType === 'relation') {
                const [name = undefined, domain = undefined] = (
                  value || ''
                ).split('@');
                if (!name) callback('请输入账户名！');
                else if (!domain) callback('请选择所属域！');
              }
              callback();
            },
          },
        ]}
      >
        <Input disabled={isFirstLogin} prefix={<UserOutlined />} />
      </Form.Item>
      <QueueAnim
        appear={false}
        style={{width: '100%', position: 'relative'}}
        duration={400}
        animConfig={[{marginTop: ['0', '164px']}, {opacity: [1, 0]}]}
      >
        {!isFirstLogin ? (
          <div className={styles.item} key="password">
            <Form.Item
              name="password"
              rules={[{required: true, message: '请输入密码'}]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
              />
            </Form.Item>
            <Form.Item style={{marginBottom: '16px'}}>
              <Button
                className={styles[`btn`]}
                type="primary"
                loading={loading}
                htmlType="submit"
              >
                登录
              </Button>
            </Form.Item>
            <footer style={{lineHeight: '24px'}}>
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  Modal.info({
                    title: '忘记密码',
                    content: '忘记密码，请联系管理员重置密码。',
                  });
                }}
              >
                忘记密码
              </a>
            </footer>
          </div>
        ) : (
          [
            <div className={styles.item} key="new_password">
              <Form.Item
                name="new_password"
                rules={[
                  {required: true, message: '请输入密码，至少8位，区分大小写'},
                  {validator: checkPassword},
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入密码，至少8位，区分大小写"
                />
              </Form.Item>
              <Form.Item
                name="cfmpassword"
                rules={[
                  {required: true, message: '确认输入密码'},
                  // {validator: this.checkPass.bind(this)},
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="确认输入密码"
                />
              </Form.Item>
              <Form.Item style={{marginBottom: '16px'}}>
                <Button
                  style={{width: '186px'}}
                  type="primary"
                  loading={loading}
                  htmlType="submit"
                >
                  修改密码并登录
                </Button>
                <footer style={{float: 'right', lineHeight: '40px'}}>
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      // changeIsFirstLogin!(false);
                    }}
                  >
                    返回
                  </a>
                </footer>
              </Form.Item>
            </div>,
          ]
        )}
      </QueueAnim>
    </Form>
  );
};

export default Login;

import * as React from 'react';
import {Form, Input, Button, message, Modal} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import QueueAnim from 'rc-queue-anim';
import {Logo} from 'library';
import {checkPassword} from './checks';
import {loginRequest} from 'api/type/auth';
import styles from './style/index.less';

export interface LoginFormProps {
  loading: boolean;
  submit: (data: loginRequest) => void;
}

const Login = ({loading, submit}: LoginFormProps) => {
  return (
    <Form key="login" onFinish={values => submit(values as loginRequest)}>
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
        rules={[{whitespace: true}, {required: true, message: '请输入用户名'}]}
      >
        <Input prefix={<UserOutlined />} />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{required: true, message: '请输入密码'}]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
      </Form.Item>
      <Button
        className={styles[`btn`]}
        type="primary"
        loading={loading}
        htmlType="submit"
      >
        登录
      </Button>
      <footer style={{lineHeight: '24px', textAlign: 'right'}}>
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
    </Form>
  );
};

export default Login;

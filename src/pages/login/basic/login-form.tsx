import * as React from 'react';
import {Form, Input, Button, Modal} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {connect} from 'dva';
import {Logo} from 'library';
import {ConnectLoading, Dispatch} from '@/models/connect';

export interface LoginFormProps {
  loading: boolean;
  dispatch: Dispatch<any>;
}

const LoginForm = ({loading, dispatch}: LoginFormProps) => {
  return (
    <Form
      onFinish={(values) => dispatch({type: `auth/login`, payload: values})}
    >
      <header style={{overflow: 'hidden', marginBottom: 24}}>
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
        style={{width: '100%', marginBottom: 16}}
        type="primary"
        loading={loading}
        htmlType="submit"
      >
        登录
      </Button>
      <footer style={{lineHeight: '24px', textAlign: 'right'}}>
        <a
          href="#"
          onClick={(e) => {
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

export type ConnectState = {
  loading: ConnectLoading;
};

export default connect(({loading}: ConnectState) => ({
  loading: loading.effects['auth/login'],
}))(LoginForm);

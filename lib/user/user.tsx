import * as React from 'react';
import { PureComponent, Fragment } from 'react';
import { Avatar, Icon, Typography, Menu } from 'antd';
import ModifyPassword from './modify-password'
import styles from './style/index.less';

const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
type colorType = (typeof colorList)[number];

type UserProps = {
  name: string;
  logout: () => void;
  modifyPassword: (value: any) => any;
}

type UserState = {
  color?: colorType;
}

class User extends PureComponent<UserProps, UserState> {
  static ModifyPassword: typeof ModifyPassword;
  state = {
    color: colorList[parseInt(`${Math.random() * 10}`) % 4]
  }
  UNSAFE_componentWillReceiveProps(nextProps: UserProps) {
    if (nextProps.name !== this.props.name) {
      this.setState({
        color: colorList[parseInt(`${Math.random() * 10}`) % 4],
      });
    }
  }
  render() {
    const { name, logout, modifyPassword } = this.props;
    const { color } = this.state;
    return (
      <div className={`${styles.box}`}>
        <Menu selectedKeys={[]}>
          <Menu.SubMenu title={(
            <Fragment>
              <Avatar className={styles.avatar} style={{ backgroundColor: color }} icon="user" />
              <Typography.Text style={{ marginLeft: 8, verticalAlign: 'middle' }} strong>
                <Typography.Text>{name}</Typography.Text>
              </Typography.Text>
            </Fragment>
          )} >
            <Menu.Item onClick={() => {
              let btn = document.getElementById('modify_password_btn');
              if (btn) (btn as any).click();
            }}>
              <Icon type="lock" />
              <span>修改密码</span>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item onClick={logout}>
              <Icon type="logout" />
              <span>退出</span>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
        <ModifyPassword
          username={name}
          submit={modifyPassword}
          btn={<span id="modify_password_btn" style={{ display: 'none' }} />}
        />
      </div>
    )
  }
}

export default User;
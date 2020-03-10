import * as React from 'react';
import QueueAnim from 'rc-queue-anim';
import Login, { LoginFormProps } from './form/login-form';
import ResetPassword, { ResetPasswordProps } from './form/reset-password-form';
import styles from './style/index.less';

const { PureComponent } = React;

export interface LoginProps extends LoginFormProps, ResetPasswordProps {
  loginLoading?: boolean;
  resetLoading?: boolean;
  // loginProps?: LoginFormProps;
  // resetProps?: ResetPasswordProps;
}

export default class extends PureComponent<LoginProps, any> {
  state = {
    type: '',
    style: {},
    firstLogin: false
  }
  changeIsFirstLogin = (isFirstLogin?: boolean) => {
    this.setState({
      style: !isFirstLogin ? { height: '328px', transition: "height .4s" } : { height: '368px', transition: "height .4s" },
    })
  }
  changeIsResetPassword = (isResetPassword?: boolean) => {
    const { type } = this.state;
    this.setState({
      style: !isResetPassword ? { height: '328px', transition: "height .4s" } : { height: '418px', transition: "height .4s" },
      type: type === "reset" ? "login" : "reset"
    })
  }
  render() {
    const { type, style } = this.state;
    const { loginLoading, resetLoading } = this.props;
    const loginProps: LoginFormProps = {
      loading: loginLoading,
      changeIsFirstLogin: this.changeIsFirstLogin,
      goResetPassword: () => this.changeIsResetPassword(true),
      ...this.props,
    };
    const resetProps: ResetPasswordProps = {
      loading: resetLoading,
      goLogin: () => this.changeIsResetPassword(false),
      ...this.props,
    }
    return (
      <div className={styles.loginBox} >
        <QueueAnim
          duration={1200}
          type="scale"
          ease="easeInOutQuart"
          animConfig={[
            { opacity: [1, 0], padding: ['24px', 0], backgroundColor: ['#fff', '#2D225A'], width: ['300px', 0], height: ['328px', 0], borderRadius: ['24px', '100%'] },
            { opacity: [1, 0], padding: ['24px', 0], backgroundColor: ['#fff', '#2D225A'], width: ['300px', 0], height: ['328px', 0], borderRadius: ['24px', '100%'] }
          ]}>
          <div
            key="a"
            style={{ ...style }}
            className={`${styles.box} ${type === "login" && styles.box_flip_l} ${type === "reset" && styles.box_flip_r}`}
          >
            {type === "" || type === "login" ? (
              <Login {...loginProps} />
            ) : (
                <ResetPassword {...resetProps} />
              )
            }
          </div>
        </QueueAnim>
      </div >
    )
  }
}
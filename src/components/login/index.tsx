import {PureComponent} from 'react';
import QueueAnim from 'rc-queue-anim';
import Login from './form/login-form';
import styles from './style/index.less';

export interface LoginProps {
  loginLoading?: boolean;
  resetLoading?: boolean;
  // loginProps?: LoginFormProps;
  // resetProps?: ResetPasswordProps;
}

export default class extends PureComponent<LoginProps, any> {
  state = {
    type: '',
    style: {},
    firstLogin: false,
  };
  changeIsFirstLogin = (isFirstLogin?: boolean) => {
    this.setState({
      style: !isFirstLogin
        ? {height: '328px', transition: 'height .4s'}
        : {height: '368px', transition: 'height .4s'},
    });
  };
  changeIsResetPassword = (isResetPassword?: boolean) => {
    const {type} = this.state;
    this.setState({
      style: !isResetPassword
        ? {height: '328px', transition: 'height .4s'}
        : {height: '418px', transition: 'height .4s'},
      type: type === 'reset' ? 'login' : 'reset',
    });
  };
  render() {
    const {type, style} = this.state;
    return (
      <div className={styles.loginBox}>
        <div
          className={`${styles.box} ${type === 'login' &&
            styles.box_flip_l} ${type === 'reset' && styles.box_flip_r}`}
        >
          <img
            className={styles.icon}
            key="img"
            src="/dist/oem/icon.png"
            alt=""
          />
          <QueueAnim
            delay={900}
            duration={400}
            animConfig={[{opacity: [1, 0]}, {opacity: [1, 0]}]}
          >
            <Login key="login" />
          </QueueAnim>
        </div>
      </div>
    );
  }
}

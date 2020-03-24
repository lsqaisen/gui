import * as React from 'react';
import QueueAnim from 'rc-queue-anim';
import LoginForm, {LoginFormProps} from './form/login-form';
import styles from './style/index.less';

export interface LoginProps {
  loginProps: LoginFormProps;
}

const Login = ({loginProps}: LoginProps) => {
  return (
    <div className={styles.loginBox}>
      <div className={styles.box}>
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
          <LoginForm key="login" {...loginProps} />
        </QueueAnim>
      </div>
    </div>
  );
};
export default Login;

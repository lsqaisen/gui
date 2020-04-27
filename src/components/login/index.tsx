import * as React from 'react';
import QueueAnim from 'rc-queue-anim';
import styles from './style/index.less';

const Login: React.FC<any> = ({children}) => {
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
          <section key="login"> {children}</section>
        </QueueAnim>
      </div>
    </div>
  );
};

export default Login;

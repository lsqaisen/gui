import * as React from 'react';
import Animate from 'rc-animate';
import styles from './style/index.less';

export type LoadingProps = {
  loading?: boolean;
}

const LoadingBasic = () => (
  <div className={styles.loader}>
    <div className={styles.shadow}></div>
    <div className={styles.box}></div>
  </div>
)

const Loading: React.SFC<LoadingProps> = ({ loading, children }) => {
  return children ? (
    <Animate
      transitionName="fade"
      transitionAppear
    >
      {!loading ? <section style={{ width: "100%", height: "100%" }}>{children}</section> : <LoadingBasic key="1" />}
    </Animate>
  ) : <LoadingBasic />;
}

export default Loading;
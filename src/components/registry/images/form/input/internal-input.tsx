import { PureComponent } from 'react';
import { Typography } from 'antd';
import styles from '../style/index.less';

export interface InternalInputProps {
  username: string;
}

export default class extends PureComponent<InternalInputProps, any> {
  render() {
    const { username } = this.props;
    return (
      <div>
        <div className={styles.item_step}>
          <h3 className={styles.h3}>第一步：登录集群计算节点主机</h3>
          <div className={styles.kubelite_code}>
            <pre>
              <Typography.Paragraph style={{ margin: 0 }} copyable>{`ssh root@<计算节点主机IP>`}</Typography.Paragraph>
            </pre>
          </div>
        </div>
        <div className={styles.item_step}>
          <h3 className={styles.h3}>第二步：设置镜像tag</h3>
          <div className={styles.kubelite_code}>
            <pre>
              <Typography.Paragraph style={{ margin: 0 }} copyable>{`docker tag <镜像名> registry.kubelite.local/<镜像名>`}</Typography.Paragraph>
            </pre>
          </div>
        </div>
        <div className={styles.item_step}>
          <h3 className={styles.h3}>第三步：登录镜像仓库</h3>
          <div className={styles.kubelite_code}>
            <pre>
              <Typography.Paragraph style={{ margin: 0 }} copyable>{`docker login registry.kubelite.local`}</Typography.Paragraph>
            </pre>
          </div>
        </div>
        <div className={styles.item_step}>
          <h3 className={styles.h3}>第四步：提交镜像到仓库</h3>
          <div className={styles.kubelite_code}>
            <pre>
              <Typography.Paragraph style={{ margin: 0 }} copyable>{`docker push registry.kubelite.local/<镜像名>`}</Typography.Paragraph>
            </pre>
          </div>
        </div>
      </div>
    )
  }
}
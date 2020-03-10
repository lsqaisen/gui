import { Col } from 'antd';
import { ColProps } from 'antd/lib/col'
import styles from './style/index.less';

export interface DescriptionProps extends ColProps {
  term: any,
}

export default ({ term, children, ...props }: DescriptionProps) => (
  <Col {...props}>
    <div className={styles.description}>
      <div className={styles.term}>{term}</div>
      <div className={styles.detail}>{children}</div>
    </div>
  </Col>
);
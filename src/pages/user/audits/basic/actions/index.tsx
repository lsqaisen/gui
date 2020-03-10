import * as React from 'react';
import { Menu, Dropdown } from 'antd';
import styles from './style/index.less';

export default ({ onClick }: any) => {
  return (
    <a onClick={() => onClick!('detail')}>详情</a>
  )
}

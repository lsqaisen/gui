import * as React from 'react';
import {Menu, Dropdown} from 'antd';
import styles from './style/index.less';

export default ({disabled, actions, children, ...props}: any) => {
  return (
    <Dropdown
      disabled={disabled}
      trigger={['click']}
      overlayClassName={styles.actions}
      placement="bottomRight"
      overlay={
        <Menu className={styles.menus}>
          {React.cloneElement(actions, props)}
        </Menu>
      }
    >
      {children}
    </Dropdown>
  );
};

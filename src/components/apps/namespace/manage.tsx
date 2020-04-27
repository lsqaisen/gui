import * as React from 'react';
import {Drawer, Button} from 'antd';
import {SettingOutlined} from '@ant-design/icons';

export interface IManage {
  title: React.ReactNode;
}

const Manage: React.FC<IManage> = ({title, children}) => {
  const [visible, setVisible] = React.useState(true);
  return (
    <>
      <Button
        className="fl"
        icon={<SettingOutlined />}
        onClick={() => setVisible(true)}
      />
      <Drawer
        closable={false}
        bodyStyle={{padding: 0, height: 'calc(100% - 66px)', overflow: 'auto'}}
        title={title}
        destroyOnClose
        width={256}
        maskStyle={{backgroundColor: 'transparent'}}
        placement="right"
        visible={visible}
        onClose={() => setVisible(false)}
      >
        {children}
      </Drawer>
    </>
  );
};

export default Manage;

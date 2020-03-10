import { cloneElement, useState } from 'react';
import { Button, Drawer, Typography } from 'antd';
import PrivilegesForm from './form/privileges-form';
import { userRequest } from 'api/type/user';
import { ButtonType } from 'antd/lib/button';
import { stringToPrivileges, privilegesToString } from '@/models/uesr/privileges';

export type PrivilegesProps = {
  value?: string;
  btnType?: ButtonType;
  submit?: (value: userRequest) => void;
  onChange?: (value: string) => void;
}

const Privileges: React.FC<PrivilegesProps> = ({ value = "", btnType = "default", children, onChange }) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Typography.Text copyable ellipsis style={{ float: 'left', width: 'calc(100% - 32px)' }}>{value}</Typography.Text>
      {children ? cloneElement(children as any, {
        onClick: () => setVisible(true)
      }) : <Button type={btnType} onClick={() => setVisible(true)} icon="edit" />}
      <Drawer
        destroyOnClose
        maskClosable={false}
        title="更新权限"
        width={482}
        placement="right"
        onClose={() => setVisible(false)}
        visible={visible}
      >
        <PrivilegesForm
          value={stringToPrivileges(value)}
          onChange={(privileges) => {
            onChange!(privilegesToString(privileges))
          }}
        />
        <div className={"drawer-bottom-actions"} >
          <Button onClick={() => setVisible(false)} type="primary"> 确认 </Button>
        </div>
      </Drawer>
    </>
  )
}

export default Privileges;
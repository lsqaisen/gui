import * as React from 'react';
import { Menu } from 'antd';
import DeleteUser from '@/components/user/user/delete-user';
import { IUser } from '@/models/uesr/user';

interface ActionsProps {
  data?: IUser;
  update?: (name?: string) => void;
  dispatch: React.Dispatch<any>;
  onClick?: (key: string) => void;
}

export default ({ data = {} as IUser, update = () => null, dispatch, onClick, ...props }: ActionsProps) => {
  return (
    <React.Fragment>
      <Menu.Item {...props} onClick={() => onClick!('edit')}>编辑</Menu.Item>
      <DeleteUser
        key="delete"
        {...props}
        data={data}
        btn={<Menu.Item {...props} style={{ color: '#ff5242' }} />}
        onDelete={() => {
          return dispatch({
            type: `users/delete`,
            payload: data
          })
        }}
      >删除</DeleteUser>
    </React.Fragment >
  )
}

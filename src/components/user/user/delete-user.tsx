import * as React from 'react';
import { Modal, Button } from 'antd';
import { IUser } from '@/models/uesr/user';

export interface DeleteProps {
  btn?: React.ReactNode;
  data: IUser;
  onDelete: () => any | PromiseLike<any>;
  callback?: () => void;
}

const DeleteUser: React.FC<DeleteProps> = ({ btn, data, onDelete, callback = () => null, ...props }) => {
  function onClick() {
    Modal.confirm({
      title: `用户${data.username}`,
      content: `是否删除用户${data.username}?`,
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: () => new Promise(async (resolve, reject) => {
        onDelete()
          .then((error: any) => {
            if (!error) {
              callback!();
              resolve();
            } else {
              reject(error);
            }
          })
      }),
    })
  }
  return !btn ? <Button onClick={onClick} >删除</Button> : React.cloneElement(btn as any, { ...props, onClick })
}

export default DeleteUser;
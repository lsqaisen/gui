import * as React from 'react';
import { Modal, Button } from 'antd';

export interface DeleteProps {
  btn?: React.ReactNode;
  label: string;
  onDelete: (label: string) => any | PromiseLike<any>;
  deleteCallback?: () => void;
  [key: string]: any;
}

export default ({ btn, label, onDelete, deleteCallback = () => null, ...props }: DeleteProps) => {
  function onClick() {
    Modal.confirm({
      title: `网络IP池${label}`,
      content: `是否删除网络IP池${label}?`,
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: () => new Promise(async (resolve, reject) => {
        onDelete(label)
          .then((error: any) => {
            if (!error) {
              deleteCallback!();
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
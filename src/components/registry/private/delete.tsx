import * as React from 'react';
import { Modal, Button } from 'antd';

export interface DeleteProps {
  btn?: React.ReactNode;
  data?: any;
  onOk: () => any | PromiseLike<any>;
  deleteCallback?: () => void;
  [key: string]: any;
}

export default ({ btn, data = {}, onOk, deleteCallback = () => null, ...props }: DeleteProps) => {
  function onClick() {
    Modal.confirm({
      title: `私有仓库账户${data.username}`,
      content: `是否删除私有仓库账户${data.username}?`,
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: () => new Promise(async (resolve, reject) => {
        onOk()
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
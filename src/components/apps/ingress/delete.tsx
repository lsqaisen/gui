import * as React from 'react';
import {Modal, Button} from 'antd';
import {IIngress} from '@/models/apps/ingress';

export interface DeleteProps {
  btn?: React.ReactNode;
  data: IIngress;
  onDelete: () => any | PromiseLike<any>;
  deleteCallback?: () => void;
  [key: string]: any;
}

export default ({
  btn,
  data,
  onDelete,
  deleteCallback = () => null,
  ...props
}: DeleteProps) => {
  function onClick() {
    Modal.confirm({
      title: `应用负载均衡${data.name}`,
      content: `是否删除应用负载均衡${data.name}?`,
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: () =>
        new Promise(async (resolve, reject) => {
          onDelete().then((error: any) => {
            if (!error) {
              deleteCallback!();
              resolve();
            } else {
              reject(error);
            }
          });
        })
    });
  }
  return !btn ? (
    <Button onClick={onClick}>删除</Button>
  ) : (
    React.cloneElement(btn as any, {...props, onClick})
  );
};

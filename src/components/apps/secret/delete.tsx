import * as React from 'react';
import {Modal, Button} from 'antd';
import {ISecret} from '@/models/apps/secret';

export interface DeleteProps {
  btn?: React.ReactNode;
  data: ISecret;
  onOk: () => any | PromiseLike<any>;
  callback?: () => void;
  [key: string]: any;
}

export default ({
  btn,
  data,
  onOk,
  callback = () => null,
  ...props
}: DeleteProps) => {
  function onClick() {
    Modal.confirm({
      title: `证书${data.metadata.name}`,
      content: `是否删除证书${data.metadata.name}?`,
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: () =>
        new Promise(async (resolve, reject) => {
          onOk().then((error: any) => {
            if (!error) {
              callback!();
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

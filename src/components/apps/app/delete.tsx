import {cloneElement} from 'react';
import {Modal, Button} from 'antd';
import {IApp} from '@/models/apps/apps';

export interface DeleteProps {
  btn?: React.ReactNode;
  data: IApp;
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
      title: `服务${data.name}`,
      content: `是否删除服务${data.name}?`,
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
    cloneElement(btn as any, {...props, onClick})
  );
};

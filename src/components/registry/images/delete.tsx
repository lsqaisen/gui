import * as React from 'react';
import { Modal, Button } from 'antd';

export interface DeleteProps {
  btn?: React.ReactNode;
  data?: any;
  onOk: () => any | PromiseLike<any>;
  callback?: () => void;
  [key: string]: any;
}

export default ({ btn, data = {}, onOk, callback, ...props }: DeleteProps) => {
  const tagname = !!data.tag ? `标签${data.tag}` : data.name
  function onClick() {
    Modal.confirm({
      title: `镜像${tagname}`,
      content: `是否删除镜像${tagname}?`,
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: () => new Promise(async (resolve, reject) => {
        onOk()
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
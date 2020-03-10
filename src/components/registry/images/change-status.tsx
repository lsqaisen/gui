import * as React from 'react';
import { Modal, Button } from 'antd';
import { ButtonType } from 'antd/lib/button/button';
import { IImage, ITag } from '@/models/registry/images';


enum actionTypes { lock = '锁定', unlock = '解锁', pub = '公开', unpub = '私有', delete = "删除" }
// enum actionTypes { "锁定" = "lock", "解锁" = "unlock", "公开" = "pub", "私有" = "unpub" }


export interface DeleteProps {
  okType?: ButtonType;
  btn?: React.ReactNode;
  actionType: "lock" | "unlock" | "pub" | "unpub" | "delete";
  data: ITag | IImage;
  onOk: () => any | PromiseLike<any>;
  callback?: () => void;
}

const changeStatus: React.FC<DeleteProps> = ({ actionType, btn, data, onOk, callback, okType, ...props }) => {
  const tagname = !!data.tag ? `标签${data.tag}` : data.name
  function onClick() {
    Modal.confirm({
      title: `镜像${tagname}`,
      content: `是否${actionTypes[actionType]}镜像${tagname}?`,
      okText: '是',
      cancelText: '否',
      okType,
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
  return !btn ? <Button onClick={onClick} >{data.is_public ? '公开' : '私有'}</Button> : React.cloneElement(btn as any, { ...props, onClick })
}

export default changeStatus;
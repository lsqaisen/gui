import * as React from 'react';
import {Modal} from 'antd';
import {ModalFuncProps} from 'antd/lib/modal/';

export interface DeleteProps extends ModalFuncProps {
  btn?: React.ReactNode;
  onAction: () => any | PromiseLike<any>;
  deleteCallback?: () => void;
  children: string | React.ReactNode;
}

export default ({
  btn,
  onAction,
  deleteCallback,
  children,
  ...props
}: DeleteProps) => {
  function onClick() {
    Modal.confirm({
      ...props,
      onOk: () =>
        new Promise(async (resolve, reject) => {
          onAction().then((error: any) => {
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
  return React.cloneElement(btn as any, {children, onClick});
};

import {cloneElement, PureComponent} from 'react';
import {Modal, Button, InputNumber, Form} from 'antd';
import {IApp} from '@/models/apps/apps';
import {WrappedFormUtils} from 'antd/lib/form/Form';

export interface DeleteProps {
  btn?: React.ReactNode;
  data: IApp;
  onOk: (replicas: number) => any | PromiseLike<any>;
  callback?: () => void;
  [key: string]: any;
}

const Replicas = Form.create<any>()(
  class extends PureComponent<any, any> {
    render() {
      const {
        value,
        form: {getFieldDecorator}
      } = this.props;
      return (
        <Form.Item>
          {getFieldDecorator('replicas', {
            initialValue: value,
            rules: [{required: true, message: '实例数必须填写'}]
          })(
            <InputNumber
              style={{width: '100%'}}
              placeholder="请输入实例数"
              min={1}
            />
          )}
        </Form.Item>
      );
    }
  }
);

export default ({
  btn,
  data,
  onOk,
  callback = () => null,
  ...props
}: DeleteProps) => {
  let form: WrappedFormUtils;
  function onClick() {
    Modal.confirm({
      title: `修改服务${data.name}实例数`,
      content: (
        <Replicas
          value={data.replicas}
          ref={(ref: any) => ref && (form = ref)}
        />
      ),
      okText: '确认',
      cancelText: '取消',
      onOk: () =>
        new Promise(async (resolve, reject) => {
          if (form) {
            form.validateFields((error, value) => {
              if (!error) {
                onOk(value.replicas).then((error: any) => {
                  if (!error) {
                    callback!();
                    resolve();
                  } else {
                    reject(error);
                  }
                });
              }
            });
          }
        })
    });
  }
  return !btn ? (
    <Button onClick={onClick}>删除</Button>
  ) : (
    cloneElement(btn as any, {...props, onClick})
  );
};

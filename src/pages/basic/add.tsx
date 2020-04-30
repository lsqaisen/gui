import * as React from 'react';
import {Button, Modal, Form, Input} from 'antd';
import {connect} from 'dva';
import {ConnectLoading, Dispatch} from '@/models/connect';

export interface AddNamespaceProps {
  loading: boolean;
  goto: (ns?: string) => void;
  dispatch: Dispatch<any>;
}

const AddNamespace = ({loading, goto, dispatch}: AddNamespaceProps) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = React.useState(false);
  return (
    <>
      <Button
        style={{width: '100%'}}
        type="primary"
        onClick={() => setVisible(true)}
      >
        创建命名空间
      </Button>
      <Modal
        destroyOnClose
        title="创建命名空间"
        width={360}
        visible={visible}
        cancelText="取消"
        okText="提交"
        onCancel={() => setVisible(false)}
        confirmLoading={loading}
        onOk={() => {
          form.validateFields().then(({name}) => {
            dispatch({type: 'namespace/create', payload: name}).then(
              (error: any) => {
                if (!error) {
                  dispatch({type: 'namespace/get'}).then(() => {
                    goto!(name);
                  });
                  setVisible(false);
                }
              }
            );
          });
        }}
      >
        <Form
          form={form}
          name="app-form"
          labelCol={{xs: 24, md: 6}}
          wrapperCol={{xs: 24, md: 18}}
        >
          <Form.Item
            name="name"
            label="命名空间"
            required
            rules={[
              {required: true, message: '命名空间不能为空!'},
              {
                validator: async (_, value) => {
                  if (!!value) {
                    if (value.length > 63) {
                      throw new Error('命名空间长度为1~63！');
                    } else if (!/^[a-z0-9-]{1,}$/.test(value)) {
                      throw new Error(
                        `命名空间由小写字母、数字和字符‘-’组成！`
                      );
                    } else if (/^\d/.test(value)) {
                      throw new Error(`开始字符不能是数字`);
                    } else if (/^[-]/.test(value) || /[-]$/.test(value)) {
                      throw new Error('字符‘-’不能为开始和结束字符！');
                    }
                  }
                },
              },
            ]}
          >
            <Input placeholder="命名空间" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export type ConnectState = {
  loading: ConnectLoading;
};

export default connect(({loading}: ConnectState) => ({
  loading: loading.effects['namespace/create'],
}))(AddNamespace);

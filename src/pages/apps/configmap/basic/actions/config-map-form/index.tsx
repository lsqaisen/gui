import * as React from 'react';
import {Form, Button, Input} from 'antd';
import {ContentInput} from '@/components/apps/configmap/inputs/';

export interface ConfigMapFormProps {
  loading: boolean;
  initialValues?: any;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const AppForm = ({
  loading,
  initialValues,
  onCancel,
  onSubmit,
}: ConfigMapFormProps) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      name="app-form"
      scrollToFirstError
      initialValues={initialValues}
      onFinish={onSubmit}
      labelCol={{xs: 24, md: 4}}
      wrapperCol={{xs: 24, md: 20}}
    >
      <Form.Item
        validateFirst
        name="name"
        label="名称"
        rules={[
          {required: true, message: '名称必须填写！'},
          {max: 64, message: '名称字符长度不能超过64'},
          {
            pattern: /^[a-z0-9-]+$/,
            message: '名称由小写字母、数字和字符‘-’组成！',
          },
          {pattern: /^[a-z]/, message: '开始字符不能是数字或‘-’！'},
          {pattern: /[a-z0-9]$/, message: '结束字符不能是‘-’！'},
        ]}
      >
        <Input type="text" placeholder="配置名称" />
      </Form.Item>
      <Form.Item required name="namespace" label="命名空间">
        <Input disabled />
      </Form.Item>
      <Form.Item validateFirst name="data" label="内容">
        <ContentInput form={form} />
      </Form.Item>
      <div className={'drawer-bottom-actions'}>
        <Button onClick={onCancel} style={{marginRight: 8}}>
          取消
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          提交
        </Button>
      </div>
    </Form>
  );
};

export default AppForm;

import * as React from 'react';
import {
  Row,
  Col,
  Form,
  Button,
  Input,
  Radio,
  InputNumber,
  Typography,
  Checkbox,
} from 'antd';
import {NameInput, LabelsInput} from '@/components/apps/app/inputs/';
import IPPoolInput from './ip-pool-input';
import VolumesInput from './volumes-input';
import ContainersInput from './containers-input/';
// import {ColProps} from 'antd/lib/grid/col';
// import Labels from './labels';
// import Volumes from './volumes';
// import Containers from './containers';
// import Service from './service';
import {INetworkPool} from '@/models/network/pool';
// import {InputProps} from 'antd/lib/input';

export interface AppFormProps {
  initialValues?: any;
  onSubmit: (values: any) => void;
}

const AppForm: React.FC<AppFormProps> = ({
  initialValues,
  onSubmit,
  children,
}) => {
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
      <Form.Item required name="namespace" label="命名空间">
        <Input disabled />
      </Form.Item>
      {/* <Form.Item
        required
        validateFirst
        name="name"
        label="服务名称"
        extra="最长63个字符，只能包含小写字母、数字和字符‘-’，小写字母开头，小写字母或数字结尾."
        rules={[
          {required: true, message: '服务名称必须填写！'},
          {
            validator: (rule, value, callback) => {
              if (value === 'app-') callback('服务名称必须填写！');
              callback();
            },
          },
          {max: 64, message: '最长63个字符'},
          {
            pattern: /^[a-z0-9-]+$/,
            message: '只能包含小写字母、数字和字符‘-’',
          },
          {pattern: /[a-z0-9]$/, message: '小写字母或数字结尾'},
        ]}
      >
        <NameInput placeholder="服务名称" />
      </Form.Item> */}
      {/* <Form.Item name="ip_pool" label="虚拟子网">
        <IPPoolInput />
      </Form.Item> */}
      {/* <Form.Item name="type" label="类型" required>
        <Radio.Group style={{maxWidth: 320}}>
          <Radio value="Deployment">Deployment（可扩展的部署Pod）</Radio>
          <Radio value="DaemonSet">DaemonSet（在每个主机上运行Pod）</Radio>
          <Radio value="StatefulSet">StatefulSet（有状态集的运行Pod）</Radio>
        </Radio.Group>
      </Form.Item> */}
      {/* <Form.Item
        name="labels"
        style={{marginBottom: 0}}
        label="标签"
        extra={`只能包含字母、数字及分隔符("-"、"_"、"."、"/")， 且必须以字母、数字开头和结尾`}
        validateStatus="success"
        help={undefined}
      >
        <LabelsInput form={form} />
      </Form.Item> */}
      <Form.Item
        name="volumes"
        style={{marginBottom: 0}}
        label="数据卷"
        // validateStatus="success"
        // help={undefined}
      >
        <VolumesInput ns={initialValues.namespace} />
      </Form.Item>
      {/* <Form.Item
        required
        name="replicas"
        label="实例数量"
        rules={[{required: true, message: '必须指定实例数量！'}]}
      >
        <InputNumber
          style={{width: 180}}
          min={1}
          max={10000}
          placeholder="实例数量"
        />
      </Form.Item> */}
      <Form.Item
        name="containers"
        style={{marginBottom: 0}}
        label="容器配置"
        // validateStatus="success"
        // help={undefined}
      >
        <ContainersInput ns={initialValues.namespace} form={form} />
      </Form.Item>
      {children}
    </Form>
  );
};

export default AppForm;

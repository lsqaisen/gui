import * as React from 'react';
import {Form, Input, Switch} from 'antd';
import {connect} from 'dva';
import {FormInstance} from 'antd/lib/form';
import {ContainersInput} from '@/components/apps/app/inputs/';
import {ContainersInputProps} from '@/components/apps/app/inputs/containers-input/containers';
import {Dispatch} from '@/models/connect';
import ImageInput from './image-input';
import EnvsInput from './envs-input';

interface ContainersProps extends ContainersInputProps {
  ns: string;
  dispatch: Dispatch<any>;
}

const ArrayString = React.forwardRef(
  ({value = [], onChange, ...props}: any, ref: any) => {
    return (
      <Input.TextArea
        ref={ref}
        {...props}
        value={value.join('\n')}
        onChange={(e) => onChange(e.target.value.split(/\n|\n\r/))}
      />
    );
  }
);

const Containers = ({ns, form, dispatch, ...props}: ContainersProps) => {
  return (
    <ContainersInput form={form} {...props}>
      <ContainersInput.Container>
        <Form.Item
          required
          name="name"
          label="名称"
          extra={`最长63个字符，只能包含小写字母、数字及分隔符("-")，且不能以分隔符开头或结尾`}
          rules={[{required: true, message: '名称必须填写'}]}
        >
          <Input style={{maxWidth: 320}} placeholder="请输入名称" />
        </Form.Item>
        <Form.Item
          style={{marginBottom: 0}}
          required
          name="image"
          label="镜像"
          rules={[{required: true, message: '容器必须指定镜像'}]}
        >
          <ImageInput />
        </Form.Item>
        <Form.Item name="volume_mounts" label="挂载点">
          <ContainersInput.Mounts form={form} />
        </Form.Item>
        <Form.Item name="env" label="环境变量">
          <ContainersInput.Envs form={form}>
            {(field) => <EnvsInput ns={ns} field={field} form={form} />}
          </ContainersInput.Envs>
        </Form.Item>
        <Form.Item name="working_dir" label="工作目录">
          <Input placeholder="容器工作目录" />
        </Form.Item>
        <Form.Item name="command" label="运行命令">
          <ArrayString placeholder="运行命令" />
        </Form.Item>
        <Form.Item name="args" label="运行参数">
          <ArrayString placeholder="运行参数" />
        </Form.Item>
        <Form.Item
          name="privileged"
          label="特权级容器"
          extra="容器开启特权级，将拥有宿主机的root权限"
          valuePropName="checked"
        >
          <Switch checkedChildren="开" unCheckedChildren="关" />
        </Form.Item>
      </ContainersInput.Container>
    </ContainersInput>
  );
};

export default connect(() => ({}))(Containers);

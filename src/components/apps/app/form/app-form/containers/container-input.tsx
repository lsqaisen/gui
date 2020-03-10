import * as React from 'react';
import { Form, Input, Switch } from 'antd';
import { ColProps } from 'antd/lib/grid/col';
import { FormInput } from 'library';
import { FormInputProps } from 'library/type/forminput/';
import { Container, Volume } from 'api/type/app/';
import ImageInput from './image-input';
import VolumeMounts from './volume-mounts';
import Envs from './envs';
import LivenessProbe from './liveness-probe';

const FormItem = Form.Item;
export interface ContainerInputProps extends FormInputProps<Container> {
  labels: string[];
  volumes: Volume[];
  others: Container[];
  labelCol?: ColProps;
  wrapperCol?: ColProps;
}

type StateProps = {
  type: 'conf' | 'host' | 'secret'
}

const ArrayString = React.forwardRef(({ value = [], onChange, ...props }: any, ref: any) => {
  return (
    <Input.TextArea ref={ref} {...props} value={value.join('\n')} onChange={(e) => onChange(e.target.value.split(/\n|\n\r/))} />
  )
})

@(FormInput.create({ name: 'container' }) as any)
class ContainerInput extends React.PureComponent<ContainerInputProps, StateProps> {
  static readonly defaultProps = {
    value: {} as Container,
    form: {} as any,
    labelCol: { xs: 24, md: 4 },
    wrapperCol: { xs: 24, md: 20 },
  }


  render() {
    const { value, volumes, labels, labelCol, wrapperCol, form } = this.props;
    const { name, image, working_dir, privileged, args, command, env, liveness_probe, volume_mounts, resources } = value!;
    const { getFieldDecorator } = form;
    return (
      <>
        {labels.includes('name') && <FormItem
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          label="名称"
          extra={`最长63个字符，只能包含小写字母、数字及分隔符("-")，且不能以分隔符开头或结尾`}
          required>
          {getFieldDecorator('name', {
            initialValue: name,
            rules: [
              { required: true, message: '名称必须填写' },
            ],
          })(
            <Input disabled={labels.length <= 3} style={{ maxWidth: 320 }} placeholder='请输入名称' />
          )}
        </FormItem>}
        {labels.includes('image') && <FormInput
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          label="镜像"
          required>
          {getFieldDecorator('image', {
            initialValue: image,
            rules: []
          })(
            <ImageInput />
          )}
        </FormInput>}
        {labels.includes('volume_mounts') && <FormItem
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          label="挂载点"
          validateStatus=""
          help=""
        >
          {getFieldDecorator('volume_mounts', {
            initialValue: volume_mounts,
            rules: []
          })(
            <VolumeMounts volumes={volumes} />
          )}
        </FormItem>}
        {labels.includes('env') && <FormItem
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          label="环境变量"
          validateStatus=""
          help=""
        >
          {getFieldDecorator('env', {
            initialValue: env,
            rules: []
          })(
            <Envs />
          )}
        </FormItem>}
        {labels.includes('working_dir') && <FormItem
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          label="工作目录"
        >
          {getFieldDecorator('working_dir', {
            initialValue: working_dir,
          })(
            <Input />
          )}
        </FormItem>}
        {labels.includes('command') && <FormItem
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          label="运行命令"
        >
          {getFieldDecorator('command', {
            initialValue: command,
          })(
            <ArrayString />
          )}
        </FormItem>}
        {labels.includes('args') && <FormItem
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          label="运行参数"
        >
          {getFieldDecorator('args', {
            initialValue: args,
          })(
            <ArrayString />
          )}
        </FormItem>}
        {labels.includes('liveness_probe') && <FormInput
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          label="容器健康检查"
        >
          {getFieldDecorator('liveness_probe', {
            initialValue: liveness_probe,
            rules: []
          })(
            <LivenessProbe />
          )}
        </FormInput>}
        {labels.includes('privileged') && <FormItem
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          label="特权级容器"
          extra="容器开启特权级，将拥有宿主机的root权限"
        >
          {getFieldDecorator('privileged', {
            initialValue: privileged,
            valuePropName: 'checked'
          })(
            <Switch checkedChildren="开" unCheckedChildren="关" />
          )}
        </FormItem>}
      </>
    )
  }
}

export default ContainerInput;
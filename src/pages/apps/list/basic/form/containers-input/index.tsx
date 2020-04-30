import {Form, Input} from 'antd';
import {connect} from 'dva';
import {ContainersInput} from '@/components/apps/app/inputs/';
import {ContainersInputProps} from '@/components/apps/app/inputs/containers-input/containers';
import {Dispatch} from '@/models/connect';
import ImageInput from './image-input';
import {FormInstance} from 'antd/lib/form';

interface ContainersProps extends ContainersInputProps {
  form: FormInstance;
  dispatch: Dispatch<any>;
}

const Containers = ({form, dispatch, ...props}: ContainersProps) => {
  console.log(form);
  return (
    <ContainersInput {...props}>
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
        <Form.Item required name="image" label="镜像">
          <ImageInput />
        </Form.Item>
        <Form.Item required name="image" label="镜像">
          <ContainersInput.Mounts
            form={form}
            volumes={form.getFieldValue('volumes') || []}
          />
        </Form.Item>
      </ContainersInput.Container>
    </ContainersInput>
  );
};

export default connect(() => ({}))(Containers);

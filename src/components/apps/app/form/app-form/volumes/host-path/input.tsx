import { PureComponent } from 'react';
import { Form, Select, Input } from 'antd';
import { HostPath } from 'api/type/app/';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { SelectProps } from 'antd/lib/select';

const Option = Select.Option;
const FormItem = Form.Item;

export interface HostPathInputProps {
  value?: HostPath;
  form: WrappedFormUtils;
  onChange: (value: HostPath) => void;
}


class Type extends PureComponent<SelectProps, any> {
  render() {
    const { value, onChange = () => null, ...props } = this.props;
    return (
      <Select {...props} value={value || "NoChecks"} style={{ width: '100%' }} placeholder="请选择检查类型" onChange={(value: any, option: any) => onChange(value === "NoChecks" ? "" : value, option)}>
        {["NoChecks", "BlockDevice", "CharDevice", "Directory", "DirectoryOrCreate", "File", "FileOrCreate", "Socket"].map(v => <Option key={v}>{v}</Option>)}
      </Select>
    )
  }
}

const HostPathInput = ({ value = {} as HostPath, form: { getFieldDecorator } }: HostPathInputProps) => {
  const labelCol = { xs: 24, md: 5 };
  const wrapperCol = { xs: 24, md: 19 };
  const { path, type = "" } = value;
  return (
    <>
      <FormItem
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        label="主机路径"
        required>
        {getFieldDecorator('path', {
          initialValue: path,
          rules: [
            { required: true, message: '主机路径必须填写' },
          ],
        })(
          <Input placeholder='请输入主机路径' />
        )}
      </FormItem>
      <FormItem
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        label="检查类型"
        required>
        {getFieldDecorator('type', {
          initialValue: type,
          rules: [],
        })(
          <Type />
        )}
      </FormItem>
    </>
  )
}

export default HostPathInput;
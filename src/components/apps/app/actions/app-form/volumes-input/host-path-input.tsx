import * as React from 'react';
import {Form, Button, Drawer, Input, Select} from 'antd';
import {SelectProps} from 'antd/lib/select';

export type HostPathInputProps = {
  value?: any;
  onChange?: (value: any) => void;
  [key: string]: any;
};

const Type = ({value, onChange = () => {}, ...props}: SelectProps<any>) => {
  return (
    <Select
      {...props}
      value={value || 'NoChecks'}
      style={{width: '100%'}}
      placeholder="请选择检查类型"
      onChange={(value: any, option: any) =>
        onChange(value === 'NoChecks' ? '' : value, option)
      }
    >
      {[
        'NoChecks',
        'BlockDevice',
        'CharDevice',
        'Directory',
        'DirectoryOrCreate',
        'File',
        'FileOrCreate',
        'Socket',
      ].map((v) => (
        <Select.Option key={v} value={v}>
          {v}
        </Select.Option>
      ))}
    </Select>
  );
};

const HostPathInput = ({
  value = {},
  onChange = () => {},
}: HostPathInputProps) => {
  const [visible, setVisible] = React.useState(false);
  const [form] = Form.useForm();
  return (
    <>
      <Input
        value={
          value.path ? `${value.path}(${value.type || 'NoChecks'})` : undefined
        }
        placeholder="点击配置"
        onFocus={() => setVisible(true)}
      />
      <Drawer
        destroyOnClose={false}
        bodyStyle={{height: 'calc(100% - 108px)', overflow: 'auto'}}
        title="配置主机路径"
        width={480}
        placement="right"
        onClose={() => setVisible(false)}
        visible={visible}
      >
        <Form
          form={form}
          labelCol={{xs: 24, md: 5}}
          wrapperCol={{xs: 24, md: 19}}
          onFinish={(values) => {
            console.log(values);
            onChange(values);
            setVisible(false);
          }}
        >
          <Form.Item
            required
            name="path"
            label="主机路径"
            rules={[{required: true, message: '主机路径必须填写'}]}
          >
            <Input placeholder="请输入主机路径" />
          </Form.Item>
          <Form.Item required name="type" label="检查类型">
            <Type />
          </Form.Item>
          <div className={'drawer-bottom-actions'}>
            <Button
              onClick={() => {
                setVisible(false);
              }}
              style={{marginRight: 8}}
            >
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </div>
        </Form>
      </Drawer>
    </>
  );
};

export default HostPathInput;

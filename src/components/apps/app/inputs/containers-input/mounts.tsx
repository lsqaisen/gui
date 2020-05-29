import * as React from 'react';
import {Form, Row, Col, Button, Input, Select} from 'antd';
import {MinusOutlined, PlusOutlined} from '@ant-design/icons';
import {FormInstance} from 'antd/lib/form';
import {SelectProps} from 'antd/lib/select';
import {VolumeMount, Volume} from 'api/type/app';

export interface MountsInputProps {
  value?: VolumeMount[];
  form: FormInstance;
}

const ReadOnly = React.forwardRef(
  ({value, onChange = () => null, ...props}: SelectProps<number>, ref: any) => {
    return (
      <Select
        {...props}
        ref={ref}
        defaultValue={value ? 1 : 0}
        onChange={(value: any, options: any) =>
          onChange(!!value as any, options)
        }
      >
        <Select.Option value={0}>读写</Select.Option>
        <Select.Option value={1}>只读</Select.Option>
      </Select>
    );
  }
);

const MountsInput = ({value = [], form}: MountsInputProps) => {
  let volumes: Volume[] = form.getFieldValue('volumes') || [];
  const mounts = value || [];
  return (
    <Form.List name={['mounts']}>
      {(fields, {add, remove}) => {
        let paths: any[] = mounts.map((v: any, i) => {
          if (!v) {
            return undefined;
          } else {
            return v.mount_path;
          }
        });
        return (
          <div>
            {fields.map((field) => {
              let error =
                !!paths[field.name] &&
                paths
                  .filter((_, i) => i !== field.name)
                  .includes(paths[field.name]);
              if (
                !error &&
                form.getFieldError(['mounts', field.name, 'name']).length > 0
              ) {
                form.validateFields([['mounts', field.name, 'name']]);
              }
              return (
                <Row gutter={8} key={field.key}>
                  <Col style={{width: `calc(100% - 32px)`}}>
                    <Row gutter={4}>
                      <Col span={7}>
                        <Form.Item
                          name={[field.name, 'name']}
                          fieldKey={[field.fieldKey, 'name'] as any}
                          rules={[{required: true, message: '必须选择数据卷'}]}
                        >
                          <Select placeholder="选择挂载卷">
                            {volumes
                              .filter((v) => v.name)
                              .map((v) => (
                                <Select.Option key={v.name} value={v.name}>
                                  {v.name}
                                </Select.Option>
                              ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          name={[field.name, 'mount_path']}
                          fieldKey={[field.fieldKey, 'mount_path'] as any}
                          validateStatus={error ? 'error' : undefined}
                          help={error ? '存在相同的挂载路径!' : undefined}
                          rules={[
                            {required: true, message: '必须填写'},
                            {
                              validator: async (_, value) => {
                                paths[field.name] = value;
                                if (
                                  value &&
                                  paths
                                    .filter((_, i) => i !== field.name)
                                    .includes(value)
                                ) {
                                  throw new Error('存在相同的挂载路径!');
                                }
                              },
                            },
                          ]}
                        >
                          <Input placeholder="挂载路径" />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          name={[field.name, 'sub_path']}
                          fieldKey={[field.fieldKey, 'sub_path'] as any}
                        >
                          <Input placeholder="文件名或子路径" />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item
                          name={[field.name, 'read_only']}
                          fieldKey={[field.fieldKey, 'read_only'] as any}
                        >
                          <ReadOnly />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col style={{width: 32}}>
                    <Button
                      type="ghost"
                      shape="circle"
                      onClick={() => remove(field.name)}
                      style={{marginBottom: 24}}
                      icon={<MinusOutlined />}
                    />
                  </Col>
                </Row>
              );
            })}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{width: '100%'}}
              >
                <PlusOutlined /> 添加标签
              </Button>
            </Form.Item>
          </div>
        );
      }}
    </Form.List>
  );
};

export default MountsInput;

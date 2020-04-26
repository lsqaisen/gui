import * as React from 'react';
import {Form, Row, Col, Button, Input, Select} from 'antd';
import {MinusOutlined, PlusOutlined} from '@ant-design/icons';
import {FormInstance} from 'antd/lib/form';
import {Volume} from 'api/type/app/';
import HostPathInput from './host-path-input';
import ItemsInput from './items-input';
import ConfigMapInput from './config-map-input';

export type VolumeType = 'host' | 'conf' | 'secret';

export interface VolumesInputProps {
  value?: Volume[];
  form: FormInstance;
  children: (type: VolumeType) => React.ReactNode;
  onChange?: (value: any) => void;
}

const VolumesInput: React.FC<VolumesInputProps> = ({form, children}) => {
  const [type, setType] = React.useState<VolumeType>('host');
  return (
    <Form.List name={['volumes']}>
      {(fields, {add, remove}) => {
        return (
          <div>
            {fields.map((field) => {
              return (
                <Row gutter={8} key={field.key}>
                  <Col style={{width: `calc(100% - 32px)`}}>
                    <Row gutter={8}>
                      <Col span={6}>
                        <Form.Item>
                          <Select value={type} onChange={setType}>
                            <Select.Option value="host">主机路径</Select.Option>
                            <Select.Option value="conf">
                              ConfigMap
                            </Select.Option>
                            <Select.Option value="secret">Secret</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          name={[field.name, 'name']}
                          fieldKey={[field.fieldKey, 'name'] as any}
                          rules={[{required: true, message: '标签名必须填写'}]}
                        >
                          <Input placeholder="数据卷名称" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        {children(type)}
                        {/* {type === 'host' ? (
                          <Form.Item
                            name={[field.name, 'host_path']}
                            fieldKey={[field.fieldKey, 'host_path'] as any}
                            rules={[
                              {
                                validator: async (_, value) => {
                                  if (!value || !value.path) {
                                    throw new Error('未设置主机路径');
                                  }
                                },
                              },
                            ]}
                          >
                            <HostPathInput />
                          </Form.Item>
                        ) : type === 'conf' ? (
                          <Form.Item
                            name={[field.name, 'config_map']}
                            fieldKey={[field.fieldKey, 'config_map'] as any}
                            rules={[
                              {
                                validator: async (_, value) => {
                                  if (!value || !value.name) {
                                    throw new Error('未设置ConfigMap');
                                  }
                                },
                              },
                            ]}
                          >
                            <ConfigMapInput />
                          </Form.Item>
                        ) : (
                          <Form.Item
                            name={[field.name, 'secret']}
                            fieldKey={[field.fieldKey, 'secret'] as any}
                            rules={[
                              {
                                validator: async (_, value) => {
                                  if (!value || !value.secretName) {
                                    throw new Error('未设置证书');
                                  }
                                },
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        )} */}
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
                <PlusOutlined /> 添加数据卷
              </Button>
            </Form.Item>
          </div>
        );
      }}
    </Form.List>
  );
};

export default class extends React.PureComponent<VolumesInputProps> {
  static HostPathInput: typeof HostPathInput;
  static ItemsInput: typeof ItemsInput;
  static ConfigMapInput: typeof ConfigMapInput;
  render() {
    return <VolumesInput {...this.props} />;
  }
}

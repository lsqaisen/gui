import * as React from 'react';
import {Form, Row, Col, Button, Input, Select} from 'antd';
import {MinusOutlined, PlusOutlined} from '@ant-design/icons';
import {Volume} from 'api/type/app/';

enum ItemName {
  host = 'host_path',
  conf = 'config_map',
  secret = 'secret',
}
export type VolumeType = 'host' | 'conf' | 'secret';

export interface VolumesInputProps {
  value?: Volume[];
  // form: FormInstance;
  children: (type: VolumeType) => React.ReactNode;
}

const VolumesInput: React.FC<VolumesInputProps> = ({value, children}) => {
  const [types, setType] = React.useState<VolumeType[]>(
    (value || []).map((v) => {
      if (!v || !!v.host_path) {
        return 'host';
      } else if (!!v && !!v.config_map) {
        return 'conf';
      } else {
        return 'secret';
      }
    })
  );
  return (
    <Form.List name={['volumes']}>
      {(fields, {add, remove}) => {
        return (
          <div>
            {fields.map((field) => {
              if (!types[field.key]) types[field.key] = 'host';
              return (
                <Row gutter={8} key={field.key}>
                  <Col style={{width: `calc(100% - 32px)`}}>
                    <Row gutter={8}>
                      <Col span={6}>
                        <Form.Item>
                          <Select
                            value={types[field.key]}
                            onChange={(type) => {
                              let _types: VolumeType[] = ([] as any).concat(
                                types
                              );
                              _types[field.key] = type;
                              setType(_types);
                            }}
                          >
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
                        <Form.Item
                          key={types[field.key]}
                          name={[field.name, ItemName[types[field.key]]]}
                          fieldKey={
                            [field.fieldKey, ItemName[types[field.key]]] as any
                          }
                          rules={[
                            {
                              validator: async (_, value) => {
                                switch (types[field.key]) {
                                  case 'secret':
                                    if (!value || !value.secretName) {
                                      throw new Error('未设置证书');
                                    }
                                    break;
                                  case 'conf':
                                    if (!value || !value.name) {
                                      throw new Error('未设置ConfigMap');
                                    }
                                    break;
                                  case 'host':
                                  default:
                                    if (!value || !value.path) {
                                      throw new Error('未设置主机路径');
                                    }
                                    break;
                                }
                              },
                            },
                          ]}
                        >
                          {children(types[field.key])}
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
                <PlusOutlined /> 添加数据卷
              </Button>
            </Form.Item>
          </div>
        );
      }}
    </Form.List>
  );
};

export default VolumesInput;

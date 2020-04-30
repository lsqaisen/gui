import * as React from 'react';
import {Form, Row, Col, Button, Input, InputNumber, Select} from 'antd';
import {MinusOutlined, PlusOutlined} from '@ant-design/icons';
import {FormInstance} from 'antd/lib/form';
import {Volume} from 'api/type/app/';

export interface ItemsInputProps {
  value?: Volume[];
  itemsData?: any[];
  form: FormInstance;
}

const ItemsInput = ({value = [], itemsData = [], form}: ItemsInputProps) => {
  const items = value || [];
  return (
    <Form.List name={['items']}>
      {(fields, {add, remove}) => {
        let keys: any[] = items.map((v: any, i) => {
          if (!v) {
            return undefined;
          } else {
            return v.key;
          }
        });
        return (
          <div>
            {fields.map((field) => {
              let error =
                !!keys[field.name] &&
                keys
                  .filter((_, i) => i !== field.name)
                  .includes(keys[field.name]);
              if (
                !error &&
                form.getFieldError(['items', field.name, 'key']).length > 0
              ) {
                form.validateFields([['items', field.name, 'key']]);
              }
              return (
                <Row gutter={8} key={field.key}>
                  <Col style={{width: `calc(100% - 32px)`}}>
                    <Row gutter={8}>
                      <Col span={8}>
                        <Form.Item
                          name={[field.name, 'key']}
                          fieldKey={[field.fieldKey, 'key'] as any}
                          validateStatus={error ? 'error' : undefined}
                          help={error ? '存在相同的选项名称!' : undefined}
                          rules={[
                            {required: true, message: '必须选择选项称'},
                            {
                              validator: async (_, value) => {
                                keys[field.name] = value;
                                if (
                                  value &&
                                  keys
                                    .filter((_, i) => i !== field.name)
                                    .includes(value)
                                ) {
                                  throw new Error('存在相同的选项名称!');
                                }
                              },
                            },
                          ]}
                        >
                          <Select style={{width: '100%'}} placeholder="">
                            {itemsData.map((v) => (
                              <Select.Option key={v} value={v}>
                                {v}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name={[field.name, 'path']}
                          fieldKey={[field.fieldKey, 'path'] as any}
                          rules={[{required: true, message: '子路径必须填写'}]}
                        >
                          <Input placeholder="子路径" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name={[field.name, 'mode']}
                          fieldKey={[field.fieldKey, 'mode'] as any}
                          rules={[
                            {required: true, message: '权限必须填写'},
                            {
                              validator: async (_, value) => {
                                const v = Number(`0o${value}`);
                                if (Number.isNaN(v)) {
                                  throw new Error(`应是8进制数`);
                                } else if (v < 0 || v > 0o777) {
                                  throw new Error(`范围为0～777`);
                                }
                              },
                            },
                          ]}
                        >
                          <InputNumber
                            placeholder="请输入权限"
                            min={0}
                            max={777}
                          />
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
                <PlusOutlined /> 添加Item
              </Button>
            </Form.Item>
          </div>
        );
      }}
    </Form.List>
  );
};

export default ItemsInput;

import * as React from 'react';
import {Form, Row, Col, Button, Input} from 'antd';
import {MinusOutlined, PlusOutlined} from '@ant-design/icons';
import {FormInstance} from 'antd/lib/form';

export interface LabelsInputProps {
  value?: {name: string; value: string}[];
  form: FormInstance;
  onChange?: (value: any) => void;
}

const LabelsInput = ({value = [], form}: LabelsInputProps) => {
  const labels = value || [];
  return (
    <Form.List name={['labels']}>
      {(fields, {add, remove}) => {
        let names: any[] = labels.map((v: any, i) => {
          if (!v) {
            return undefined;
          } else {
            return v.name;
          }
        });
        return (
          <div>
            {fields.map((field) => {
              let nameError =
                !!names[field.name] &&
                names
                  .filter((_, i) => i !== field.name)
                  .includes(names[field.name]);
              if (
                !nameError &&
                form.getFieldError(['labels', field.name, 'name']).length > 0
              ) {
                form.validateFields([['labels', field.name, 'name']]);
              }
              return (
                <Row gutter={8} key={field.key}>
                  <Col style={{width: `calc(100% - 32px)`}}>
                    <Row gutter={8}>
                      <Col span={10}>
                        <Form.Item
                          name={[field.name, 'name']}
                          fieldKey={[field.fieldKey, 'name'] as any}
                          validateStatus={nameError ? 'error' : undefined}
                          help={nameError ? '存在相同的标签名!' : undefined}
                          rules={[
                            {required: true, message: '标签名必须填写'},
                            {
                              validator: async (_, value) => {
                                names[field.name] = value;
                                if (
                                  value &&
                                  names
                                    .filter((_, i) => i !== field.name)
                                    .includes(value)
                                ) {
                                  throw new Error('存在相同的标签名!');
                                }
                              },
                            },
                          ]}
                        >
                          <Input placeholder="请输入标签名" />
                        </Form.Item>
                      </Col>
                      <Col
                        span={1}
                        style={{lineHeight: '32px', textAlign: 'center'}}
                      >
                        <p>=</p>
                      </Col>
                      <Col span={13}>
                        <Form.Item
                          name={[field.name, 'value']}
                          fieldKey={[field.fieldKey, 'value'] as any}
                          rules={[{required: true, message: '标签值必须填写'}]}
                        >
                          <Input placeholder="请输入标签值" />
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

export default LabelsInput;

import * as React from 'react';
import {Form, Row, Col, Card, Button, List} from 'antd';
import {MinusOutlined, PlusOutlined} from '@ant-design/icons';
import {Container} from 'api/type/app/';
import {FormInstance} from 'antd/lib/form';

export interface ContainersInputProps {
  value?: Container[];
  form: FormInstance;
}

const ContainersInput: React.FC<ContainersInputProps> = ({children}) => {
  return (
    <Form.List name={['containers']}>
      {(fields, {add, remove}) => {
        return (
          <>
            <List
              itemLayout="horizontal"
              dataSource={fields}
              renderItem={(field) => (
                <section style={{position: 'relative'}}>
                  <Row gutter={8}>
                    <Col style={{width: `calc(100% - 32px)`}}>
                      <Form.Item
                        {...field}
                        rules={[
                          {
                            validator: async (_, value) => {
                              if (!value || !value.name) {
                                throw new Error('请配置容器');
                              }
                            },
                          },
                        ]}
                      >
                        {children}
                      </Form.Item>
                    </Col>

                    <Col style={{width: 32}}>
                      <Button
                        type="ghost"
                        shape="circle"
                        disabled={fields.length <= 1}
                        onClick={() => remove(field.name)}
                        style={{marginBottom: 24}}
                        icon={<MinusOutlined />}
                      />
                    </Col>
                  </Row>
                </section>
              )}
            />
            <div>
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
          </>
        );
      }}
    </Form.List>
  );
};

export default ContainersInput;

import * as React from 'react';
import {Form, Row, Col, Card, Button, List} from 'antd';
import {SettingOutlined, DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import {Container} from 'api/type/app/';

export interface ContainersInputProps {
  value?: Container[];
  // form: FormInstance;
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
                  <Form.Item
                    {...field}
                    rules={[{validator: async (_, value) => {}}]}
                  >
                    {children}
                  </Form.Item>
                  {fields.length > 1 && (
                    <Button
                      style={{position: 'absolute', top: 8, right: 8}}
                      type="ghost"
                      shape="circle"
                      onClick={() => remove(field.name)}
                      icon={<DeleteOutlined />}
                    />
                  )}
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

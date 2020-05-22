import * as React from 'react';
import {Form, Row, Col, Button, Input, Tooltip} from 'antd';
import {
  MinusOutlined,
  PlusOutlined,
  LinkOutlined,
  EditOutlined,
} from '@ant-design/icons';
import {FormInstance} from 'antd/lib/form';
import {Env} from 'api/type/app';

export interface EnvsInputProps {
  value?: Env[];
  form: FormInstance;
  onChange?: (value: any) => void;
  children: (field: any) => React.ReactNode;
}

const EnvsInput: React.FC<EnvsInputProps> = ({value = [], form, children}) => {
  const envs = value || [];
  const [types, setTypes] = React.useState<string[]>(
    envs.map((v) => (v && v.valueFrom ? 'link' : 'define'))
  );
  return (
    <Form.List name={['env']}>
      {(fields, {add, remove}) => {
        let names: any[] = envs.map((v: any, i) => {
          if (!v) {
            return undefined;
          } else {
            return v.name;
          }
        });
        return (
          <div>
            {fields.map((field) => {
              let error =
                !!names[field.name] &&
                names
                  .filter((_, i) => i !== field.name)
                  .includes(names[field.name]);
              if (
                !error &&
                form.getFieldError(['env', field.name, 'name']).length > 0
              ) {
                form.validateFields([['env', field.name, 'name']]);
              }
              if (!types[field.key]) {
                let _types = ([] as any).concat(types);
                _types[field.key] = 'define';
                setTypes(_types);
              }
              const type = types[field.key];
              return (
                <Row gutter={8} key={field.key}>
                  <Col style={{width: `calc(100% - 32px)`}}>
                    <Row gutter={4}>
                      <Col style={{width: 'calc(100% - 42px)', float: 'left'}}>
                        <Row>
                          <Col span={type === 'link' ? 6 : 11}>
                            <Form.Item
                              name={[field.name, 'name']}
                              fieldKey={[field.fieldKey, 'name'] as any}
                              validateStatus={error ? 'error' : undefined}
                              help={error ? '存在相同的标签名!' : undefined}
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
                          <Col span={1}>
                            <p
                              style={{textAlign: 'center', lineHeight: '30px'}}
                            >
                              =
                            </p>
                          </Col>
                          {type === 'define' ? (
                            <Col span={12}>
                              <Form.Item
                                name={[field.name, 'value']}
                                fieldKey={[field.fieldKey, 'value'] as any}
                                rules={[
                                  {required: true, message: '标签值必须填写'},
                                ]}
                              >
                                <Input placeholder="标签值" />
                              </Form.Item>
                            </Col>
                          ) : (
                            <Col span={17}>
                              <Form.Item
                                noStyle
                                name={[field.name, 'valueFrom']}
                                fieldKey={[field.fieldKey, 'valueFrom'] as any}
                              >
                                {children(field)}
                              </Form.Item>
                            </Col>
                          )}
                        </Row>
                      </Col>
                      <Col style={{width: 32, float: 'right'}}>
                        <Tooltip
                          title={
                            type === 'define'
                              ? '引用ConfigMap/Secret'
                              : '自定义'
                          }
                        >
                          <Button
                            style={{height: 30}}
                            icon={
                              type === 'define' ? (
                                <LinkOutlined />
                              ) : (
                                <EditOutlined />
                              )
                            }
                            onClick={() => {
                              let _types = ([] as any).concat(types);
                              _types[field.key] =
                                types[field.key] === 'define'
                                  ? 'link'
                                  : 'define';
                              setTypes(_types);
                            }}
                          />
                        </Tooltip>
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

export default EnvsInput;

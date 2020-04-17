import {Form, Row, Col, Button, Input} from 'antd';
import {MinusOutlined, PlusOutlined} from '@ant-design/icons';

export interface LabelsInputProps {
  value: {data?: {name: string; value: string}[]};
  onChange: (value: any) => void;
}

const LabelsInput = ({value = {}, onChange}: LabelsInputProps) => {
  const labels = value.data || [];
  return (
    <Form.List name={['labels', 'data']}>
      {(fields, {add, remove}) => {
        return (
          <div>
            {fields.map((field, index) => (
              <Row gutter={8} key={field.key}>
                <Col style={{width: `calc(100% - 32px)`}}>
                  <Row gutter={8}>
                    <Col span={10}>
                      <Form.Item
                        name={[field.name, 'name']}
                        fieldKey={[field.fieldKey, 'name'] as any}
                        rules={[
                          {required: true, message: '标签名必须填写'},
                          {
                            validator: async (_, value) => {
                              console.log(labels);
                              if (
                                (labels || [])
                                  .filter((_: any, i: number) => i !== index)
                                  .some(
                                    ({name}: any) => !!value && name === value
                                  )
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
                    disabled={fields.length <= 1 ? true : false}
                    onClick={() => remove(field.name)}
                    style={{marginBottom: 24}}
                    icon={<MinusOutlined />}
                  />
                </Col>
              </Row>
            ))}
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

import * as React from 'react';
import {Form, Button, Input, Row, Col, Select, InputNumber} from 'antd';
import {Inputs} from 'library';
import {getIPList} from '@/utils/index';
import {addNodesRequest} from 'api/type/cluster';

export interface AddNodeFormProps {
  initialValues?: addNodesRequest;
  onSubmit: (values: any) => void;
}

const AddNodeForm: React.FC<AddNodeFormProps> = ({
  initialValues,
  children,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [list, setIPList] = React.useState<string[]>(
    initialValues?.addresses || []
  );
  const [start_ip, setStartIP] = React.useState('');
  const [ip_number, setIPNumber] = React.useState(1);
  React.useEffect(() => {
    form.setFieldsValue({addresses: list});
  }, [list]);
  return (
    <Form
      form={form}
      name="add-node"
      initialValues={initialValues}
      onFinish={onSubmit}
      labelCol={{xs: 24, md: 5}}
      wrapperCol={{xs: 24, md: 19}}
    >
      <Form.Item
        style={{marginBottom: 0}}
        label="IP地址范围"
        validateStatus="success"
      >
        <Form.Item>
          <Row gutter={16}>
            <Col span={24} style={{lineHeight: '32px'}}>
              填写起始IP地址和连续接入的节点数，以批量设置IP地址
            </Col>
            <Col span={12}>
              <Inputs.IP
                value={start_ip}
                placeholder="节点IP起始地址"
                onChange={(v: any) => setStartIP(v.target.value)}
              />
            </Col>
            <Col span={6}>
              <InputNumber
                min={1}
                style={{width: '100%'}}
                placeholder="IP数量"
                value={ip_number}
                onChange={(v: any) => setIPNumber(v)}
              />
            </Col>
            <Col span={6}>
              <Button
                style={{width: '100%'}}
                disabled={!start_ip}
                onClick={() => {
                  const addresses = form.getFieldValue('addresses') as string[];
                  const _list: string[] = getIPList(
                    start_ip,
                    ip_number,
                    addresses
                  );
                  setIPList([..._list]);
                }}
              >
                追加
              </Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          name={'addresses'}
          rules={[{required: true, message: '至少选择一个主机IP!'}]}
        >
          <Select
            allowClear
            placeholder="请先添加IP地址/范围"
            mode="multiple"
            style={{width: '100%'}}
          >
            {list.map((ip) => {
              return (
                <Select.Option key={ip} value={ip}>
                  {ip}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form.Item>
      <Form.Item
        label="用户名"
        name="account"
        rules={[
          {required: true, message: '用户名不能为空!'},
          {
            validator: (_: any, value: any, callback: any) => {
              if (!!value) {
                let pattern = /[\u4e00-\u9fa5]/;
                let n = 0;
                for (let i = 0; i < value.length; i++) {
                  if (pattern.test(value[i])) {
                    n = n + 3;
                  } else {
                    n = n + 1;
                  }
                }
                if (n > 50) {
                  callback('用户名长度超出限制');
                }
              }
              callback();
            },
          },
        ]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item
        label="密码"
        name="password"
        rules={[{required: true, message: '密码不能为空!'}]}
      >
        <Input.Password autoComplete="new-password" placeholder="请输入密码" />
      </Form.Item>
      {children || (
        <Form.Item
          wrapperCol={{
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 16,
              offset: 8,
            },
          }}
        >
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default AddNodeForm;

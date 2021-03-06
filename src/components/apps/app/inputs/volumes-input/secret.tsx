import * as React from 'react';
import {Form, Button, Drawer, Input, Radio, Row, Col, Select} from 'antd';
import {SearchSelect} from 'library';
import {ISecret} from '@/models/apps/secret';
import ItemsInput from './items';

export type SecretInputProps = {
  value?: any;
  children?: React.ReactNode;
  onChange?: (value: any) => void;
  getSecrets: () => Promise<any>;
};

const SecretInput: React.FC<SecretInputProps> = ({
  value = {},
  onChange = () => {},
  getSecrets,
  children,
}) => {
  const [visible, setVisible] = React.useState(false);
  const [itemsData, setItemsData] = React.useState<string[]>([]);
  const [form] = Form.useForm();
  return (
    <>
      <Input
        value={
          value.secretName
            ? `${value.secretName}${value.optional ? '(指定部分key)' : ''}`
            : undefined
        }
        placeholder="配置Secret"
        onFocus={() => setVisible(true)}
      />
      <Drawer
        destroyOnClose={false}
        bodyStyle={{height: 'calc(100% - 108px)', overflow: 'auto'}}
        title="配置Secret"
        width={580}
        placement="right"
        onClose={() => setVisible(false)}
        visible={visible}
      >
        <Form
          form={form}
          labelCol={{xs: 24, md: 5}}
          wrapperCol={{xs: 24, md: 19}}
          initialValues={{
            optional: false,
          }}
          onFinish={(values) => {
            console.log(values);
            onChange(values);
            setVisible(false);
          }}
        >
          <Form.Item required label="Secret">
            <Row gutter={8}>
              <Col style={{width: `calc(100% - 82px)`}}>
                <Form.Item
                  noStyle
                  name="secretName"
                  rules={[{required: true, message: '必须选择Secret'}]}
                >
                  <SearchSelect
                    style={{width: '100%'}}
                    placeholder="选择Secret"
                    asyncSearch={async (page) => {
                      return new Promise(async (resolve, reject) => {
                        if (page > 1) reject();
                        try {
                          const secrets: ISecret[] = await getSecrets!();
                          resolve(secrets);
                        } catch (err) {
                          reject();
                        }
                      });
                    }}
                    onChange={(name, _, secrets: ISecret[] = []) => {
                      setItemsData(
                        Object.entries(
                          secrets.find((v) => v.metadata.name === name)!.data ||
                            {}
                        ).map(([key]) => key)
                      );
                    }}
                  >
                    {(data) =>
                      data.map((v) => (
                        <Select.Option
                          key={v.metadata.name}
                          value={v.metadata.name}
                        >
                          {v.metadata.name}
                        </Select.Option>
                      ))
                    }
                  </SearchSelect>
                </Form.Item>
              </Col>
              <Col style={{width: 82}}>
                {/* {React.cloneElement(children as any, {
                onCreate: (data: ISecret) => {
                  // setFieldsValue({name: data.name});
                },
              })} */}
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.name !== currentValues.name
            }
          >
            {({getFieldValue}) => {
              return (
                <Form.Item required name="optional" label="选项">
                  <Radio.Group
                    onChange={(value) =>
                      value && form.setFieldsValue({items: undefined})
                    }
                  >
                    <Radio value={false}>全部</Radio>
                    <Radio value={true} disabled={!getFieldValue('name')}>
                      指定部分Key
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              );
            }}
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.optional !== currentValues.optional
            }
          >
            {({getFieldValue}) => {
              return getFieldValue('optional') ? (
                <Form.Item
                  name="items"
                  style={{marginBottom: 0}}
                  label="数据卷"
                  validateStatus="success"
                  help={undefined}
                >
                  <ItemsInput itemsData={itemsData} form={form} />
                </Form.Item>
              ) : null;
            }}
          </Form.Item>
          <div className={'drawer-bottom-actions'}>
            <Button
              onClick={() => {
                setVisible(false);
              }}
              style={{marginRight: 8}}
            >
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </div>
        </Form>
      </Drawer>
    </>
  );
};

export default SecretInput;

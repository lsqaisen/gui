import * as React from 'react';
import {Form, Button, Drawer, Input, Radio, Row, Col} from 'antd';
import {SearchSelect} from 'library';
import {IConfigMap} from '@/models/apps/configmap';
import ItemsInput from './items';

export type ConfigMapInputProps = {
  value?: any;
  onChange?: (value: any) => void;
  getConfigMaps: () => Promise<any>;
};

const ConfigMapInput: React.FC<ConfigMapInputProps> = ({
  value = {},
  onChange = () => {},
  getConfigMaps,
  children,
}) => {
  const [visible, setVisible] = React.useState(false);
  const [itemsData, setItemsData] = React.useState<string[]>([]);
  const [form] = Form.useForm();
  return (
    <>
      <Input
        value={
          value.name
            ? `${value.name}${value.optional ? '(指定部分key)' : ''}`
            : undefined
        }
        placeholder="点击配置"
        onFocus={() => setVisible(true)}
      />
      <Drawer
        destroyOnClose={false}
        bodyStyle={{height: 'calc(100% - 108px)', overflow: 'auto'}}
        title="配置ConfigMap"
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
            onChange(values);
            setVisible(false);
          }}
        >
          <Form.Item required label="ConfigMap">
            <Row gutter={8}>
              <Col style={{width: `calc(100% - 82px)`}}>
                <Form.Item
                  noStyle
                  name="name"
                  rules={[{required: true, message: '必须选择ConfigMap'}]}
                >
                  <SearchSelect
                    style={{width: '100%'}}
                    isScroll={false}
                    initialLoad
                    placeholder="选择ConfigMap"
                    asyncSearch={async (page, callback) => {
                      let configmaps: IConfigMap[] = await getConfigMaps!();
                      callback({
                        total: configmaps.length,
                        results: configmaps.map((v) => ({
                          key: v.name,
                          label: v.name,
                          ...v,
                        })) as any,
                      });
                    }}
                    onChangeOptions={(name, _, configmaps: IConfigMap[]) => {
                      setItemsData(
                        Object.entries(
                          configmaps.find((v) => v.name === name)!.data || {}
                        ).map(([key]) => key)
                      );
                      form.setFieldsValue({items: undefined});
                    }}
                  />
                </Form.Item>
              </Col>
              <Col style={{width: 82}}>
                {/* {React.cloneElement(children as any, {
                onCreate: (data: IConfigMap) => {
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

export default ConfigMapInput;

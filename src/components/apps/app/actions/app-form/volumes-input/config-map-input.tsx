import * as React from 'react';
import {Form, Button, Drawer, Input, Radio} from 'antd';
import {SearchSelect} from 'library';
import Context from '@/components/apps/app/context';
import {IConfigMap} from '@/models/apps/configmap';
import ItemsInput from './items-input';

export type ConfigMapInputProps = {
  value?: any;
  onChange?: (value: any) => void;
  [key: string]: any;
};

const ConfigMapInput = ({
  value = {},
  onChange = () => {},
}: ConfigMapInputProps) => {
  const [visible, setVisible] = React.useState(false);
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
        title="配置主机路径"
        width={480}
        placement="right"
        onClose={() => setVisible(false)}
        visible={visible}
      >
        <Form
          form={form}
          labelAlign="left"
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
          <Context.Consumer>
            {({getConfigMaps, CreateConfigMapComp}) => (
              <>
                <Form.Item
                  required
                  name="name"
                  label="ConfigMap"
                  rules={[{required: true, message: '必须选择ConfigMap'}]}
                >
                  <SearchSelect
                    style={{width: 'calc(100% - 68px)'}}
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
                    // onChangeOptions={(name, _, configmaps: IConfigMap[]) => {
                    //   setVolumeItemsData(
                    //     Object.entries(
                    //       configmaps.find((v) => v.name === name)!.data || {}
                    //     ).map(([key]) => key)
                    //   );
                    // }}
                  />
                </Form.Item>
                <span style={{float: 'right'}}>
                  {CreateConfigMapComp && (
                    <CreateConfigMapComp
                      onCreate={(data: IConfigMap) => {
                        // setFieldsValue({name: data.name});
                      }}
                    />
                  )}
                </span>
              </>
            )}
          </Context.Consumer>
          <Form.Item required name="optional" label="选项">
            <Radio.Group
              onChange={(value) =>
                value && form.setFieldsValue({items: undefined})
              }
            >
              <Radio value={false}>全部</Radio>
              <Radio value={true} disabled={!form.getFieldValue('name')}>
                指定部分Key
              </Radio>
            </Radio.Group>
          </Form.Item>
          {form.getFieldValue('optional') && (
            <Form.Item
              name="items"
              style={{marginBottom: 0}}
              label="数据卷"
              validateStatus="success"
              help={undefined}
            >
              <ItemsInput form={form} />
            </Form.Item>
          )}
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

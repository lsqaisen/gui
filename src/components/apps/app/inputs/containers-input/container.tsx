import * as React from 'react';
import {Form, Drawer, Card, Button} from 'antd';
import {Container} from 'api/type/app';

export interface IContainers {
  value?: Container;
  onChange?: (value: any) => void;
}

const ContainersInput: React.FC<IContainers> = ({
  value,
  children,
  onChange = () => {},
}) => {
  const [visible, setVisible] = React.useState(false);
  const [form] = Form.useForm();
  return (
    <>
      <Card style={{cursor: 'pointer'}} onClick={() => setVisible(true)}>
        <Card.Meta
          title={!value || !value.name ? '未配置，点击配置' : value.name}
          description={!!value && value.image}
        />
      </Card>
      <Drawer
        destroyOnClose={false}
        bodyStyle={{height: 'calc(100% - 108px)', overflow: 'auto'}}
        title="配置容器"
        width={720}
        placement="right"
        onClose={() => setVisible(false)}
        visible={visible}
      >
        <Form
          form={form}
          labelCol={{xs: 24, md: 4}}
          wrapperCol={{xs: 24, md: 20}}
          initialValues={value}
          onFinish={(values) => {
            onChange(values);
            setVisible(false);
          }}
        >
          {children}
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

export default ContainersInput;

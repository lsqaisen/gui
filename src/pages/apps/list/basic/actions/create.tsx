import * as React from 'react';
import {Button, Drawer} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {App} from 'api/type/app/';
import {connect} from 'dva';
import AppForm from '../form/';
import {ConnectLoading} from '@/models/connect';

export interface CreateAppProps {
  loading: boolean;
  namespace: string;
  onSubmit?: (value: App) => any;
}

const CreateApp = ({namespace}: CreateAppProps) => {
  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(true);
  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setVisible(true);
        }}
      >
        <PlusOutlined /> 添加应用
      </Button>
      <Drawer
        bodyStyle={{height: 'calc(100% - 108px)', overflow: 'auto'}}
        title="添加应用"
        width={720}
        placement="right"
        onClose={() => {
          setVisible(false);
        }}
        visible={visible}
      >
        <AppForm
          initialValues={{
            namespace,
            type: 'Deployment',
            replicas: 1,
            containers: [{}],
          }}
          onSubmit={async (values) => {
            console.log(values);
            // setLoading(true);
            // if (await createApp!(values)) {
            // } else {
            //   setVisible(false);
            // }
            // setLoading(false);
          }}
        >
          <div className={'drawer-bottom-actions'}>
            <Button
              onClick={() => {
                setVisible(false);
              }}
              style={{marginRight: 8}}
            >
              取消
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
          </div>
        </AppForm>
      </Drawer>
    </>
  );
};

export type ConnectState = {
  loading: ConnectLoading;
};

export default connect(({loading}: ConnectState) => ({
  loading: loading.effects['apps/create'],
}))(CreateApp);

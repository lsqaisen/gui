import * as React from 'react';
import {Button, Drawer} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {App} from 'api/type/app/';
import {connect} from 'dva';
import ConfigMapForm from './config-map-form/';
import {ConnectLoading} from '@/models/connect';

export interface CreateAppProps {
  btnText?: string;
  loading: boolean;
  namespace: string;
  onSubmit?: (value: App) => any;
}

const CreateApp = ({btnText, loading, namespace}: CreateAppProps) => {
  const [visible, setVisible] = React.useState(false);
  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setVisible(true);
        }}
      >
        <PlusOutlined /> {btnText || '添加应用'}
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
        <ConfigMapForm
          loading={loading}
          initialValues={{
            namespace,
            data: {
              KEY: 'VALUE',
              FILE: `{PORT: "8080", ADDRESS: "0.0.0.0" }`,
            },
          }}
          onCancel={() => setVisible(false)}
          onSubmit={async (values) => {
            console.log(values);
            // setLoading(true);
            // if (await createApp!(values)) {
            // } else {
            //   setVisible(false);
            // }
            // setLoading(false);
          }}
        />
      </Drawer>
    </>
  );
};

export type ConnectState = {
  loading: ConnectLoading;
};

export default connect(({loading}: ConnectState) => ({
  loading: loading.effects['configmap/create'],
}))(CreateApp);

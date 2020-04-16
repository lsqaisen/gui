import * as React from 'react';
import {Button, Drawer} from 'antd';
import {ImportOutlined} from '@ant-design/icons';
import AddNodeForm from './form';
import {addNodesRequest} from 'api/type/cluster';

export interface AddNodeProps {
  onSubmit?: (value: addNodesRequest) => any;
}

const AddNode = ({onSubmit}: AddNodeProps) => {
  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setVisible(true);
        }}
      >
        <ImportOutlined /> 安装节点
      </Button>
      <Drawer
        bodyStyle={{height: 'calc(100% - 108px)', overflow: 'auto'}}
        title="安装节点"
        width={500}
        placement="right"
        onClose={() => {
          setVisible(false);
        }}
        visible={visible}
      >
        <AddNodeForm
          initialValues={{account: 'root', password: '', addresses: []}}
          onSubmit={async values => {
            setLoading(true);
            if (await onSubmit!(values as addNodesRequest)) {
            } else {
              setVisible(false);
            }
            setLoading(false);
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
        </AddNodeForm>
      </Drawer>
    </>
  );
};

export default AddNode;

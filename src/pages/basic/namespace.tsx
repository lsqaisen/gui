import {connect} from 'dva';
import {Button} from 'antd';
import {ReloadOutlined} from '@ant-design/icons';
import {Namespace, Manage} from '@/components/apps/namespace/';
import {ConnectLoading} from '@/models/connect';
import {INs, NamespaceModelState} from '@/models/apps/namespace';
import List from './list';
import Add from './add';

export type ConnectState = {
  namespace: NamespaceModelState;
  loading: ConnectLoading;
};

export default connect(({namespace, loading}: ConnectState) => ({
  nslist: namespace.nslist.items,
  loading: loading.effects['namespace/get'],
}))(({loading, ns, nslist, goto, dispatch}: any) => {
  if (!!nslist[0] && nslist.every((v: any) => v.metadata.name !== ns)) {
    goto!(nslist[0].metadata.name);
  }
  return (
    <Namespace<INs>
      current={ns}
      data={nslist}
      onChange={goto}
      onLoad={() => dispatch({type: 'namespace/get'})}
      onDelete={(namespace) =>
        dispatch({type: 'namespace/delete', payload: namespace}).then(
          (err: any) => {
            if (!err) {
              dispatch({type: 'namespace/get'});
            }
          }
        )
      }
      actions={[
        <Button
          key="reload"
          className="fl"
          icon={<ReloadOutlined />}
          loading={loading}
          onClick={() => dispatch({type: 'namespace/get'})}
        />,
      ]}
    >
      <Add goto={goto} />
    </Namespace>
  );
});

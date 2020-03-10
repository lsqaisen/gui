import { useState, useEffect } from 'react';
import { Empty, Button } from 'antd';
import { connect } from 'dva';
import { Loading } from 'library';
import Namespaces from '@/components/apps/namespace';
import AddNamespace from '@/components/apps/namespace/add-namespace';
import { Dispatch, ConnectLoading } from '@/models/connect';
import { INs, NamespaceModelState } from '@/models/apps/namespace';

export interface Props {
  loading: boolean;
  error?: string;
  ns: string;
  nslist: INs[];
  goto: (ns?: string) => void;
  dispatch: Dispatch<any>;
}

export type ConnectState = {
  namespace: NamespaceModelState;
  loading: ConnectLoading;
}

const ConnectStateFunc = ({ namespace, loading }: ConnectState) => ({
  error: namespace.error,
  nslist: namespace.nslist.items,
  loading: loading.effects['namespace/get']
})


const NamespaceLayout: React.FC<Props> = ({ loading, error, ns, nslist, goto, dispatch, children }) => {
  const [init, setInit] = useState(false);
  const getNSs = () => dispatch({ type: 'namespace/get' }).then((data: any) => {
    !ns && data.items[0] && goto!(data.items[0].metadata.name);
    if (!init) setInit(true);
  }), addNS = (payload: string) => dispatch({ type: 'namespace/create', payload }).then((error: any) => {
    !error && goto!(payload)
  });
  useEffect(() => { getNSs() }, []);
  return (
    <Loading loading={!init}>
      {error ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <Empty
            description={error} >
            <Button loading={loading} type="primary" onClick={getNSs}>重试</Button>
          </Empty>
        </div>
      ) : nslist.length <= 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <Empty
            description="未创建命名空间" >
            <div>
              <AddNamespace
                btn={<Button type="primary">立即创建</Button>}
                onSubmit={addNS}
              />
            </div>
          </Empty>
        </div>
      ) : children
      }
    </Loading >
  )
}

export const Layout = connect(ConnectStateFunc)(NamespaceLayout);

const Namespace = ({ loading, ns, nslist, goto, dispatch }: Props) => {
  const getNSs = () => dispatch({ type: 'namespace/get' });
  const addNS = (payload: string) => dispatch({ type: 'namespace/create', payload }).then((error: any) => { !error && goto!(payload) });
  const deleteNS = (payload: string) => dispatch({ type: 'namespace/delete', payload });
  if (!!nslist[0] && nslist.every(v => v.metadata.name !== ns)) goto!(nslist[0].metadata.name);

  return (
    <Namespaces
      loading={loading}
      current={ns}
      nslist={nslist}
      onChange={goto}
      getNSs={getNSs}
      addNS={addNS}
      deleteNS={deleteNS}
    />
  )
}

export default connect(ConnectStateFunc)(Namespace);
import {useState, useEffect} from 'react';
import {Empty, Button} from 'antd';
import {connect} from 'dva';
import {Loading} from 'library';
import AddNamespace from './add';
import {Dispatch, ConnectLoading} from '@/models/connect';
import {INs, NamespaceModelState} from '@/models/apps/namespace';

export interface INsLayout {
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
};

const ConnectStateFunc = ({namespace, loading}: ConnectState) => ({
  error: namespace.error,
  nslist: namespace.nslist.items,
  loading: loading.effects['namespace/get'],
});

const NamespaceLayout: React.FC<INsLayout> = ({
  loading,
  error,
  ns,
  nslist,
  goto,
  dispatch,
  children,
}) => {
  const [init, setInit] = useState(false);
  useEffect(() => {
    dispatch({type: 'namespace/get'}).then((data: any) => {
      // !ns && data.items[0] && goto!(data.items[0].metadata.name);
      if (!init) setInit(true);
    });
  }, []);
  return (
    <Loading loading={!init}>
      {error ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <Empty description={error}>
            <Button
              loading={loading}
              type="primary"
              onClick={() => {
                dispatch({type: 'namespace/get'}).then((data: any) => {
                  !ns && data.items[0] && goto!(data.items[0].metadata.name);
                  if (!init) setInit(true);
                });
              }}
            >
              重试
            </Button>
          </Empty>
        </div>
      ) : nslist.length <= 0 ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <Empty description="未创建命名空间">
            <div>
              <AddNamespace goto={goto} />
            </div>
          </Empty>
        </div>
      ) : (
        children
      )}
    </Loading>
  );
};

export default connect(ConnectStateFunc)(NamespaceLayout);

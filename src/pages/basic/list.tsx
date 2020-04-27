import {connect} from 'dva';
import NsList from '@/components/apps/namespace/list';
import {Dispatch, ConnectLoading} from '@/models/connect';
import {INs, NamespaceModelState} from '@/models/apps/namespace';

export interface INsList {
  loading: boolean;
  nslist: INs[];
  dispatch: Dispatch<any>;
}

export type ConnectState = {
  namespace: NamespaceModelState;
  loading: ConnectLoading;
};

const List = ({loading, nslist, dispatch}: INsList) => {
  const deleteNS = (payload: string) =>
    dispatch({type: 'namespace/delete', payload});

  return <NsList<INs> loading={loading} data={nslist} onDelete={deleteNS} />;
};

export default connect(({namespace, loading}: ConnectState) => ({
  nslist: namespace.nslist.items,
  loading: loading.effects['namespace/get'],
}))(List);

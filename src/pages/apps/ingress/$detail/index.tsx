import { connect } from 'dva';
import { PageProps } from 'library/type/page'
import { Dispatch, ConnectLoading } from '@/models/connect';
import Detail from '@/components/apps/ingress/detail';
import { IngressModelState, IIngress } from '@/models/apps/ingress';
import { Loading } from 'library';
import { useEffect } from 'react';

interface AppDetailProps extends PageProps {
  loading: boolean;
  name: string;
  namespace: string;
  ingress: IIngress;
  dispatch: Dispatch<any>
}

const AppDetail = ({ loading, name, namespace, ingress, dispatch }: AppDetailProps) => {
  const getIngresses = () => dispatch({ type: 'ingress/get', payload: namespace });
  useEffect(() => { getIngresses() }, [namespace, name]);
  return (
    <Loading loading={!ingress}>
      <div style={{ padding: 24 }}>
        <Detail loading={loading} ingress={ingress} getDetail={getIngresses} />
      </div>
    </Loading>
  )
}

export type ConnectState = {
  ingress: IngressModelState
  loading: ConnectLoading
}

export default connect(
  (
    { ingress, loading }: ConnectState,
    { location: { query: { ns } }, match: { params: { detail } } }: any
  ) => {
    return ({ name: detail, namespace: ns, ingress: (ingress.data[ns] || []).find(v => v.name === detail), loading: loading.effects['ingress/get'] })
  }
)(AppDetail)
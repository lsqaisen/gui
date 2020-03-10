import { useEffect } from 'react';
import { connect } from 'dva';
import { Dispatch, ConnectLoading } from '@/models/connect';
import { AppsModelState } from '@/models/apps/apps';
import Detail, { ServiceProps } from '@/components/apps/app/detail';
import { Loading } from 'library';
import { Button } from 'antd';
import Content from './basic/content';

interface AppDetailProps extends ServiceProps {
  loading: boolean;
  name: string;
  type: string;
  namespace: string;
  dispatch: Dispatch<any>
}

const AppDetail = ({ loading, name, namespace, type, app, dispatch, ...props }: AppDetailProps) => {
  const getDetail = () => dispatch({ type: 'apps/detail', payload: { name, namespace, type } });
  const getService = () => dispatch({ type: 'apps/service', payload: { name, namespace } });
  useEffect(() => { getDetail(); getService() }, [name, type, namespace]);
  return (
    <Loading loading={!app}>
      <div style={{ padding: 24 }}>
        <Detail
          {...props}
          app={app}
          reloadBtn={<Button key="3" onClick={getDetail}>刷新</Button>}
        >
          <Content loading={!!loading} app={app} />
        </Detail>
      </div>
    </Loading>
  )
}

export type ConnectState = {
  apps: AppsModelState
  loading: ConnectLoading
}

export default connect(
  (
    { apps, loading }: ConnectState,
    { location: { query: { ns, type } }, match: { params: { detail } } }: any
  ) => {
    return ({
      namespace: ns, type,
      name: detail,
      app: apps.details[`${detail}${ns}`],
      service: apps.serviceDetials[`${detail}${ns}`],
      loading: loading.effects['apps/detail']
    })
  }
)(AppDetail)
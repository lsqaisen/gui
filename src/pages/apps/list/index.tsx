import {connect} from 'dva';
import {Button} from 'antd';
import {Page} from 'library';
import Table from '@/components/apps/app/table';
import CreateApp from '@/components/apps/app/create';
import EditApp from '@/components/apps/app/edit';
import ImportApp from '@/components/apps/app/yaml-create';
import {Dispatch, ConnectLoading} from '@/models/connect';
import {AppsModelState, IApp} from '@/models/apps/apps';
import Namespace, {Layout as NamespaceLayout} from '../../basic/namespace';
import router from 'umi/router';
import Actions from './basic/actions';
import {useEffect} from 'react';

interface AppListProps {
  loading: boolean;
  ns: string;
  apps: IApp[];
  dispatch: Dispatch<any>;
}

const AppList = ({loading, ns, apps, dispatch}: AppListProps) => {
  const getApps = () => dispatch({type: 'apps/get', payload: ns});
  const goto = (ns: string) => router.push(`/apps/list?ns=${ns}`);
  useEffect(() => {
    ns && getApps();
  }, [ns]);
  return (
    <NamespaceLayout ns={ns} goto={goto}>
      <Page
        style={{minHeight: '100%'}}
        title=""
        routes={[
          {
            path: '/dashboard',
            breadcrumbName: '总览',
          },
          {
            path: `/apps/list`,
            breadcrumbName: '应用列表',
          },
        ]}
      >
        <section className="box">
          <header style={{overflow: 'hidden', marginBottom: 16}}>
            <Namespace ns={ns} goto={goto} />
            <div className="fl" style={{marginRight: 16}}>
              <CreateApp />
            </div>
            <div className="fl" style={{marginRight: 16}}>
              <ImportApp />
            </div>
            <div className="fr">
              <Button
                style={{marginLeft: 16}}
                loading={loading}
                onClick={getApps}
              >
                刷新
              </Button>
            </div>
          </header>
          <Table
            loading={loading}
            data={apps}
            actions={<Actions dispatch={dispatch} />}
          >
            <EditApp key="edit" />
          </Table>
        </section>
      </Page>
    </NamespaceLayout>
  );
};

export type ConnectState = {
  apps: AppsModelState;
  loading: ConnectLoading;
};

export default connect(
  (
    {apps, loading}: ConnectState,
    {
      location: {
        query: {ns},
      },
    }: any
  ) => ({ns, apps: apps.data[ns] || [], loading: loading.effects['apps/get']})
)(AppList);

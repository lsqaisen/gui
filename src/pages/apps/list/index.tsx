import * as React from 'react';
import {connect} from 'dva';
import {Button, Drawer, Modal, Select} from 'antd';
import {Page, SearchSelect} from 'library';
import Table from '@/components/apps/app/table';
import CreateApp from './basic/actions/create';
// import EditApp from '@/components/apps/app/edit';
// import ImportApp from '@/components/apps/app/yaml-create';
import {Dispatch, ConnectLoading} from '@/models/connect';
import {AppsModelState, IApp} from '@/models/apps/apps';
import {Layout, Namespace} from '@/pages/basic/';
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
  const [v, setV] = React.useState(false);
  const getImages = (payload: any) =>
    dispatch({type: 'registry/getImages', payload});
  return (
    <SearchSelect
      style={{width: 200}}
      asyncSearch={(page) => {
        return new Promise(async (resolve, reject) => {
          try {
            const {items, total}: any = await getImages!({
              domain: 'on',
              page: page + 1,
              size: 10,
            });
            console.log(items, page);
            page * 10 >= total ? reject() : resolve(items);
          } catch (err) {
            reject();
          }
        });
      }}
    >
      {(data: any) => {
        return data.map((v: any) => (
          <Select.Option key={v.name} value={v.name}>
            {v.name.split('/').pop()}
          </Select.Option>
        ));
      }}
    </SearchSelect>
  );
  return (
    <Layout ns={ns} goto={goto}>
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
              <CreateApp namespace={ns} />
            </div>
            {/* <div className="fl" style={{marginRight: 16}}>
              <ImportApp />
            </div> */}
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
          {/* <Table
            loading={loading}
            data={apps}
            actions={<Actions dispatch={dispatch} />}
          >
            <EditApp key="edit" />
          </Table> */}
        </section>
      </Page>
    </Layout>
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

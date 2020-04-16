import {useEffect} from 'react';
import {connect} from 'dva';
import {Button} from 'antd';
import router from 'umi/router';
import {Page} from 'library';
import Table from '@/components/apps/configmap/table';
import CreateConfigMap from '@/components/apps/configmap/create';
import {IConfigMap, ConfigMapModelState} from '@/models/apps/configmap';
import {Dispatch, ConnectLoading} from '@/models/connect';
import Context from '@/components/apps/configmap/context';
import {ConfigMapRequest} from 'api/type/app';
import Namespace, {Layout as NamespaceLayout} from '../../basic/namespace';
import Delete from './basic/actions/';

export type ConfigMapListProps = {
  loading: boolean;
  ns: string;
  configmaps: IConfigMap[];
  dispatch: Dispatch<any>;
};

const ConfigMapList = ({
  loading,
  configmaps,
  ns,
  dispatch
}: ConfigMapListProps) => {
  const goto = (ns: string) => router.push(`/apps/configmap?ns=${ns}`);
  const getConfigMaps = () => dispatch({type: 'configmap/get', payload: ns});
  const createConfigMap = (payload: ConfigMapRequest) =>
    dispatch({type: 'configmap/create', payload});
  useEffect(() => {
    ns && getConfigMaps();
  }, [ns]);
  return (
    <NamespaceLayout ns={ns} goto={goto}>
      <Context.Provider value={{namespace: ns, createConfigMap}}>
        <Page
          style={{minHeight: '100%'}}
          title=""
          routes={[
            {
              path: '/dashboard',
              breadcrumbName: '总览'
            },
            {
              path: `/apps/configmap`,
              breadcrumbName: '配置管理'
            }
          ]}
        >
          <section className="box">
            <header style={{overflow: 'hidden', marginBottom: 16}}>
              <Namespace ns={ns} goto={goto} />
              <div className="fl" style={{marginRight: 16}}>
                <CreateConfigMap />
              </div>
              <div className="fr">
                <Button
                  style={{marginLeft: 16}}
                  loading={loading}
                  onClick={getConfigMaps}
                >
                  刷新
                </Button>
              </div>
            </header>
            <Table
              loading={loading}
              dataSource={configmaps.map(v => ({key: v.name, ...v})) as any}
              actions={<Delete dispatch={dispatch} />}
            />
          </section>
        </Page>
      </Context.Provider>
    </NamespaceLayout>
  );
};

export type ConnectState = {
  configmap: ConfigMapModelState;
  loading: ConnectLoading;
};

export default connect(
  (
    {configmap, loading}: ConnectState,
    {
      location: {
        query: {ns}
      }
    }: any
  ) => ({
    ns,
    configmaps: configmap.data[ns] || [],
    loading: loading.effects['configmap/get']
  })
)(ConfigMapList);

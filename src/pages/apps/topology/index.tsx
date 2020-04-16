import {connect} from 'dva';
import Topology, {TopologyProps} from '@/components/apps/topology';
import {Dispatch, ConnectLoading} from '@/models/connect';
import {AppsModelState, IApp, IService} from '@/models/apps/apps';
import Namespace, {Layout as NamespaceLayout} from '../../basic/namespace';
import {useEffect, useState} from 'react';
import {NamespaceModelState, INs} from '@/models/apps/namespace';
import router from 'umi/router';
import {Page, Loading} from 'library';
import {IngressModelState} from '@/models/apps/ingress';
import {NlbModelState} from '@/models/apps/nlb';

export interface AppListProps extends TopologyProps {
  namespace: string;
  nslist: INs[];
  dispatch: Dispatch<any>;
}

const TopologyPage = ({
  namespace,
  nslist,
  apps,
  services,
  ingresses,
  nlblist,
  dispatch
}: AppListProps) => {
  const [init, setInit] = useState(false);
  const getData = async () => {
    await Promise.all([
      dispatch({type: 'apps/get', payload: namespace}).then(
        async (apps: IApp[]) => {
          return Promise.all(
            apps.map(async v => {
              return Promise.all([
                // dispatch({
                //   type: 'apps/detail',
                //   payload: {name: v.name, namespace: namespace, type: v.type},
                // }),
                dispatch({
                  type: 'apps/service',
                  payload: {name: v.name, namespace: namespace}
                })
              ]);
            })
          );
        }
      ),
      dispatch({type: 'ingress/get', payload: namespace}),
      dispatch({type: 'nlb/get', payload: namespace}),
      dispatch({type: 'apps/services', payload: namespace})
    ]);

    setInit(true);
  };
  const goto = (ns: string) => {
    setInit(false);
    router.push(`/apps/topology?ns=${ns}`);
  };
  useEffect(() => {
    namespace && getData();
  }, [namespace]);
  return (
    <NamespaceLayout namespace={namespace} goto={goto}>
      <Page
        style={{position: 'relative', minHeight: '100%'}}
        title=""
        routes={[
          {
            path: '/dashboard',
            breadcrumbName: '总览'
          },
          {
            path: `/apps/topology`,
            breadcrumbName: '拓扑图'
          }
        ]}
      >
        <Loading loading={!init}>
          <section
            style={{
              position: 'absolute',
              top: 22,
              left: 0,
              height: 'calc(100vh - 22px)',
              width: '100%'
            }}
          >
            <Topology
              ns={(nslist || []).find(v => v.metadata.name === namespace)!}
              apps={apps}
              services={services}
              ingresses={ingresses}
              nlblist={nlblist}
            />
          </section>
        </Loading>
        <Namespace ns={namespace} goto={goto} />
      </Page>
    </NamespaceLayout>
  );
};

export type ConnectState = {
  apps: AppsModelState;
  ingress: IngressModelState;
  nlb: NlbModelState;
  namespace: NamespaceModelState;
  loading: ConnectLoading;
};

export default connect(
  (
    {apps, ingress, nlb, namespace, loading}: ConnectState,
    {
      location: {
        query: {ns}
      }
    }: any
  ) => ({
    namespace: ns,
    nslist: namespace.nslist.items,
    apps: (apps.data[ns] || []).map(v => {
      const service = apps.serviceDetials[`${v.name}${ns}`];
      return {
        ...(apps.details[`${v.name}${ns}`] || v),
        service: service && !!service.name ? service : undefined
      };
    }),
    ingresses: ingress.data[ns],
    nlblist: nlb.data[ns],
    services: apps.services[ns],
    loading: loading.effects['apps/get']
  })
)(TopologyPage);

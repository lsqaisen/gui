import { connect } from 'dva';
import { Button } from 'antd';
import router from 'umi/router';
import { Page, Loading } from 'library';
import Table from '@/components/apps/ingress/table';
import CreateIngress from '@/components/apps/ingress/add';
import EditRules from '@/components/apps/ingress/edit';
import { IIngress, IngressModelState } from '@/models/apps/ingress';
import { Dispatch, ConnectLoading } from '@/models/connect';
import { ModifyIngressRulesType } from 'api/type/app';
import Namespace, { Layout as NamespaceLayout } from '../../basic/namespace';
import Actions from './basic/actions/';

export type IngressListProps = {
  loading: boolean;
  ns: string;
  ingresses: IIngress[];
  dispatch: Dispatch<any>;
}

const IngressList = ({ loading, ingresses, ns, dispatch }: IngressListProps) => {
  const goto = (ns: string) => router.push(`/apps/ingress?ns=${ns}`);
  const getIngresss = () => dispatch({ type: 'ingress/get', payload: ns });
  const editIngressRules = (payload: ModifyIngressRulesType) => dispatch({ type: 'ingress/modify', payload });
  return (
    <NamespaceLayout ns={ns} goto={goto}>
      <Loading loading={!ingresses}>
        <Page
          style={{ minHeight: '100%' }}
          title=""
          routes={[{
            path: '/dashboard',
            breadcrumbName: '总览',
          }, {
            path: `/apps/ingress`,
            breadcrumbName: '应用负载均衡',
          }]}
        >
          <section className="box">
            <header style={{ overflow: 'hidden', marginBottom: 16 }}>
              <Namespace ns={ns} goto={goto} />
              <div className="fl" style={{ marginRight: 16 }}>
                <CreateIngress />
              </div>
              <div className="fr">
                <Button style={{ marginLeft: 16 }} loading={loading} onClick={getIngresss}>刷新</Button>
              </div>
            </header>
            <Table
              loading={loading}
              data={ingresses}
              actions={<Actions dispatch={dispatch} />}
            >
              <EditRules key="addrules" submit={editIngressRules} />
            </Table>
          </section>
        </Page>
      </Loading>
    </NamespaceLayout>
  )
}

export type ConnectState = {
  ingress: IngressModelState
  loading: ConnectLoading
}

export default connect((
  { ingress, loading }: ConnectState,
  { location: { query: { ns } } }: any) => ({
    ns, ingresses: ingress.data[ns], loading: loading.effects['ingress/get']
  })
)(IngressList);
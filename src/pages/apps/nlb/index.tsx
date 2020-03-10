import { connect } from 'dva';
import { Button } from 'antd';
import router from 'umi/router';
import { Page, Loading } from 'library';
import Table from '@/components/apps/nlb/table';
import CreateNlb from '@/components/apps/nlb/add';
import AddRules from '@/components/apps/nlb/add-rules';
import { INlb, NlbModelState } from '@/models/apps/nlb';
import { Dispatch, ConnectLoading } from '@/models/connect';
import Namespace, { Layout as NamespaceLayout } from '../../basic/namespace';
import Actions from './basic/actions/';

export type NlbListProps = {
  loading: boolean;
  ns: string;
  nlblist: INlb[];
  dispatch: Dispatch<any>;
}

const NlbList = ({ loading, nlblist, ns, dispatch }: NlbListProps) => {
  const goto = (ns: string) => router.push(`/apps/nlb?ns=${ns}`);
  const getNlbs = () => dispatch({ type: 'nlb/get', payload: ns });
  return (
    <NamespaceLayout ns={ns} goto={goto}>
      <Loading loading={!nlblist}>
        <Page
          style={{ minHeight: '100%' }}
          title=""
          routes={[{
            path: '/dashboard',
            breadcrumbName: '总览',
          }, {
            path: `/apps/nlb`,
            breadcrumbName: '网络负载均衡',
          }]}
        >
          <section className="box">
            <header style={{ overflow: 'hidden', marginBottom: 16 }}>
              <Namespace ns={ns} goto={goto} />
              <div className="fl" style={{ marginRight: 16 }}>
                <CreateNlb />
              </div>
              <div className="fr">
                <Button style={{ marginLeft: 16 }} loading={loading} onClick={getNlbs}>刷新</Button>
              </div>
            </header>
            <Table
              loading={loading}
              data={nlblist}
              actions={<Actions dispatch={dispatch} />}
            >
              {/* <AddRules key="addrules" submit={editNlbRules} /> */}
            </Table>
          </section>
        </Page>
      </Loading>
    </NamespaceLayout>
  )
}

export type ConnectState = {
  nlb: NlbModelState
  loading: ConnectLoading
}

export default connect((
  { nlb, loading }: ConnectState,
  { location: { query: { ns } } }: any) => ({
    ns, nlblist: nlb.data[ns], loading: loading.effects['nlb/get']
  })
)(NlbList);
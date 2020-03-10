import { useEffect } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { Page } from 'library';
import Table from '@/components/network/vip/table';
import Add from '@/components/network/vip/add';
import DeleteVip from './basic/actions';
import { INetworkVip, NetworkVipModelState } from '@/models/network/vip';
import { Dispatch, ConnectLoading } from '@/models/connect';
import Context from '@/components/network/vip/context';
import { addVipRequest } from 'api/type/network';

export type VipProps = {
  vips: INetworkVip[];
  loading: boolean;
  dispatch: Dispatch<any>;
}

const Vip: React.FC<VipProps> = ({ loading, vips, dispatch }) => {
  const getVips = () => dispatch({ type: 'nwvip/get' });
  const createVip = (vip: addVipRequest) => dispatch({ type: 'nwvip/add', payload: vip });
  useEffect(() => { getVips() }, []);
  return (
    <Context.Provider value={{ getVips, createVip }}>
      <Page
        style={{ minHeight: '100%' }}
        title=""
        routes={[{
          path: '/dashboard',
          breadcrumbName: '总览',
        }, {
          path: `/network/vip`,
          breadcrumbName: '负载均衡VIP',
        }]}
      >
        <section className="box">
          <Page.Header
            leftComp={<Add />}
            rightComp={<Button style={{ marginLeft: 16 }} type="ghost" loading={loading} onClick={getVips}>刷新</Button>}
          />
          <Table
            loading={loading}
            data={vips}
            actions={<DeleteVip dispatch={dispatch} />}
          />
        </section>
      </Page>
    </Context.Provider>
  )
}

export type ConnectState = {
  nwvip: NetworkVipModelState;
  loading: ConnectLoading;
}
export default connect(({ nwvip, loading }: ConnectState) => ({ vips: nwvip.vips, loading: loading.effects['nwvip/get'] }))(Vip)
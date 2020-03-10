import { useEffect } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { Page } from 'library';
import Table from '@/components/network/pool/table';
import Add from '@/components/network/pool/add';
import DeleteSubpool from './basic/actions';
import { INetworkPool, NetworkPoolModelState } from '@/models/network/pool';
import { Dispatch, ConnectLoading } from '@/models/connect';
import Context from '@/components/network/pool/context';
import { addPoolRequest } from 'api/type/network';

export type PoolProps = {
  pools: INetworkPool[];
  loading: boolean;
  dispatch: Dispatch<any>;
}

const Pool = ({ loading, pools, dispatch }: PoolProps) => {
  const getPools = () => dispatch({ type: 'nwpool/get' });
  const createPool = (pool: addPoolRequest) => dispatch({ type: 'nwpool/add', payload: pool });
  useEffect(() => { getPools() }, []);
  return (
    <Context.Provider value={{ createPool }}>
      <Page
        style={{ minHeight: '100%' }}
        title=""
        routes={[{
          path: '/dashboard',
          breadcrumbName: '总览',
        }, {
          path: `/network/pool`,
          breadcrumbName: 'IP资源池',
        }]}
      >
        <section className="box">
          <Page.Header
            leftComp={<Add />}
            rightComp={<Button style={{ marginLeft: 16 }} type="ghost" loading={loading} onClick={getPools} >刷新</Button>}
          />
          <Table
            loading={loading}
            data={pools}
            actions={<DeleteSubpool dispatch={dispatch} />}
          />
        </section>
      </Page>
    </Context.Provider>
  )
}

export type ConnectState = {
  nwpool: NetworkPoolModelState;
  loading: ConnectLoading;
}
export default connect(({ nwpool, loading }: ConnectState) => ({ pools: nwpool.pools, loading: loading.effects['nwpool/get'] }))(Pool)
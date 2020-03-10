import { useEffect } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { Page } from 'library';
import { ConnectLoading, Dispatch } from '@/models/connect';
import { PrivateModelState, IPrivate } from '@/models/registry/private';
import Table from '@/components/registry/private/table';
import Add from './basic/actions/add-private';
import Delete from './basic/actions/delete-private';

export type PrivateListProps = {
  privates: IPrivate[];
  loading: boolean;
  dispatch: Dispatch<any>;
}

const PrivateList: React.FC<PrivateListProps> = ({ loading, privates, dispatch }) => {
  const getPrivates = () => dispatch({ type: 'private/get' });
  useEffect(() => { getPrivates() }, [])
  return (
    <Page
      className="node-body"
      style={{ minHeight: '100%' }}
      title=""
      routes={[{
        path: '/dashboard',
        breadcrumbName: '总览',
      }, {
        path: `/registry/private`,
        breadcrumbName: '外部仓库',
      }]}
    >
      <section className="box">
        <header style={{ overflow: 'hidden', marginBottom: 16 }}>
          <div className="fl" style={{ marginRight: 16 }}>
            <Add dispatch={dispatch} />
          </div>
          <div className="fr">
            <Button style={{ marginLeft: 16 }} type="ghost" loading={loading} onClick={getPrivates} >刷新</Button>
          </div>
        </header>
        <Table
          loading={loading}
          data={privates}
          actions={<Delete dispatch={dispatch} />}
        />
      </section>
    </Page>
  )
}

export type ConnectState = {
  'private': PrivateModelState
  loading: ConnectLoading
}
export default connect(({ private: _private, loading }: ConnectState) => ({ privates: _private.data, loading: loading.effects['private/get'] }))(PrivateList)
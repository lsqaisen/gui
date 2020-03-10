import { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { Page } from 'library';
import { ConnectLoading, Dispatch } from '@/models/connect';
import { PrivilegesModelState, IPrivilege } from '@/models/uesr/privileges';
import Privileges from '@/components/user/privileges/';

export type PrivilegesListProps = {
  privileges: IPrivilege[];
  loading: boolean;
  dispatch: Dispatch<any>;
}

const PrivilegesList: React.FC<PrivilegesListProps> = ({ loading, privileges, dispatch }) => {
  const [{ data, edit }, setState] = useState({ data: privileges, edit: false } as any);
  const getPrivileges = () => dispatch({ type: 'privileges/get' });
  useEffect(() => { getPrivileges() }, []);
  if (!edit && JSON.stringify(data) !== JSON.stringify(privileges)) setState({ data: privileges, edit });
  return (
    <Page
      className="node-body"
      style={{ minHeight: '100%' }}
      title=""
      routes={[{
        path: '/dashboard',
        breadcrumbName: '总览',
      }, {
        path: `/user/privileges`,
        breadcrumbName: '用户权限',
      }]}
    >
      <section className="box">
        <header style={{ overflow: 'hidden', marginBottom: 16 }}>
          {edit && <div className="fl">
            <Button.Group>
              <Button type="primary">保存</Button>
              <Button type="danger" ghost>取消</Button>
            </Button.Group>
          </div>}
          <div className="fr">
            <Button style={{ marginLeft: 16 }} type="ghost" loading={loading} onClick={getPrivileges} >刷新</Button>
          </div>
        </header>
        <Privileges
          loading={loading}
          privileges={data}
          onChange={(d) => {
            setState({ data: d, edit: true })
          }}
        />
      </section>
    </Page >
  )
}

export type ConnectState = {
  privileges: PrivilegesModelState
  loading: ConnectLoading
}
export default connect(({ privileges, loading }: ConnectState) => ({ privileges: privileges.data, loading: loading.effects['privileges/get'] }))(PrivilegesList)
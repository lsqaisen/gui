import { useEffect } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { Page } from 'library';
import Table from '@/components/user/user/table';
import { ConnectLoading, Dispatch } from '@/models/connect'
import { UserListModelState, IUser } from '@/models/uesr/user';
import AddUser from './basic/actions/add-user';
import EditUser from './basic/actions/edit-user';
import Actions from './basic/actions';
import { updateUserRequest } from 'api/type/user';

export type UserListProps = {
  current_user: string;
  users: IUser[];
  loading: boolean;
  dispatch: Dispatch<any>;
}

const UserList: React.FC<UserListProps> = ({ loading, current_user, users, dispatch }) => {
  const getUsers = () => dispatch({ type: 'users/get' });
  useEffect(() => { getUsers() }, [])
  return (
    <Page
      className="node-body"
      style={{ minHeight: '100%' }}
      title=""
      routes={[{
        path: '/dashboard',
        breadcrumbName: '总览',
      }, {
        path: `/users/list`,
        breadcrumbName: '用户列表',
      }]}
    >
      <section className="box">
        <header style={{ overflow: 'hidden', marginBottom: 16 }}>
          <div className="fr">
            <Button style={{ marginLeft: 16 }} type="ghost" loading={loading} onClick={getUsers} >刷新</Button>
          </div>
          <div className="fr">
            <AddUser dispatch={dispatch} />
          </div>
        </header>
        <Table
          loading={loading}
          current={current_user}
          data={users}
          actions={<Actions dispatch={dispatch} />}
        >
          <EditUser key="edit" dispatch={dispatch} />
        </Table>
      </section>
    </Page>
  )
}

export type ConnectState = {
  users: UserListModelState;
  loading: ConnectLoading;
}

export default connect(({ users, loading }: ConnectState) => ({ current_user: users.profile!.username, users: users.list, loading: loading.effects['users/get'] }))(UserList)
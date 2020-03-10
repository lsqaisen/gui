import { connect } from 'dva';
import Login from '@/components/login';
import { loginRequest } from 'api/type/auth';
import { Dispatch, ConnectLoading } from '@/models/connect';

export interface WLoginProps {
  loading: boolean;
  dispatch: Dispatch<any>
}

const WLogin = ({ loading, dispatch }: WLoginProps) => {
  const login = (data: loginRequest) => dispatch({ type: `auth/login`, payload: data })
  return (
    <Login
      domains={[]}
      loginLoading={loading}
      onLogin={login}
      modifyPassword={() => null}
      resetLoading={loading!}
      sending={false}
      sendCode={() => null}
      resetPassword={() => null}
    />
  )
}

export type ConnectState = {
  loading: ConnectLoading;
}

export default connect(({ loading }: ConnectState) => ({ loading: loading.effects['auth/login'] }))(WLogin)
import {Effect} from 'dva';
import {Reducer} from 'redux';
import router from 'umi/router';
import {auth} from 'api';
import {message} from 'antd';

export type IToken = {
  access_token: string;
  expires_in: number;
  issued_at: string;
  refresh_token: string;
  token: string;
};

export interface AuthModelState {
  success: boolean;
  token?: IToken;
}

export interface AuthModelType {
  namespace: 'auth';
  state: AuthModelState;
  effects: {
    login: Effect;
    logout: Effect;
    token: Effect;
  };
  reducers: {
    save: Reducer<AuthModelState>;
    update: Reducer<AuthModelState>;
  };
}

const AuthModel: AuthModelType = {
  namespace: 'auth',

  state: {
    success: false,
    token: undefined
  },

  effects: {
    *login({payload}, {call, put}) {
      message.destroy();
      const {data = {}, err} = yield call(auth.login, payload!);
      if (!!err || data.code === 203) {
        if (data.code === 203) {
          message.info(data.error, 0);
          return data.code;
        }
        message.error(err, 0);
      } else {
        yield put({type: 'users/profile'});
        yield put({
          type: 'save',
          payload: {
            success: true
          }
        });
        router.push('/dashboard');
      }
    },
    *logout(_, {put, call}) {
      yield call(auth.logout);
      yield put({
        type: 'save',
        payload: {
          success: false
        }
      });
      yield put({
        type: 'users/save',
        payload: {
          profile: undefined
        }
      });
      router.push('/login');
    },
    *token({payload}, {call, put}) {
      const {data, err} = yield call(auth.login, payload!);
      if (!!err) {
        message.error(err, 0);
      } else {
        yield put({
          type: 'save',
          payload: {
            token: data
          }
        });
      }
    }
  },

  reducers: {
    save(state: any, {payload}: any) {
      return {...state, ...payload};
    },
    update(state: any, {payload}: any) {
      let _update = {...state};
      Object.entries(payload).map(([key, value]: any) => {
        _update = Object.assign(_update, {[key]: {...state[key], ...value}});
      });
      return {
        ...state,
        ..._update
      };
    }
  }
};

export default AuthModel;

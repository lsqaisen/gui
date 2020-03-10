import { Effect, Subscription } from 'dva';
import { Reducer } from 'redux';
import { user } from 'api';
import { message } from 'antd';
import router from 'umi/router';
import debounce from 'lodash.debounce';

export type IUser = {
  id: number;
  created_at: string;
  updated_at: string;
  username: string;
  email: string;
  remark: string;
  expired_at?: string;
  privileges: string;
}

export type IAudit = {
  duration_time: number;
  error: string;
  keywords: string;
  log_id: number;
  op_time: string;
  operation: string;
  repo_name: string;
  resource: string;
  status: number;
  user_id: number;
  username: string;
}

export type IAudits = {
  total: number;
  items: IAudit[];
}

export interface UserListModelState {
  init: boolean;
  profile?: IUser;
  list: IUser[];
  audits: IAudits;
}

export interface UserListModelType {
  namespace: 'users';
  state: UserListModelState;
  subscriptions: {
    setup: Subscription
  };
  effects: {
    profile: Effect;
    audits: Effect;
    get: Effect;
    add: Effect;
    'delete': Effect;
    update: Effect;
    changePassword: Effect;
  };
  reducers: {
    save: Reducer<UserListModelState>;
    update: Reducer<UserListModelState>;
  };
}

const UserListModel: UserListModelType = {
  namespace: 'users',

  state: {
    init: false,
    profile: undefined,
    list: [],
    audits: { total: 0, items: [] },
  },

  subscriptions: {
    setup({ dispatch, history }: any, done: any) {
      if (!window.historyListen) {
        window.historyListen = true;
        history.listen(debounce(async ({ pathname }: any) => {
          let { data = undefined, err = undefined } = await dispatch({ type: 'profile' });
          if (!!data && !err && (pathname === '/login' || pathname === '/')) {
            router.push('/dashboard');
          } else if ((!data || Object.values(data).every(v => !v)) && pathname !== '/login') {
            router.push('/login');
          }
        }, 5000, { leading: true, trailing: false }));
      }
      done(history.unlisten);
    },
  },

  effects: {
    *profile(_, { call, put }) {
      const { data, err } = yield call(user.getCurrentUser);
      if (!!err) {
        yield put({
          type: 'save',
          payload: {
            init: true,
            profile: undefined
          }
        })
      } else {
        yield put({
          type: 'save',
          payload: {
            init: true,
            profile: data
          }
        })
      }
      return { data, err }
    },
    *audits({ payload }, { call, put }) {
      const { data, err } = yield call(user.getAudits, payload);
      if (err) message.error(err)
      else {
        yield put({
          type: 'save',
          payload: {
            audits: data || { total: 0, items: [] }
          },
        });
      }
      return data || { total: 0, items: [] }
    },
    *get(_, { call, put }) {
      const { data, err } = yield call(user.geUsers);
      if (err) message.error(err)
      else {
        yield put({
          type: 'save',
          payload: {
            list: data || []
          },
        });
      }
    },
    *add({ payload }, { call, put }) {
      const { err } = yield call(user.addUser, payload);
      if (err) message.error(err)
      else {
        message.success('用户添加成功', 5);
        yield put({ type: 'get' })
      }
      return err;
    },
    *['delete']({ payload }, { call, put }) {
      const { err } = yield call(user.deleteUser, payload);
      if (err) message.error(err)
      else {
        message.success('删除用户成功', 5);
        yield put({ type: 'get' })
      }
      return err;
    },
    *update({ payload }, { call, put }) {
      const { err } = yield call(user.updateUser, payload);
      if (err) message.error(err)
      else {
        message.success('用户修改成功', 5);
        yield put({ type: 'get' })
      }
      return err;
    },
    *changePassword({ payload }, { call, put }) {
      const { err } = yield call(user.changePassword, payload);
      if (err) message.error(err)
      else {
        message.success('密码修改成功修改成功，用户需重新登陆', 5);
        yield put({ type: 'auth/logout' })
      }
      return err;
    },
  },

  reducers: {
    save(state: any, { payload }: any) {
      return { ...state, ...payload }
    },
    update(state: any, { payload }: any) {
      let _update = { ...state };
      Object.entries(payload).map(([key, value]: any) => {
        _update = Object.assign(_update, { [key]: { ...state[key], ...value } })
      })
      return {
        ...state,
        ..._update,
      }
    },
  },
};

export default UserListModel;
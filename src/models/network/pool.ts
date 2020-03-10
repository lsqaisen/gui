import { Effect } from 'dva';
import { Reducer } from 'redux';
import { network } from 'api';
import { message } from 'antd';

export type INetworkPool = {
  name: string;
  cidr: string;
  created_at: string;
  builtin: boolean;
}

export interface NetworkPoolModelState {
  pools: INetworkPool[];
}

export interface NetworkPoolModelType {
  namespace: 'nwpool';
  state: NetworkPoolModelState;
  effects: {
    get: Effect;
    add: Effect;
    'delete': Effect;
  };
  reducers: {
    save: Reducer<NetworkPoolModelState>;
    update: Reducer<NetworkPoolModelState>;
  };
}

const NetworkPoolModel: NetworkPoolModelType = {
  namespace: 'nwpool',

  state: {
    pools: [],
  },

  effects: {
    *get(_, { call, put }) {
      const { data, err } = yield call(network.getPools);
      if (err) message.error(err)
      else {
        yield put({
          type: 'save',
          payload: {
            pools: data || []
          },
        });
      }
      return data || []
    },
    *add({ payload }, { call, put }) {
      const { err } = yield call(network.addPool, payload);
      if (err) message.error(err)
      else {
        message.success('IP资源池添加成功', 5);
        yield put({ type: 'get' })
      }
      return err;
    },
    *['delete']({ payload }, { call, put }) {
      const { err } = yield call(network.deletePool, payload);
      if (err) message.error(err)
      else {
        message.success('删除IP资源池成功', 5);
        yield put({ type: 'get' })
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

export default NetworkPoolModel;
import { Effect } from 'dva';
import { Reducer } from 'redux';
import { message } from 'antd';
import { apps } from 'api';
import { NlbRequest } from 'api/type/app';

export interface INlb extends NlbRequest {
  ip: string;
}

export interface NlbModelState {
  data: {
    [key: string]: INlb[]
  };
}

export interface NlbModelType {
  namespace: 'nlb';
  state: NlbModelState;
  effects: {
    get: Effect;
    create: Effect;
    'delete': Effect;
  };
  reducers: {
    save: Reducer<NlbModelState>;
    update: Reducer<NlbModelState>;
  };
}


const NlbModel: NlbModelType = {
  namespace: 'nlb',
  state: {
    data: {}
  },

  effects: {
    *get({ payload }, { call, put }) {
      const { data, err } = yield call(apps.getNlbList, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        yield put({
          type: 'update',
          payload: {
            data: {
              [payload]: data || {}
            },
          }
        });
      }
    },
    *create({ payload }, { call, put }) {
      const { err } = yield call(apps.addNlb, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        message.success('添加网路负载均衡成功', 5);
        yield put({ type: 'get', payload: payload.namespace })
      }
      return err
    },
    *['delete']({ payload }, { call, put }) {
      const { err } = yield call(apps.deleteNlb, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        message.success('删除网路负载均成功', 5);
        yield put({ type: 'get', payload: payload.namespace })
      }
      return err
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
}

export default NlbModel;
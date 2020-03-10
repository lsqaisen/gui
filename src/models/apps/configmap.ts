import { EffectsCommandMap, Effect } from 'dva';
import { AnyAction, Reducer } from 'redux';
import { message } from 'antd';
import { apps } from 'api';

export type IConfigMap = {
  creation_timestamp: string
  binary_data?: { [key: string]: any }
  data: { [key: string]: any }
  name: string
  namespace: string
}

export interface ConfigMapModelState {
  data: { [key: string]: IConfigMap[] }
}

export interface ConfigMapModelType {
  namespace: 'configmap';
  state: ConfigMapModelState;
  effects: {
    get: Effect;
    create: Effect;
    [`delete`]: Effect;
  };
  reducers: {
    save: Reducer<ConfigMapModelState>;
    update: Reducer<ConfigMapModelState>;
  };
}

const ConfigMapModel: ConfigMapModelType = {
  namespace: 'configmap',
  state: {
    data: {},
  },

  effects: {
    *get({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
      const { data, err } = yield call(apps.getConfigMaps, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        yield put({
          type: 'save',
          payload: {
            data: {
              [payload]: data || []
            }
          }
        });
      }
      return data || []
    },
    *create({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
      const { err } = yield call(apps.addConfigMap, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        message.success('添加配置管理成功', 5);
        yield put({ type: 'get', payload: payload.namespace })
      }
      return err
    },
    *[`delete`]({ payload }: AnyAction, { put, call }: EffectsCommandMap) {
      const { err } = yield call(apps.deleteConfigMap, payload);
      if (!!err) {
        message.error(err, 5);
        return err;
      } else {
        message.success('删除配置管理成功', 5);
        yield put({ type: 'get', payload: payload.namespace })
      }
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

export default ConfigMapModel;
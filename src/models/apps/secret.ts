import { EffectsCommandMap, Effect } from 'dva';
import { AnyAction, Reducer } from 'redux';
import { message } from 'antd';
import { apps } from 'api';

export type ISecret = {
  metadata: {
    name: string;
    namespace: string;
    selfLink: string;
    uid: string;
    resourceVersion: string;
    creationTimestamp: string;
    annotations: { [key: string]: any };
  };
  data: { [key: string]: any };
  type: string;
}

export interface SecretModelState {
  data: { [key: string]: ISecret[] }
}

export interface SecretModelType {
  namespace: 'secret';
  state: SecretModelState;
  effects: {
    get: Effect;
    create: Effect;
    [`delete`]: Effect;
  };
  reducers: {
    save: Reducer<SecretModelState>;
    update: Reducer<SecretModelState>;
  };
}

const SecretModel: SecretModelType = {
  namespace: 'secret',
  state: {
    data: {},
  },

  effects: {
    *get({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
      const { data, err } = yield call(apps.getSecrets, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        yield put({
          type: 'save',
          payload: {
            data: {
              [payload]: (data || []).filter((v: ISecret) => ["Opaque", "kubernetes.io/tls"].includes(v.type))
            }
          }
        });
      }
      return data || [];
    },
    *create({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
      const { err } = yield call(apps.addSecret, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        message.success('添加证书成功', 5);
        yield put({ type: 'get', payload: payload.namespace })
      }
      return err
    },
    *[`delete`]({ payload }: AnyAction, { put, call }: EffectsCommandMap) {
      const { err } = yield call(apps.deleteSecret, payload);
      if (!!err) {
        message.error(err, 5);
        return err;
      } else {
        message.success('删除证书成功', 5);
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

export default SecretModel;
import { Effect } from 'dva';
import { Reducer } from 'redux';
import { message } from 'antd';
import { apps } from 'api';
import { IngressRequest } from 'api/type/app';


export type IIngressRulePath = {
  backend: {
    serviceName: string;
    servicePort: {
      intVal: number;
      strVal: string;
      type: number;
    };
  };
  path: string;
}

export type IIngressRule = {
  host: string;
  http: {
    paths: IIngressRulePath[];
  };
}

export type IIngressTL = {
  hosts: string[];
  secretName: string;
}

export type IIngressStatus = {
  loadBalancer: {
    ingress: {
      hostname: string;
      ip: string;
    }[];
  };
}

export interface IIngress extends IngressRequest {
  ip: string;
}

export interface IngressModelState {
  data: {
    [key: string]: IIngress[]
  };
}

export interface IngressModelType {
  namespace: 'ingress';
  state: IngressModelState;
  effects: {
    get: Effect;
    create: Effect;
    'delete': Effect;
    modify: Effect;
  };
  reducers: {
    save: Reducer<IngressModelState>;
    update: Reducer<IngressModelState>;
  };
}


const IngressModel: IngressModelType = {
  namespace: 'ingress',
  state: {
    data: {}
  },

  effects: {
    *get({ payload }, { call, put }) {
      const { data, err } = yield call(apps.getIngresses, payload);
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
      const { err } = yield call(apps.addIngress, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        message.success('添加应用负载均衡成功', 5);
        yield put({ type: 'get', payload: payload.namespace })
      }
      return err
    },
    *['delete']({ payload }, { call, put }) {
      const { err } = yield call(apps.deleteIngress, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        message.success('删除应用负载均成功', 5);
        yield put({ type: 'get', payload: payload.namespace })
      }
      return err
    },
    *modify({ payload }, { call, put }) {
      console.log(payload)
      const { err } = yield call(apps.modifyIngressRules, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        message.success('修改应用负载均成功', 5);
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

export default IngressModel;
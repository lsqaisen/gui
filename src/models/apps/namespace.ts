import {Effect} from 'dva';
import {Reducer} from 'redux';
import {message} from 'antd';
import {apps} from 'api';
import {delay} from '@/utils/index';

export type NamespaceCondition = {
  lastTransitionTime: string;
  message: string;
  reason: string;
  status: 'True' | 'False' | 'Unknown';
  type: string;
};

export type INs = {
  metadata: {
    name: string;
    selfLink: string;
    uid: string;
    resourceVersion: string;
    creationTimestamp: string;
  };
  spec: {
    finalizers: string[];
  };
  status: {
    // conditions?: NamespaceCondition[]
    phase: 'Active' | 'Terminating';
  };
};

export interface NamespaceModelState {
  error?: string;
  nslist: {
    metadata: {
      selfLink: string;
      resourceVersion: string;
    };
    items: INs[];
  };
}

export interface NamespaceModelType {
  namespace: 'namespace';
  state: NamespaceModelState;
  effects: {
    get: Effect;
    create: Effect;
    delete: Effect;
  };
  reducers: {
    save: Reducer<NamespaceModelState>;
    update: Reducer<NamespaceModelState>;
  };
}

const NamespaceModel: NamespaceModelType = {
  namespace: 'namespace',
  state: {
    error: undefined,
    nslist: {
      metadata: {
        selfLink: '',
        resourceVersion: '',
      },
      items: [],
    },
  },

  effects: {
    *get(_, {call, put}) {
      const {data, err} = yield call(apps.getNamespaces);
      if (!!err) {
        message.error(err, 5);
        yield put({
          type: 'save',
          payload: {
            error: err,
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            error: undefined,
            nslist: data || {items: []},
          },
        });
      }
      return data || {items: []};
    },
    *create({payload}, {call, put}) {
      const {err} = yield call(apps.addNamespace, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        message.success('添加命名空间成功', 5);
        // yield put({type: 'get'});
      }
      return err;
    },
    *['delete']({payload}, {call, put}) {
      const {err} = yield call(apps.deleteNamespace, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        message.success('删除命名空间成功', 5);
        yield put({type: 'get'});
      }
      return err;
    },
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
        ..._update,
      };
    },
  },
};

export default NamespaceModel;

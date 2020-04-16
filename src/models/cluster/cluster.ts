import {EffectsCommandMap} from 'dva';
import {AnyAction} from 'redux';
import {message} from 'antd';
import {Effect} from 'dva';
import {Reducer} from 'redux';
import {cluster} from 'api';

export interface INode {
  key: number;
  unschedulable: boolean;
  addresses: {
    type: 'ExternalIP' | 'InternalIP' | 'Hostname';
    address: string;
  }[];
  allocatable: {
    cpu: number;
    'ephemeral-storage': number;
    'hugepages-1Gi': number;
    'hugepages-2Mi': number;
    memory: number;
    pods: number;
  };
  allocated: {
    cpu: number;
    memory: number;
  };
  capacity: {
    cpu: number;
    'ephemeral-storage': number;
    'hugepages-1Gi': number;
    'hugepages-2Mi': number;
    memory: number;
    pods: number;
  };
  metadata: {
    annotations: {[key: string]: any};
    creationTimestamp: string;
    labels: {[key: string]: any};
    name: string;
    resourceVersion: string;
    selfLink: string;
    uid: string;
  };
  nodeInfo: {[key: string]: any};
  pods: number;
  status: 'Ready' | 'Pendding' | 'Running';
  usages: {
    cpu: number;
    memory: number;
  };
}

export interface IPod {
  key: number;
  hostIP: string;
  capacity: {
    cpu: number;
    memory: number;
  };
  containers: string[];
  metadata: {
    annotations: {[key: string]: any};
    creationTimestamp: string;
    generateName: string;
    labels: {[key: string]: any};
    name: string;
    namespace: string;
    ownerReferences: {[key: string]: any}[];
    resourceVersion: string;
    selfLink: string;
    uid: string;
  };
  podIP: string;
  restartCount: number;
  status: string;
}

export interface ClusterModelState {
  nodes: INode[];
  details: {[key: string]: INode[]};
  pods: {[key: string]: IPod[]};
}

export interface ClusterModelType {
  namespace: 'cluster';
  state: ClusterModelState;
  effects: {
    get: Effect;
    node: Effect;
    add: Effect;
    action: Effect;
    [`delete`]: Effect;
    pods: Effect;
  };
  reducers: {
    save: Reducer<ClusterModelState>;
    update: Reducer<ClusterModelState>;
  };
}

const ClusterModel: ClusterModelType = {
  namespace: 'cluster',
  state: {
    nodes: [],
    details: {},
    pods: {}
  },

  effects: {
    *get(_: AnyAction, {call, put}: EffectsCommandMap) {
      const {data, err} = yield call(cluster.getNodes);
      if (!!err) {
        message.error(err, 5);
      } else {
        yield put({
          type: 'save',
          payload: {
            nodes: data || []
          }
        });
      }
    },
    *node({payload}: AnyAction, {call, put}: EffectsCommandMap) {
      const {data, err} = yield call(cluster.getNode, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        yield put({
          type: 'save',
          payload: {
            details: {
              [payload]: data || {}
            }
          }
        });
      }
    },
    *add({payload}: AnyAction, {put, call}: EffectsCommandMap) {
      const {err} = yield call(cluster.addNodes, payload);
      if (!!err) {
        message.error(err, 5);
        return err;
      } else {
        message.success('添加节点成功', 5);
        yield put({type: 'install/get'});
      }
    },
    *action({payload}: AnyAction, {put, call}: EffectsCommandMap) {
      const {err} = yield call(cluster.ctrlNodeStatus, payload);
      if (!!err) {
        message.error(err, 5);
        return err;
      } else {
        message.success('节点操作成功', 5);
        yield put({type: 'get'});
      }
    },
    *[`delete`]({payload}: AnyAction, {put, call}: EffectsCommandMap) {
      const {err} = yield call(cluster.deleteNode, payload);
      if (!!err) {
        message.error(err, 5);
        return err;
      } else {
        message.success('移除节点成功', 5);
        yield put({type: 'get'});
      }
    },
    *pods({payload}: AnyAction, {put, call}: EffectsCommandMap) {
      const {data, err} = yield call(cluster.getNodePods, payload);
      if (!!err) {
        message.error(err, 5);
        return err;
      } else {
        yield put({
          type: 'save',
          payload: {
            pods: {[payload]: data}
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

export default ClusterModel;

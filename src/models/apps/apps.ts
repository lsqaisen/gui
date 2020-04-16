import {Effect} from 'dva';
import {Reducer} from 'redux';
import {message} from 'antd';
import {apps} from 'api';
import {App, Service} from 'api/type/app';

export interface IEvent {
  count: number;
  eventTime: string;
  firstTimestamp: string;
  involvedObject: {
    apiVersion: string;
    fieldPath: string;
    kind: string;
    name: string;
    namespace: string;
    resourceVersion: string;
    uid: string;
  };
  lastTimestamp: string;
  message: string;
  metadata: {
    creationTimestamp: string;
    name: string;
    namespace: string;
    resourceVersion: string;
    selfLink: string;
    uid: string;
  };
  reason: string;
  reportingComponent: string;
  reportingInstance: string;
  source: {
    component: string;
    host: string;
  };
  type: string;
}

export interface IVersion {
  current: boolean;
  detail: string;
  name: string;
  upgrade_time: string;
  version: string;
}

export interface IService extends Service {
  name: string;
}

export interface IContainer {
  name: string;
  id: string;
  image: string;
  restart_count: number;
  status: string;
}

export interface IInstance {
  containers: IContainer[];
  create_time: string;
  duration: string;
  ip: string;
  name: string;
  node_ip: string;
  restart_count: number;
  status: string;
}

export interface IApp extends App {
  instances: IInstance[];
  ready: number;
  create_time: string;
}

export interface AppsModelState {
  data: {[key: string]: IApp[]};
  details: {[key: string]: IApp};
  metrics: {[key: string]: IApp};
  services: {[key: string]: IService[]};
  serviceDetials: {[key: string]: IService};
  yamls: {[key: string]: string};
  versions: {[key: string]: IVersion[]};
  events: {[key: string]: IEvent[]};
}

export interface AppsModelType {
  namespace: 'apps';
  state: AppsModelState;
  effects: {
    get: Effect;
    detail: Effect;
    services: Effect;
    service: Effect;
    modifyService: Effect;
    metrics: Effect;
    create: Effect;
    modify: Effect;
    delete: Effect;
    modifyReplicas: Effect;
    export: Effect;
    import: Effect;
    versions: Effect;
    events: Effect;
    deletePod: Effect;
  };
  reducers: {
    save: Reducer<AppsModelState>;
    update: Reducer<AppsModelState>;
  };
}

const AppsModel: AppsModelType = {
  namespace: 'apps',
  state: {
    data: {},
    details: {},
    metrics: {},
    services: {},
    serviceDetials: {},
    yamls: {},
    versions: {},
    events: {}
  },

  effects: {
    *get({payload}, {call, put}) {
      const {data, err} = yield call(apps.getApps, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        yield put({
          type: 'update',
          payload: {
            data: {
              [payload]: data || []
            }
          }
        });
      }
      return data || [];
    },
    *detail({payload}, {call, put}) {
      const {data, err} = yield call(apps.getAppDetail, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        yield put({
          type: 'update',
          payload: {
            details: {
              [`${payload.name}${payload.namespace}`]: data || {}
            }
          }
        });
      }
      return data || {};
    },
    *services({payload}, {call, put}) {
      const {data, err} = yield call(apps.getServices, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        yield put({
          type: 'update',
          payload: {
            services: {
              [payload]: data || {}
            }
          }
        });
      }
      return data || [];
    },
    *service({payload}, {call, put}) {
      const {data, err} = yield call(apps.getService, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        yield put({
          type: 'update',
          payload: {
            serviceDetials: {
              [`${payload.name}${payload.namespace}`]: data || {}
            }
          }
        });
      }
      return data || [];
    },
    *metrics({payload}, {call, put}) {
      const {data, err} = yield call(apps.getMetrics, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        yield put({
          type: 'update',
          payload: {
            metrics: {
              [`${payload.name}${payload.namespace}`]: data || []
            }
          }
        });
      }
      return data || [];
    },
    *create({payload}, {call, put}) {
      const {err} = yield call(apps.createApp, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        message.success('添加服务成功', 5);
        yield put({type: 'get', payload: payload.namespace});
      }
      return err;
    },
    *modify({payload}, {call, put}) {
      const {err} = yield call(apps.modifyApp, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        message.success('修改应用成功', 5);
        if (payload.instances) {
          yield put({type: 'detail', payload});
        } else {
          yield put({type: 'get', payload: payload.namespace});
        }
      }
      return err;
    },
    *modifyService({payload}, {call, put}) {
      const {err} = yield call(apps.modifyService, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        message.success('修改服务成功', 5);
        yield put({type: 'service', payload});
      }
      return err;
    },
    *[`delete`]({payload}, {put, call}) {
      const {err} = yield call(apps.deleteApp, payload);
      if (!!err) {
        message.error(err, 5);
        return err;
      } else {
        message.success('删除服务成功', 5);
        yield put({type: 'get', payload: payload.namespace});
      }
    },
    *modifyReplicas({payload}, {put, call}) {
      const {err} = yield call(apps.modifyReplicas, payload);
      if (!!err) {
        message.error(err, 5);
        return err;
      } else {
        message.success('修改实例数量成功', 5);
        if (payload.instances) {
          yield put({type: 'detail', payload});
        } else {
          yield put({type: 'get', payload: payload.namespace});
        }
      }
    },
    *[`export`]({payload}, {call, put}) {
      const {data, err} = yield call(apps.exportApp, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        yield put({
          type: 'update',
          payload: {
            yamls: {
              [`${payload.name}${payload.namespace}`]: data || ''
            }
          }
        });
      }
      return data || '';
    },
    *[`import`]({payload}, {call, put}) {
      const {err} = yield call(apps.importApp, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        message.success('添加服务成功', 5);
        yield put({type: 'get', payload: payload.namespace});
      }
      return err;
    },
    *versions({payload}, {call, put}) {
      const {data, err} = yield call(apps.getAppHistoryVersion, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        yield put({
          type: 'update',
          payload: {
            versions: {
              [`${payload.name}${payload.namespace}`]: data || {}
            }
          }
        });
      }
      return data || {};
    },
    *events({payload}, {call, put}) {
      const {data, err} = yield call(apps.getAppEvent, payload);
      if (!!err) {
        message.error(err, 5);
      } else {
        yield put({
          type: 'update',
          payload: {
            events: {
              [`${payload.name}${payload.namespace}`]: data || {}
            }
          }
        });
      }
      return data || {};
    },
    *deletePod({payload}, {put, call}) {
      const {err} = yield call(apps.deletePod, payload);
      if (!!err) {
        message.error(err, 5);
        return err;
      } else {
        message.success('Pod开始重建', 5);
      }
      return err;
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

export default AppsModel;

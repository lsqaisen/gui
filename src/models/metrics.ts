import { Effect } from 'dva';
import { Reducer } from 'redux';
import { metrics } from 'api';
import { message } from 'antd';

export interface IResources {
  capacity: {
    "cpu": number;
    "ephemeral-storage": number;
    "hugepages-1Gi": number;
    "hugepages-2Mi": number;
    "memory": number;
    "pods": number;
  },
  "usages": {
    "cpu": number;
    "memory": number;
  }
}

export interface IDetail {
  cluster_id: string;
  platform: string;
  version: string;
}

export interface IInventory {
  all_nodes: number;
  all_pods: number;
  health_nodes: number;
  health_pods: number;
}

export type IMetrics = {
  detail: IDetail;
  inventory: IInventory;
  resources: IResources;
}

export interface MetricsModelState {
  details?: IMetrics
}

export interface MetricsModelType {
  namespace: 'metrics';
  state: MetricsModelState;
  effects: {
    details: Effect;
  };
  reducers: {
    save: Reducer<MetricsModelState>;
    update: Reducer<MetricsModelState>;
  };
}

const MetricsModel: MetricsModelType = {
  namespace: 'metrics',

  state: {
    details: undefined,
  },

  effects: {
    *details(_, { call, put }) {
      const { data, err } = yield call(metrics.getDetails);
      if (err) message.error(err)
      else {
        yield put({
          type: 'save',
          payload: {
            details: data
          },
        });
      }
      return data
    }
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

export default MetricsModel;
import {Effect} from 'dva';
import {Reducer} from 'redux';
import {registry} from 'api';
import {message} from 'antd';

export type ILog = {
  log_id: number;
  op_time: string;
  operation: string;
  project_id: number;
  repo_name: string;
  repo_tag: string;
  user_id: string;
  username: string;
};

export type ILogs = {
  total: number;
  items: ILog[];
};

export interface LogsModelState {
  data: ILogs;
}

export interface LogsModelType {
  namespace: 'logs';
  state: LogsModelState;
  effects: {
    get: Effect;
  };
  reducers: {
    save: Reducer<LogsModelState>;
    update: Reducer<LogsModelState>;
  };
}

const LogsModel: LogsModelType = {
  namespace: 'logs',

  state: {
    data: {
      total: 0,
      items: []
    }
  },

  effects: {
    *get({payload}, {call, put}) {
      const {data, err} = yield call(registry.getLogs, payload);
      if (err) message.error(err);
      else {
        yield put({
          type: 'save',
          payload: {
            data: data || {total: 0, items: []}
          }
        });
      }
      return data || {total: 0, items: []};
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

export default LogsModel;

import {EffectsCommandMap} from 'dva';
import {AnyAction} from 'redux';
import {message} from 'antd';
import {Effect} from 'dva';
import {Reducer} from 'redux';
import {cluster} from 'api';

export interface InstallModelState {
  runningstatus: boolean;
}

export interface InstallModelType {
  namespace: 'install';
  state: InstallModelState;
  effects: {
    get: Effect;
  };
  reducers: {
    save: Reducer<InstallModelState>;
    update: Reducer<InstallModelState>;
  };
}

const InstallModel: InstallModelType = {
  namespace: 'install',
  state: {
    runningstatus: false
  },

  effects: {
    *get(_: AnyAction, {call, put}: EffectsCommandMap) {
      const {data, err} = yield call(cluster.getRunningStatusofInstall);
      if (!!err) {
        message.error(err, 5);
      } else {
        yield put({
          type: 'save',
          payload: {
            runningstatus: data ? data.running : false
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

export default InstallModel;

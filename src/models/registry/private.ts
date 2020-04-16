import {Effect} from 'dva';
import {Reducer} from 'redux';
import {registry} from 'api';
import {message} from 'antd';

export type IPrivate = {
  created_at: string;
  domain: string;
  password: string;
  username: string;
};

export interface PrivateModelState {
  data: IPrivate[];
}

export interface PrivateModelType {
  namespace: 'private';
  state: PrivateModelState;
  effects: {
    get: Effect;
    add: Effect;
    delete: Effect;
  };
  reducers: {
    save: Reducer<PrivateModelState>;
    update: Reducer<PrivateModelState>;
  };
}

const PrivateModel: PrivateModelType = {
  namespace: 'private',

  state: {
    data: []
  },

  effects: {
    *get(_, {call, put}) {
      const {data, err} = yield call(registry.getPrivates);
      if (err) message.error(err);
      else {
        yield put({
          type: 'save',
          payload: {
            data: data || []
          }
        });
      }
    },
    *add({payload}, {call, put}) {
      const {err} = yield call(registry.addPrivate, payload);
      if (err) message.error(err);
      else {
        message.success('仓库账号添加成功', 5);
        yield put({type: 'get'});
      }
      return err;
    },
    *['delete']({payload}, {call, put}) {
      const {err} = yield call(registry.deletePrivate, payload);
      if (err) message.error(err);
      else {
        message.success('删除仓库账号成功', 5);
        yield put({type: 'get'});
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

export default PrivateModel;

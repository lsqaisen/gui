import {Effect} from 'dva';
import {Reducer} from 'redux';
import {network} from 'api';
import {message} from 'antd';

export type INetworkVip = {
  addresses: string[];
  name: string;
  protocol: string;
};

export interface NetworkVipModelState {
  vips: INetworkVip[];
}

export interface NetworkVipModelType {
  namespace: 'nwvip';
  state: NetworkVipModelState;
  effects: {
    get: Effect;
    add: Effect;
    delete: Effect;
  };
  reducers: {
    save: Reducer<NetworkVipModelState>;
    update: Reducer<NetworkVipModelState>;
  };
}

const NetworkVipModel: NetworkVipModelType = {
  namespace: 'nwvip',

  state: {
    vips: []
  },

  effects: {
    *get(_, {call, put}) {
      const {data, err} = yield call(network.getVips);
      if (err) message.error(err);
      else {
        yield put({
          type: 'save',
          payload: {
            vips: data || []
          }
        });
      }
      return data || [];
    },
    *add({payload}, {call, put}) {
      const {err} = yield call(network.addVip, payload);
      if (err) message.error(err);
      else {
        message.success('负载均衡vip添加成功', 5);
        yield put({type: 'get'});
      }
      return err;
    },
    *['delete']({payload}, {call, put}) {
      const {err} = yield call(network.deleteVip, payload);
      if (err) message.error(err);
      else {
        message.success('删除负载均衡vip成功', 5);
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

export default NetworkVipModel;

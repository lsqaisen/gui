import {Effect} from 'dva';
import {Reducer} from 'redux';
import {user} from 'api';
import {message} from 'antd';

export enum PrivilegeModes {
  '查看' = 'c',
  '创建' = 'r',
  '更新' = 'u',
  '删除' = 'd'
}

export type IPrivilege = {
  module: string;
  modes: PrivilegeModes[];
};

export interface PrivilegesModelState {
  data: IPrivilege[];
}

export interface PrivilegesModelType {
  namespace: 'privileges';
  state: PrivilegesModelState;
  effects: {
    get: Effect;
  };
  reducers: {
    save: Reducer<PrivilegesModelState>;
    update: Reducer<PrivilegesModelState>;
  };
}

export const privilegesToString = (privileges: IPrivilege[]): string => {
  return privileges
    .filter(p => !!p.modes && p.modes.length > 0)
    .map(p => `${p.module}:${p.modes.join('')}`)
    .join('|');
};

export const stringToPrivileges = (privileges: string): IPrivilege[] => {
  return privileges
    ? privileges.split('|').map(v => {
        const data = v.split(':');
        return {
          module: data[0],
          modes: data[1].split('')
        } as IPrivilege;
      })
    : [];
};

const PrivilegesModel: PrivilegesModelType = {
  namespace: 'privileges',

  state: {
    data: []
  },

  effects: {
    *get(_, {call, put}) {
      const {data, err} = yield call(user.getPrivileges);
      if (err) message.error(err);
      else {
        yield put({
          type: 'save',
          payload: {
            data: data || []
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

export default PrivilegesModel;

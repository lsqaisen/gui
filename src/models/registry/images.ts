import { Effect } from 'dva';
import { Reducer } from 'redux';
import { registry } from 'api';
import { message } from 'antd';

type Item = {
  repository_id: number;
  name: string;
  pull_count: number;
  tag: string;
  size: number;
  digest: string;
  is_public: boolean;
  locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface IImage extends Item {
  tag_conut: number
}

export interface ITag extends Item { }

export interface RegistryModelState {
  images: {
    total: number;
    items: IImage[];
  };
  tags: { [key: string]: ITag[] }
}

export interface RegistryModelType {
  namespace: 'registry';
  state: RegistryModelState;
  effects: {
    getImages: Effect;
    getTags: Effect;
    changeStatus: Effect;
    deleteImage: Effect;
  };
  reducers: {
    save: Reducer<RegistryModelState>;
    update: Reducer<RegistryModelState>;
  };
}

const RegistryModel: RegistryModelType = {
  namespace: 'registry',

  state: {
    images: {
      total: 0,
      items: [],
    },
    tags: {},
  },

  effects: {
    *getImages({ payload }, { call, put }) {
      const { data, err } = yield call(registry.getImages, payload);
      if (err) message.error(err)
      else {
        yield put({
          type: 'save',
          payload: {
            images: data || { total: 0, items: [] }
          },
        });
      }
      return data || { total: 0, items: [] }
    },
    *getTags({ payload }, { call, put }) {
      const { data, err } = yield call(registry.getTags, payload);
      if (err) message.error(err)
      else {
        yield put({
          type: 'update',
          payload: {
            tags: {
              [payload]: data || []
            }
          },
        });
      }
      return data || []
    },
    *changeStatus({ payload }, { call }) {
      const { err } = yield call(registry.changeStatus, payload);
      if (err) message.error(err)
      else {
        if (!!payload.tag) {
          message.success('镜像状态更新成功', 5);
        } else {
          message.success('镜像Tag状态更新成功', 5);
        }
      }
      return err;
    },
    *deleteImage({ payload }, { call, put }) {
      const { err } = yield call(registry.deleteImage, payload);
      if (err) message.error(err)
      else {
        if (!!payload.tag) {
          message.success('删除镜像更新成功', 5);
        } else {
          message.success('删除镜像Tag更新成功', 5);
        }
      }
      return err;
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
};

export default RegistryModel;
export type IMenuBasic = {
  key: string;
  name: string;
  path: string;
};

export interface IMenu extends IMenuBasic {
  childs?: IMenuBasic[];
}

export interface MenusModelState {
  data: IMenu[];
}

export interface MenusModelType {
  namespace: 'menus';
  state: MenusModelState;
}

const MenusModel: MenusModelType = {
  namespace: 'menus',
  state: {
    data: [
      {
        key: 'dashboard',
        name: '总览',
        path: '/dashboard',
      },
      {
        key: 'cluster',
        name: '集群管理',
        path: '/cluster',
      },
      {
        key: 'apps',
        name: '应用管理',
        path: '/apps',
        childs: [
          {
            key: 'list',
            name: '应用列表',
            path: '/list',
          },
          {
            key: 'ingress',
            name: '应用负载均衡',
            path: '/ingress',
          },
          {
            key: 'nlb',
            name: '网络负载均衡',
            path: '/nlb',
          },
          {
            key: 'configmap',
            name: '配置管理',
            path: '/configmap',
          },
          {
            key: 'secret',
            name: '证书管理',
            path: '/secret',
          },
          {
            key: 'topology',
            name: '应用拓扑图',
            path: '/topology',
          },
        ],
      },
      {
        key: 'network',
        name: '网络管理',
        path: '/network',
        childs: [
          {
            key: 'pool',
            name: 'IP资源池',
            path: '/pool',
          },
          {
            key: 'vip',
            name: '负载均衡vip',
            path: '/vip',
          },
        ],
      },
      {
        key: 'registry',
        name: '镜像管理',
        path: '/registry',
        childs: [
          {
            key: 'images',
            name: '镜像列表',
            path: '/images',
          },
          {
            key: 'private',
            name: '外部仓库',
            path: '/private',
          },
          {
            key: 'logs',
            name: '操作日志',
            path: '/logs',
          },
        ],
      },
      {
        key: 'user',
        name: '用户管理',
        path: '/user',
        childs: [
          {
            key: 'list',
            name: '用户列表',
            path: '/list',
          },
          {
            key: 'audits',
            name: '审计日志',
            path: '/audits',
          },
        ],
      },
    ],
  },
};

export default MenusModel;

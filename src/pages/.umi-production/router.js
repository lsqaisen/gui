import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import _dvaDynamic from 'dva/dynamic';

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__index" */ '../../layouts/index.tsx'),
        })
      : require('../../layouts/index.tsx').default,
    routes: [
      {
        path: '/apps/configmap',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__apps__configmap__index" */ '../apps/configmap/index.tsx'),
            })
          : require('../apps/configmap/index.tsx').default,
      },
      {
        path: '/apps/secret',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__apps__secret__index" */ '../apps/secret/index.tsx'),
            })
          : require('../apps/secret/index.tsx').default,
      },
      {
        path: '/apps/ingress',
        exact: false,
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__apps__ingress___layout" */ '../apps/ingress/_layout.tsx'),
            })
          : require('../apps/ingress/_layout.tsx').default,
        routes: [
          {
            path: '/apps/ingress',
            exact: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__apps__ingress___layout" */ '../apps/ingress/index.tsx'),
                })
              : require('../apps/ingress/index.tsx').default,
          },
          {
            path: '/apps/ingress/:detail',
            exact: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__apps__ingress___layout" */ '../apps/ingress/$detail/index.tsx'),
                })
              : require('../apps/ingress/$detail/index.tsx').default,
          },
        ],
      },
      {
        path: '/apps/list',
        exact: false,
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__apps__list___layout" */ '../apps/list/_layout.tsx'),
            })
          : require('../apps/list/_layout.tsx').default,
        routes: [
          {
            path: '/apps/list',
            exact: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__apps__list___layout" */ '../apps/list/index.tsx'),
                })
              : require('../apps/list/index.tsx').default,
          },
          {
            path: '/apps/list/:detail',
            exact: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__apps__list___layout" */ '../apps/list/$detail/index.tsx'),
                })
              : require('../apps/list/$detail/index.tsx').default,
          },
        ],
      },
      {
        path: '/apps/nlb',
        exact: false,
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__apps__nlb___layout" */ '../apps/nlb/_layout.tsx'),
            })
          : require('../apps/nlb/_layout.tsx').default,
        routes: [
          {
            path: '/apps/nlb',
            exact: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__apps__nlb___layout" */ '../apps/nlb/index.tsx'),
                })
              : require('../apps/nlb/index.tsx').default,
          },
          {
            path: '/apps/nlb/:detail',
            exact: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__apps__nlb___layout" */ '../apps/nlb/$detail/index.tsx'),
                })
              : require('../apps/nlb/$detail/index.tsx').default,
          },
        ],
      },
      {
        path: '/dashboard',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__dashboard__index" */ '../dashboard/index.tsx'),
            })
          : require('../dashboard/index.tsx').default,
      },
      {
        path: '/log/install',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__log__install" */ '../log/install.tsx'),
            })
          : require('../log/install.tsx').default,
      },
      {
        path: '/log/pod/:name',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__log__pod___name" */ '../log/pod/$name.tsx'),
            })
          : require('../log/pod/$name.tsx').default,
      },
      {
        path: '/login',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__login__index" */ '../login/index.tsx'),
            })
          : require('../login/index.tsx').default,
      },
      {
        path: '/network/pool',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__network__pool__index" */ '../network/pool/index.tsx'),
            })
          : require('../network/pool/index.tsx').default,
      },
      {
        path: '/network/vip',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__network__vip__index" */ '../network/vip/index.tsx'),
            })
          : require('../network/vip/index.tsx').default,
      },
      {
        path: '/registry/images',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__registry__images__index" */ '../registry/images/index.tsx'),
            })
          : require('../registry/images/index.tsx').default,
      },
      {
        path: '/registry/logs',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__registry__logs__index" */ '../registry/logs/index.tsx'),
            })
          : require('../registry/logs/index.tsx').default,
      },
      {
        path: '/registry/private',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__registry__private__index" */ '../registry/private/index.tsx'),
            })
          : require('../registry/private/index.tsx').default,
      },
      {
        path: '/terminal/pod/:name',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__terminal__pod___name" */ '../terminal/pod/$name.tsx'),
            })
          : require('../terminal/pod/$name.tsx').default,
      },
      {
        path: '/user/audits',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__user__audits__index" */ '../user/audits/index.tsx'),
            })
          : require('../user/audits/index.tsx').default,
      },
      {
        path: '/user/list',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__user__list__index" */ '../user/list/index.tsx'),
            })
          : require('../user/list/index.tsx').default,
      },
      {
        path: '/user/privileges',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__user__privileges__index" */ '../user/privileges/index.tsx'),
            })
          : require('../user/privileges/index.tsx').default,
      },
      {
        path: '/cluster',
        exact: false,
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__cluster___layout" */ '../cluster/_layout.tsx'),
            })
          : require('../cluster/_layout.tsx').default,
        routes: [
          {
            path: '/cluster',
            exact: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__cluster___layout" */ '../cluster/index.tsx'),
                })
              : require('../cluster/index.tsx').default,
          },
          {
            path: '/cluster/:detail',
            exact: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__cluster___layout" */ '../cluster/$detail/index.tsx'),
                })
              : require('../cluster/$detail/index.tsx').default,
          },
        ],
      },
    ],
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return <Router history={history}>{renderRoutes(routes, props)}</Router>;
  }
}

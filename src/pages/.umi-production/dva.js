import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  
  app.model({ namespace: 'apps', ...(require('/Users/aisen/go/src/git.kubeup.cn/kubelite/kubelite/gui/src/models/apps/apps.ts').default) });
app.model({ namespace: 'configmap', ...(require('/Users/aisen/go/src/git.kubeup.cn/kubelite/kubelite/gui/src/models/apps/configmap.ts').default) });
app.model({ namespace: 'ingress', ...(require('/Users/aisen/go/src/git.kubeup.cn/kubelite/kubelite/gui/src/models/apps/ingress.ts').default) });
app.model({ namespace: 'namespace', ...(require('/Users/aisen/go/src/git.kubeup.cn/kubelite/kubelite/gui/src/models/apps/namespace.ts').default) });
app.model({ namespace: 'nlb', ...(require('/Users/aisen/go/src/git.kubeup.cn/kubelite/kubelite/gui/src/models/apps/nlb.ts').default) });
app.model({ namespace: 'secret', ...(require('/Users/aisen/go/src/git.kubeup.cn/kubelite/kubelite/gui/src/models/apps/secret.ts').default) });
app.model({ namespace: 'auth', ...(require('/Users/aisen/go/src/git.kubeup.cn/kubelite/kubelite/gui/src/models/auth.ts').default) });
app.model({ namespace: 'cluster', ...(require('/Users/aisen/go/src/git.kubeup.cn/kubelite/kubelite/gui/src/models/cluster/cluster.ts').default) });
app.model({ namespace: 'install', ...(require('/Users/aisen/go/src/git.kubeup.cn/kubelite/kubelite/gui/src/models/cluster/install.ts').default) });
app.model({ namespace: 'menus', ...(require('/Users/aisen/go/src/git.kubeup.cn/kubelite/kubelite/gui/src/models/menus.ts').default) });
app.model({ namespace: 'metrics', ...(require('/Users/aisen/go/src/git.kubeup.cn/kubelite/kubelite/gui/src/models/metrics.ts').default) });
app.model({ namespace: 'pool', ...(require('/Users/aisen/go/src/git.kubeup.cn/kubelite/kubelite/gui/src/models/network/pool.ts').default) });
app.model({ namespace: 'vip', ...(require('/Users/aisen/go/src/git.kubeup.cn/kubelite/kubelite/gui/src/models/network/vip.ts').default) });
app.model({ namespace: 'images', ...(require('/Users/aisen/go/src/git.kubeup.cn/kubelite/kubelite/gui/src/models/registry/images.ts').default) });
app.model({ namespace: 'logs', ...(require('/Users/aisen/go/src/git.kubeup.cn/kubelite/kubelite/gui/src/models/registry/logs.ts').default) });
app.model({ namespace: 'private', ...(require('/Users/aisen/go/src/git.kubeup.cn/kubelite/kubelite/gui/src/models/registry/private.ts').default) });
app.model({ namespace: 'privileges', ...(require('/Users/aisen/go/src/git.kubeup.cn/kubelite/kubelite/gui/src/models/uesr/privileges.ts').default) });
app.model({ namespace: 'user', ...(require('/Users/aisen/go/src/git.kubeup.cn/kubelite/kubelite/gui/src/models/uesr/user.ts').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}

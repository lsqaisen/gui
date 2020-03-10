import path from 'path';

export default {
  publicPath: '/dist/',
  history: 'hash',
  plugins: [
    [
      'umi-plugin-react',
      {
        dva: true,
        antd: {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: true, // `style: true` 会加载 less 文件
        },
        routes: {
          exclude: [/model/, /basic/],
        },
        dynamicImport: {
          webpackChunkName: true,
          loadingComponent: null,
        },
      },
    ],
  ],
  extraBabelPlugins: ['styled-jsx/babel'],
  hash: true,
  alias: {
    library: path.join(__dirname, './lib/index.ts'),
    api: path.join(__dirname, './api/index.ts'),
  },
  define: {
    'process.env.OEM_NAME': '/kubelite',
    'process.env.VERSION': new Date().getTime(),
  },
  theme: {
    'primary-color': '#286cff', // 全局主色
    'link-color': '#286cff', // 链接色
    'success-color': '#0db46e', // 成功色
    'warning-color': '#ff9000', // 警告色
    'error-color': '#ff5242', // 错误色
    'font-size-base': '14px', // 主字号
    'heading-color': 'rgba(0, 0, 0, .85)', // 标题色
    'text-color': 'rgba(0, 0, 0, .65)', // 主文本色
    'text-color-secondary': 'rgba(0, 0, 0, .45)', // 次文本色
    'disabled-color': 'rgba(0, 0, 0, .25)', // 失效色
    'border-radius-base': '4px', // 组件/浮层圆角
    'border-color-base': '#d9d9d9', // 边框色
    'box-shadow-base': '0 2px 8px rgba(0, 0, 0, .15)', // 浮层阴影
    'sider-background-color': '#f2f7fb', // 菜单背景颜色
  },
  chainWebpack(config, {webpack}) {
    config.resolve.extensions.add('.tsx').prepend('.tsx');
    config.resolve.extensions.add('.ts').prepend('.ts');
  },
  proxy: {
    // api
    '/api': {
      target: 'http://127.0.0.1:6601/',
      changeOrigin: true,
      secure: false,
      pathRewrite: {'^/api': '/api'},
    },
  },
  copy:
    process.env.NODE_ENV === 'development'
      ? [{from: './public/', to: './dist/', toType: 'dir'}]
      : [],
};

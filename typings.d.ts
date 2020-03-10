declare module '*.less';
declare module 'rc-animate';
declare module 'react-lifecycles-compat';
declare module 'lodash';
declare module 'lodash.debounce';
declare module 'jsencrypt';
declare module 'react-time-format';
declare module 'react-dom';
declare module 'inputmask';

interface Window {
  Number: any
  [key: string]: any
}

declare var window: Window & typeof globalThis;
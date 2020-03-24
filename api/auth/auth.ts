import request, {ResType, encrypt} from '../request';

/**
 * @typedef {object} loginRequest
 * @property {"<RSA>"} encrypt
 * @property {string} username
 * @property {string} password
 */
export type loginRequest = {
  encrypt?: string;
  username: string;
  password: string;
};

/**
 * @param {loginRequest} options
 * @param {number} options.encrypt 解码类型
 * @param {string} options.username 用户名称
 * @param {string} options.password 用户秘密
 * @returns {Promise<ResType>}
 */
export function login(options: loginRequest): Promise<ResType> {
  const {password, ...data} = options;
  let _encrypt = encrypt.encrypt(password);
  return request('/api/auth/login', {
    method: 'post',
    body: {encrypt: _encrypt, ...data},
  });
}

/**
 * @returns {Promise<ResType>}
 */
export function logout(): Promise<ResType> {
  return request('/api/auth/logout');
}

/**
 * @typedef {object} getTokenRequest
 * @property {boolean} service
 * @property {number} scope
 */
export type getTokenRequest = {
  service: string;
  scope?: string;
};

/**
 * 添加用户
 * @param {getTokenRequest} options
 * @param {boolean} options.service
 * @param {number} options.scope
 * @returns {Promise<ResType>}
 */
export function getToken(options: getTokenRequest): Promise<ResType> {
  let {service, scope} = options;
  return request(`/api/auth/token?service=${service}&scope=${scope}`, {
    headers: {
      Authorization: '',
    },
  });
}

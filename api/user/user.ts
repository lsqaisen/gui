import request, {ResType} from '../request';

/**
 * 获取当前用户数据
 * current user
 * @returns {Promise<ResType>}
 */
export function getCurrentUser(): Promise<ResType> {
  return request(`/api/users/current`);
}

/**
 * list all defined privileges
 * @returns {Promise<ResType>}
 */
export function getPrivileges(): Promise<ResType> {
  return request(`/api/users/privileges`);
}

/**
 * list all users
 * @returns {Promise<ResType>}
 */
export function geUsers(): Promise<ResType> {
  return request(`/api/users/all`);
}

/**
 * @typedef {object} userRequest
 * @property {string} domain
 * @property {string} namespace
 * @property {string} password
 * @property {string} username
 */
export type userRequest = {
  email: string;
  expired_at: string;
  password: string;
  privileges?: string;
  remark: string;
  username: string;
};

/**
 * add new registry secret
 * @param {userRequest} options
 * @param {string} options.email
 * @param {string} options.expired_at
 * @param {string} options.password
 * @param {string} options.username
 * @param {string} options.privileges
 * @param {string} options.remark
 * @returns {Promise<ResType>}
 */
export function addUser(options: userRequest): Promise<ResType> {
  return request(`/api/users/add`, {
    method: 'post',
    body: options
  });
}

export interface deleteUserRequest extends userRequest {
  id: string;
}

/**
 * delete user
 * @param {userRequest} options
 * @param {string} options.email
 * @param {string} options.expired_at
 * @param {string} options.password
 * @param {string} options.username
 * @param {string} options.privileges
 * @param {string} options.remark
 * @returns {Promise<ResType>}
 */
export function deleteUser(options: deleteUserRequest): Promise<ResType> {
  return request(`/api/users/delete`, {
    method: 'delete',
    body: options
  });
}

export interface updateUserRequest extends userRequest {
  id: string;
}
/**
 * update user profile
 * @param {userRequest} options
 * @param {string} options.email
 * @param {string} options.expired_at
 * @param {string} options.password
 * @param {string} options.username
 * @param {string} options.privileges
 * @param {string} options.remark
 * @returns {Promise<ResType>}
 */
export function updateUser(options: updateUserRequest): Promise<ResType> {
  return request(`/api/users/profile`, {
    method: 'put',
    body: options
  });
}

/**
 * @typedef {object} getAuditsRequest
 * @property {string} query
 * @property {string | number} page
 * @property {string | number} size
 */
export type getAuditsRequest = {
  query?: string;
  page: string | number;
  size: string | number;
};

/**
 * get access log of images
 * @param {getAuditsRequest} options
 * @param {string} options.query
 * @param {string | number} options.page
 * @param {string | number} options.size
 * @returns {Promise<ResType>}
 */
export function getAudits(options: getAuditsRequest): Promise<ResType> {
  const {query = '', page, size} = options;
  return request(`/api/users/audits?q=${query}&page=${page}&size=${size}`);
}

export interface ChangePasswordRequestType {
  current: string;
  new: string;
}

/**
 * change current user password
 * @param {ChangePasswordRequestType} options
 * @param {string} options.current
 * @param {string} options.new
 * @returns {Promise<ResType>}
 */
export function changePassword(
  options: ChangePasswordRequestType
): Promise<ResType> {
  return request(`/api/users/password`, {
    method: 'PUT',
    body: options
  });
}

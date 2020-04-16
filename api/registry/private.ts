import request, {ResType} from '../request';

/**
 * list all registry configs
 * @returns {Promise<ResType>}
 */
export function getPrivates(): Promise<ResType> {
  return request(`/api/registry/privates`);
}

/**
 * @typedef {object} privateRequest
 * @property {string} domain
 * @property {string} namespace
 */
export type privateRequest = {
  domain: string;
  namespace: string;
};

/**
 * @typedef {object} addPrivateRequest
 * @property {string} domain
 * @property {string} namespace
 * @property {string} password
 * @property {string} username
 */
export interface addPrivateRequest extends privateRequest {
  password: string;
  username: string;
}

/**
 * add new registry secret
 * @param {getImagesRequest} options
 * @param {string} options.domain
 * @param {string} options.namespace
 * @param {string} options.password
 * @param {string} options.username
 * @returns {Promise<ResType>}
 */
export function addPrivate(options: addPrivateRequest): Promise<ResType> {
  return request(`/api/registry/private`, {
    method: 'post',
    body: options
  });
}

/**
 * delete registry secret
 * @param {getImagesRequest} options
 * @param {string} options.domain
 * @param {string} options.namespace
 * @returns {Promise<ResType>}
 */
export function deletePrivate(options: privateRequest): Promise<ResType> {
  return request(`/api/registry/private`, {
    method: 'delete',
    body: options
  });
}

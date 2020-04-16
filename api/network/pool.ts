import request, {ResType} from '../request';

/**
 * all network pools of current cluster
 * @returns {Promise<ResType>}
 */
export function getPools(): Promise<ResType> {
  return request(`/api/network/pools`);
}

/**
 * @typedef {object} poolRequest
 * @property {boolean} builtin
 * @property {string} cidr
 * @property {string} name
 * @property {string} time
 */
export type poolRequest = {
  builtin: boolean;
  cidr: string;
  name: string;
  time: string;
};

/**
 * @typedef {object} addPoolRequest
 * @property {boolean} builtin
 * @property {string} cidr
 * @property {string} name
 * @property {string} time
 */
export interface addPoolRequest extends poolRequest {}

/**
 * add ip pool of calico subnets
 * @param {getImagesRequest} options
 * @param {boolean} options.builtin
 * @param {string} options.cidr
 * @param {string} options.name
 * @param {string} options.time
 * @returns {Promise<ResType>}
 */
export function addPool(options: addPoolRequest): Promise<ResType> {
  return request(`/api/network/pool`, {
    method: 'post',
    body: options
  });
}

/**
 * @typedef {object} deletePoolRequest
 * @property {boolean} builtin
 * @property {string} cidr
 * @property {string} name
 * @property {string} time
 */
export interface deletePoolRequest extends poolRequest {}
/**
 * delete registry secret
 * @param {deletePoolRequest} options
 * @param {boolean} options.builtin
 * @param {string} options.cidr
 * @param {string} options.name
 * @param {string} options.time
 * @returns {Promise<ResType>}
 */
export function deletePool(options: deletePoolRequest): Promise<ResType> {
  return request(`/api/network/pool`, {
    method: 'delete',
    body: options
  });
}

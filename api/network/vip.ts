import request, { ResType } from '../request';

/**
 * all network vips of current cluster
 * @returns {Promise<ResType>}
 */
export function getVips(): Promise<ResType> {
  return request(`/api/network/vip-pools`);
}

/**
 * @typedef {object} vipRequest
 * @property {string[]} addresses
 * @property {string} name
 * @property {string} protocol
 */
export type vipRequest = {
  addresses: string[];
  name: string;
  protocol: string;
}

/**
 * @typedef {object} addVipRequest
 * @property {boolean} builtin
 * @property {string} cidr
 * @property {string} name
 * @property {string} time
 */
export interface addVipRequest extends vipRequest { }

/**
 * add ip vip of calico subnets
 * @param {getImagesRequest} options
 * @param {boolean} options.builtin
 * @param {string} options.cidr
 * @param {string} options.name
 * @param {string} options.time
 * @returns {Promise<ResType>}
 */
export function addVip(options: addVipRequest): Promise<ResType> {
  return request(`/api/network/vip-pool`, {
    method: 'post',
    body: options,
  });
}

/**
 * @typedef {object} deleteVipRequest
 * @property {boolean} builtin
 * @property {string} cidr
 * @property {string} name
 * @property {string} time
 */
export interface deleteVipRequest extends vipRequest { }
/**
 * delete vip address from pool
 * @param {deleteVipRequest} options
 * @param {boolean} options.builtin
 * @param {string} options.cidr
 * @param {string} options.name
 * @param {string} options.time
 * @returns {Promise<ResType>}
 */
export function deleteVip(options: deleteVipRequest): Promise<ResType> {
  return request(`/api/network/vip-pool`, {
    method: 'delete',
    body: options,
  });
}


import request, { ResType } from '../request';

export type NlbPortType = {
  node_port: number;
  port: number;
  protocol: number;
  target_port: number;
}

export interface NlbRequest {
  app_name: string;
  app_type: string;
  name: string;
  namespace: string;
  ports: NlbPortType[],
}

/**
 * query nlb list
 * @param {string} namespace
 * @returns {Promise<ResType>}
 */
export function getNlbList(namespace: string): Promise<ResType> {
  return request(`/api/apps/nlb?namespace=${namespace}`);
}


export interface NlbNameRequest {
  name: string
  namespace: string
}

/**
* query nlb
 * @param {NlbNameRequest} options
 * @param {string} options.name
 * @param {string} options.namespace
* @returns {Promise<ResType>}
*/
export function getNlb(options: NlbNameRequest): Promise<ResType> {
  const { name, namespace } = options;
  return request(`/api/apps/nlb/${name}?namespace=${namespace}`);
}

/**
 * create Nlb
 * @param {NlbNameRequest} options
 * @param {string} options.app_name
 * @param {string} options.app_type
 * @param {string} options.name
 * @param {string} options.namespace
 * @param {NlbPortType} options.ports
 * @returns {Promise<ResType>}
 */
export function addNlb(options: NlbNameRequest): Promise<ResType> {
  return request(`/api/apps/nlb`, {
    method: 'post',
    body: options
  });
}

export interface DeleteNlbRequest extends NlbRequest {}

/**
 * delete Nlb
 * @param {NlbRequest} options
 * @param {string} options.name
 * @param {string} options.namespace
 * @returns {Promise<ResType>}
 */
export function deleteNlb(options: NlbRequest): Promise<ResType> {
  const { namespace, name } = options;
  return request(`/api/apps/nlb/${name}?namespace=${namespace}`, {
    method: 'delete',
  });
}
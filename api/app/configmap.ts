import request, { ResType } from '../request';

export type ConfigMapRequest = {
  binary_data: { [key: string]: any }
  data: { [key: string]: any }
  name: string
  namespace: string
}

/**
 * query configmaps
 * @param {string} namespace
 * @returns {Promise<ResType>}
 */
export function getConfigMaps(namespace: string): Promise<ResType> {
  return request(`/api/apps/configmaps?namespace=${namespace}`);
}

/**
 * create namespace
 * @param {ConfigMapRequest} options
 * @param {{ description: string }} options.binary_data
 * @param {{ description: string }} options.data
 * @param {string} options.name
 * @param {string} options.namespace
 * @returns {Promise<ResType>}
 */
export function addConfigMap(options: ConfigMapRequest): Promise<ResType> {
  return request(`/api/apps/configmaps`, {
    method: 'post',
    body: options
  });
}

export type DeleteConfigMapRequest = {
  name: string
  namespace: string
}

/**
 * delete configmaps
 * @param {DeleteConfigMapRequest} options
 * @param {string} options.name
 * @param {string} options.namespace
 * @returns {Promise<ResType>}
 */
export function deleteConfigMap(options: DeleteConfigMapRequest): Promise<ResType> {
  const { namespace, name } = options;
  return request(`/api/apps/namespaces/${namespace}/configmaps/${name}`, {
    method: 'delete',
  });
}

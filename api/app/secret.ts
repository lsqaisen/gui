import request, {ResType} from '../request';

export type SecretRequest = {
  data: {[key: string]: any};
  name: string;
  namespace: string;
  stringData: {[key: string]: any};
  type: string;
};

/**
 * query secrets
 * @param {string} namespace
 * @returns {Promise<ResType>}
 */
export function getSecrets(namespace: string): Promise<ResType> {
  return request(`/api/apps/secrets?namespace=${namespace}`);
}

/**
 * create namespace
 * @param {SecretRequest} options
 * @param {{ description: string }} options.stringData
 * @param {{ description: string }} options.data
 * @param {string} options.name
 * @param {string} options.namespace
 * @param {string} options.type
 * @returns {Promise<ResType>}
 */
export function addSecret(options: SecretRequest): Promise<ResType> {
  return request(`/api/apps/secrets`, {
    method: 'post',
    body: options,
  });
}

export type DeleteSecretRequest = {
  name: string;
  namespace: string;
};

/**
 * delete secrets
 * @param {DeleteSecretRequest} options
 * @param {string} options.name
 * @param {string} options.namespace
 * @returns {Promise<ResType>}
 */
export function deleteSecret(options: DeleteSecretRequest): Promise<ResType> {
  const {namespace, name} = options;
  return request(`/api/apps/secrets/${name}?namespace=${namespace}`, {
    method: 'delete',
  });
}

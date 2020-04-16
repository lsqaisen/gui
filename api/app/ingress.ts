import request, {ResType} from '../request';

export type IngressRuleType = {
  host: string;
  path: string;
  port: number;
  protocol: string;
  service: string;
};

export interface IngressRequest {
  listen_http: boolean;
  listen_https: boolean;
  name: string;
  namespace: string;
  network_type: string;
  rules: IngressRuleType[];
  secret: string;
}

/**
 * query ingresses
 * @param {string} namespace
 * @returns {Promise<ResType>}
 */
export function getIngresses(namespace: string): Promise<ResType> {
  return request(`/api/apps/ingresses?namespace=${namespace}`);
}

/**
 * create Ingress
 * @param {IngressRequest} options
 * @param {boolean} options.listen_http
 * @param {boolean} options.listen_https
 * @param {string} options.name
 * @param {string} options.namespace
 * @param {string} options.network_type
 * @param {IngressRuleType} options.rules
 * @param {string} options.secret
 * @returns {Promise<ResType>}
 */
export function addIngress(options: IngressRequest): Promise<ResType> {
  return request(`/api/apps/ingresses`, {
    method: 'post',
    body: options
  });
}

export type DeleteIngressRequest = {
  name: string;
  namespace: string;
};

/**
 * delete ingress
 * @param {DeleteIngressRequest} options
 * @param {string} options.name
 * @param {string} options.namespace
 * @returns {Promise<ResType>}
 */
export function deleteIngress(options: DeleteIngressRequest): Promise<ResType> {
  const {namespace, name} = options;
  return request(`/api/apps/ingresses/${name}?namespace=${namespace}`, {
    method: 'delete'
  });
}

export interface ModifyIngressRulesType extends IngressRequest {}

/**
 * delete ingress
 * @param {ModifyIngressRulesType} options
 * @returns {Promise<ResType>}
 */
export function modifyIngressRules(
  options: ModifyIngressRulesType
): Promise<ResType> {
  const {name, namespace} = options;
  return request(`/api/apps/ingresses/${name}?namespace=${namespace}`, {
    method: 'put',
    body: options
  });
}

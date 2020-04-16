import request, {ResType} from '../request';

/**
 * @property {string} account
 * @property {string[]} addresses
 * @property {string} password
 * @returns {Promise<ResType>}
 */
export type addNodesRequest = {
  account: string;
  addresses: string[];
  password: string;
};

/**
 * 添加节点
 * add nodes to cluster
 * @param {addNodesRequest} options
 * @param {string} options.account
 * @param {string[]} options.addresses
 * @param {string} options.password
 * @returns {Promise<ResType>}
 */
export function addNodes(options: addNodesRequest): Promise<ResType> {
  return request(`/api/cluster/add/nodes`, {
    method: 'post',
    body: options
  });
}

/**
 * 获取所有节点
 * all nodes of current cluster
 * @returns {Promise<ResType>}
 */
export function getNodes(): Promise<ResType> {
  return request(`/api/cluster/nodes`);
}

/**
 * 获取节点
 * node detail of current cluster
 * @param {string} node
 * @returns {Promise<ResType>}
 */
export function getNode(node: string): Promise<ResType> {
  return request(`/api/cluster/nodes/${node}`);
}

/**
 * 获取节点pods
 * remove node from cluster
 * @param {string} node
 * @returns {Promise<ResType>}
 */
export function getNodePods(node: string): Promise<ResType> {
  return request(`/api/cluster/node/${node}/pods`);
}

/**
 * @typedef {object} ctrlNodeRequest
 * @property {string} node
 * @property {"cordon" | "drain" | "uncordon"} action
 */
export type ctrlNodeRequest = {
  node: string;
  action: 'cordon' | 'drain' | 'uncordon';
};

/**
 * 控制节点状态
 * ctrl node status
 * @param {ctrlNodeRequest} options
 * @param {string} options.node
 * @param {"cordon" | "drain" | "uncordon"} options.action - cordon, drain, uncordon
 * @returns {Promise<ResType>}
 */
export function ctrlNodeStatus(options: ctrlNodeRequest): Promise<ResType> {
  const {node, action} = options;
  return request(`/api/cluster/ctrl/${node}/${action}`, {
    method: 'PATCH'
  });
}

/**
 * 删除节点
 * remove node from cluster
 * @param {string} node
 * @returns {Promise<ResType>}
 */
export function deleteNode(node: string): Promise<ResType> {
  return request(`/api/cluster/remove/${node}`, {
    method: 'delete'
  });
}

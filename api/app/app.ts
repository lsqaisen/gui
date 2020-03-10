import request, { ResType } from '../request';

export type VolumeMount = {
  mount_path: string
  name: string
  read_only: boolean
  sub_path: string
}

export type EnvKeyRef = {
  key: string
  name: string
  optional: boolean
}

export type EnvFieldRef = {
  apiVersion: string
  fieldPath: string
}

export type ResourceQuantity = {
  d: {
    scale: number
    unscaled: string
  }
  i: {
    scale: number
    value: number
  }
  s: string
}

export type EnvResourceFieldRef = {
  containerName: string
  divisor: ResourceQuantity
  resource: string
}

export type Env = {
  name: string
  value: string
  valueFrom: {
    configMapKeyRef: EnvKeyRef
    secretKeyRef: EnvKeyRef
    fieldRef: EnvFieldRef
    resourceFieldRef: EnvResourceFieldRef
  }
}

export type LivenessProbe = {
  exec?: {
    command: string[]
  }
  tcpSocket?: {
    host: string
    port: number
  }
  httpGet?: {
    host: string
    path: string
    scheme: string
    port: number
    httpHeaders?: {
      name: string
      value: string
    }[]
  }
  failureThreshold: number
  initialDelaySeconds: number
  periodSeconds: number
  successThreshold: number
  timeoutSeconds: number
}

export type Resources = {
  limits: {
    [key: string]: ResourceQuantity
  }
  requests: {
    [key: string]: ResourceQuantity
  }
}

export type Container = {
  name: string
  image: string
  working_dir: string
  privileged: boolean
  args: string[]
  command: string[]
  env: Env[]
  liveness_probe: LivenessProbe
  volume_mounts: VolumeMount[]
  resources: Resources
}

export type VolumeItem = {
  key: string
  mode: number
  path: string
}

export type ConfigMap = {
  defaultMode: number
  items: VolumeItem[]
  name: string
  optional: boolean
}

export type HostPath = {
  path: string
  type: "" | "BlockDevice" | "CharDevice" | "Directory" | "DirectoryOrCreate" | "File" | "FileOrCreate" | "Socket"
}


export type Secret = {
  defaultMode: number
  items: VolumeItem[]
  optional: boolean
  secretName: string
}

export type Volume = {
  name: string
  config_map: ConfigMap
  host_path: HostPath
  secret: Secret
}

export type Port = {
  node_port: number
  port: number
  protocol: string
  target_port: number
}

export type LoadBalance = {
  auto_create: boolean
}

export interface Service {
  name?: string;
  external_traffic_policy: "Local" | "Cluster"
  session_affinity: "ClientIP" | "None"
  type: "ExternalName" | "ClusterIP" | "NodePort" | "LoadBalancer"
  load_balance: LoadBalance
  ports: Port[]
}

export type App = {
  name: string
  namespace: string
  type: string
  replicas: number
  labels: { [key: string]: any }
  volumes: Volume[]
  containers: Container[]
  service: Service
  ip_pool: string
}


/**
 * query namespace
 * @returns {Promise<ResType>}
 */
export function getNamespaces(): Promise<ResType> {
  return request(`/api/apps/namespaces`);
}

/**
 * create namespace
 * @param {string} name
 * @returns {Promise<ResType>}
 */
export function addNamespace(name: string): Promise<ResType> {
  return request(`/api/apps/namespaces`, {
    method: 'post',
    body: { name }
  });
}

/**
 * create namespace
 * @param {string} name
 * @returns {Promise<ResType>}
 */
export function deleteNamespace(name: string): Promise<ResType> {
  return request(`/api/apps/namespaces/${name}`, {
    method: 'DELETE',
  });
}

/**
 * 获取
 * @param {string} namespace
 * @returns {Promise<ResType>}
 */
export function getApps(namespace: string): Promise<ResType> {
  return request(`/api/apps/apps?namespace=${namespace}`);
}

export interface GetAppDetailType {
  name: string;
  namespace: string;
  type: string;
}

/**
 * 获取
 * @param {GetAppDetailType} options 
 * @param {string} options.name
 * @param {string} options.namespace
 * @param {string} options.type
 * @returns {Promise<ResType>}
 */
export function getAppDetail(options: GetAppDetailType): Promise<ResType> {
  const { name, namespace, type } = options;
  return request(`/api/apps/apps/${name}?namespace=${namespace}&type=${type}`);
}


/**
 * @param {App} options 
 * @returns {Promise<ResType>}
 */
export function createApp(options: App): Promise<ResType> {
  return request(`/api/apps/apps`, {
    method: "post",
    body: options,
  });
}

/**
 * @param {App} options 
 * @returns {Promise<ResType>}
 */
export function modifyApp(options: App): Promise<ResType> {
  return request(`/api/apps/apps/${options.name}?namespace=${options.namespace}&type=${options.type}`, {
    method: "put",
    body: options,
  });
}

export type DeleteAppRequest = {
  name: string
  namespace: string
  app_type: string
}

/**
 * delete apps
 * @param {DeleteAppRequest} options 
 * @param {string} options.name
 * @param {string} options.namespace
 * @param {string} options.app_type
 * @returns {Promise<ResType>}
 */
export function deleteApp(options: DeleteAppRequest): Promise<ResType> {
  const { namespace, name, app_type } = options;
  return request(`/api/apps/namespaces/${namespace}/apps/${name}?app_type=${app_type}`, {
    method: "delete",
    body: options,
  });
}


export interface ModifyReplicasRequest extends DeleteAppRequest {
  replicas: number;
}

/**
 * modify replicas
 * @param {ModifyReplicasRequest} options 
 * @param {string} options.name
 * @param {string} options.namespace
 * @param {string} options.app_type
 * @param {number} options.replicas
 * @returns {Promise<ResType>}
 */
export function modifyReplicas(options: ModifyReplicasRequest): Promise<ResType> {
  const { namespace, name, replicas, app_type } = options;
  return request(`/api/apps/namespaces/${namespace}/apps/${name}/replicas/${replicas}?app_type=${app_type}`, {
    method: "put",
    body: options,
  });
}

export interface GetMetricsType extends GetAppDetailType { }

/**
 * get App Metrics
 * @param {GetMetricsType} options 
 * @param {string} options.name
 * @param {string} options.namespace
 * @param {string} options.type
 * @returns {Promise<ResType>}
 */
export function getMetrics(options: GetMetricsType): Promise<ResType> {
  const { namespace, name, type } = options;
  return request(`/api/apps/namespaces/${namespace}/apps/${name}/metrics?app_type=${type}`);
}

/**
 * get App Services
 * @param {string} namespace
 * @returns {Promise<ResType>}
 */
export function getServices(namespace: string): Promise<ResType> {
  return request(`/api/apps/services?namespace=${namespace}`);
}

export interface GetServiceType {
  name: string;
  namespace: string;
}

/**
 * get App Service
 * @param {GetServiceType} options
 * @param {string} options.name
 * @param {string} options.namespace
 * @returns {Promise<ResType>}
 */
export function getService(options: GetServiceType): Promise<ResType> {
  const { name, namespace } = options;
  return request(`/api/apps/services/${name}?namespace=${namespace}`);
}


export interface ModifyServiceType {
  name: string;
  namespace: string;
  service: Service
}

/**
 * get App Services
 * @param {ModifyServiceType} options
 * @param {string} options.name
 * @param {string} options.namespace
 * @param {string} options.service
 * @returns {Promise<ResType>}
 */
export function modifyService(options: ModifyServiceType): Promise<ResType> {
  const { name, namespace, service } = options;
  if (service) {
    return request(`/api/apps/services/${name}?namespace=${namespace}`, {
      method: "PUT",
      body: service || {},
    });
  } else {
    return request(`/api/apps/services/${name}?namespace=${namespace}`, {
      method: "DELETE",
    });
  }
}


export interface LogsRequestType {
  name: string;
  namespace: string;
}

/**
 * Get Pod Logs
 * @param {LogsRequestType} options
 * @param {string} options.name
 * @param {string} options.namespace
 * @returns {Promise<ResType>}
 */
export function getLogs(options: LogsRequestType): Promise<ResType> {
  const { name, namespace } = options;
  return request(`/api/apps/pods/${name}/console?namespace=${namespace}`);
}


export interface DeletePodType {
  name: string;
  namespace: string;
}

/**
 * delete apps
 * @param {DeletePodType} options 
 * @param {string} options.name
 * @param {string} options.namespace
 * @returns {Promise<ResType>}
 */
export function deletePod(options: DeletePodType): Promise<ResType> {
  const { namespace, name } = options;
  return request(`/api/apps/pods/${name}?namespace=${namespace}`, {
    method: "delete",
    body: options,
  });
}

export interface GetAppEventType extends GetAppDetailType { }

/**
 * query apps event by name
 * @param {GetAppEventType} options
 * @param {string} options.name
 * @param {string} options.namespace
 * @param {string} options.type
 * @returns {Promise<ResType>}
 */
export function getAppEvent(options: GetAppEventType): Promise<ResType> {
  const { name, namespace, type } = options;
  return request(`/api/apps/apps/${name}/events?namespace=${namespace}&type=${type}`);
}

export interface GetAppHistoryVersionType extends GetAppDetailType { }

/**
 * Get App History version
 * @param {GetAppHistoryVersionType} options
 * @param {string} options.name
 * @param {string} options.namespace
 * @param {string} options.type
 * @returns {Promise<ResType>}
 */
export function getAppHistoryVersion(options: GetAppHistoryVersionType): Promise<ResType> {
  const { name, namespace, type } = options;
  return request(`/api/apps/apps/${name}/versions?namespace=${namespace}&app_type=${type}`);
}

export interface ExportAppType extends GetAppDetailType { }

/**
 * export apps by name
 * @param {ExportAppType} options
 * @param {string} options.name
 * @param {string} options.namespace
 * @param {string} options.type
 * @returns {Promise<ResType>}
 */
export function exportApp(options: ExportAppType): Promise<ResType> {
  const { name, namespace, type } = options;
  return request(`/api/apps/apps/${name}/yaml?namespace=${namespace}&type=${type}`);
}

export interface ImportAppType extends GetAppDetailType {
  yaml: string;
}

/**
 * import apps by name
 * @param {ImportAppType} options
 * @param {string} options.name
 * @param {string} options.namespace
 * @param {string} options.type
 * @param {string} options.yaml
 * @returns {Promise<ResType>}
 */
export function importApp(options: ImportAppType): Promise<ResType> {
  const { name, namespace, type, yaml } = options;
  return request(`/api/apps/apps/${name}/yaml?namespace=${namespace}&type=${type}`, {
    method: 'PUT',
    body: yaml
  });
}



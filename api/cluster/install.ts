import request, {ResType} from '../request';

/**
 * process running status of install node
 * @returns {Promise<ResType>}
 */
export function getRunningStatusofInstall(): Promise<ResType> {
  return request(`/api/cluster/install/running`);
}

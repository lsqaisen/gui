import request, { ResType } from '../request';

/**
 * dashboard display cluster details
 * @returns {Promise<ResType>}
 */
export function getDetails(): Promise<ResType> {
  return request(`/api/metrics/details`);
}
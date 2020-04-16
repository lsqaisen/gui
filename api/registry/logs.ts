import request, {ResType} from '../request';

/**
 * @typedef {object} getLogsRequest
 * @property {string} query
 * @property {string | number} page
 * @property {string | number} size
 */
export type getLogsRequest = {
  query?: string;
  page: string | number;
  size: string | number;
};

/**
 * get access log of images
 * @param {getLogsRequest} options
 * @param {string} options.query
 * @param {string | number} options.page
 * @param {string | number} options.size
 * @returns {Promise<ResType>}
 */
export function getLogs(options: getLogsRequest): Promise<ResType> {
  const {query = '', page, size} = options;
  return request(`/api/registry/logs?q=${query}&page=${page}&size=${size}`);
}

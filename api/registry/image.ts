import request, { ResType } from '../request';

/**
 * @typedef {object} getImagesRequest
 * @property {string} query
 * @property {'on'} domain
 * @property {string | number} page
 * @property {string | number} size
 */
export type getImagesRequest = {
  query?: string
  domain?: 'on'
  page: string | number
  size: string | number
}

/**
 * list all images of docker registry
 * @param {getImagesRequest} options
 * @param {string} options.query
 * @param {"on"} options.domain
 * @param {string | number} options.page 
 * @param {string | number} options.size
 * @returns {Promise<ResType>}
 */
export function getImages(options: getImagesRequest): Promise<ResType> {
  const { query = "", domain = "", page, size } = options;
  return request(`/api/registry/images?q=${query}&page=${page}&size=${size}&domain=${domain}`);
}

/**
 * list image all tags
 * @param {string} image image name
 * @returns {Promise<ResType>}
 */
export function getTags(image: string): Promise<ResType> {
  return request(`/api/registry/tags?image=${image}`);
}

/**
 * @typedef {object} changeStatusRequest
 * @property { "lock" | "unlock" | "pub" | "unpub"} action
 * @property {string} name
 * @property {string} size
 */
export type changeStatusRequest = {
  action: "lock" | "unlock" | "pub" | "unpub"
  name: string
  tag?: string
}
/**
 * change image status
 * @param {changeStatusRequest} options
 * @param {string} name image name
 * @param {string} tag image tag
 * @param {string} action 
 * @returns {Promise<ResType>}
 */
export function changeStatus(options: changeStatusRequest): Promise<ResType> {
  return request(`/api/registry/image/status`, {
    method: 'PATCH',
    body: options,
  });
}

/**
 * @typedef {object} deleteImageRequest
 * @property {string} name
 * @property {string} size
 */
export type deleteImageRequest = {
  name: string
  tag?: string
}
/**
 * delete images or by tags
 * @param {deleteImageRequest} options
 * @param {string} options.name image name
 * @param {string} options.tag image tag
 * @returns {Promise<ResType>}
 */
export function deleteImage(options: deleteImageRequest): Promise<ResType> {
  return request(`/api/registry/image/delete`, {
    method: 'delete',
    body: options,
  });
}


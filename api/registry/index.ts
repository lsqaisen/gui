import * as image from './image';
import * as _private from './private';
import * as logs from './logs';
export {
  getImagesRequest,
  changeStatusRequest,
  deleteImageRequest
} from './image';
export {privateRequest, addPrivateRequest} from './private';
export {getLogsRequest} from './logs';
export default {...image, ..._private, ...logs};

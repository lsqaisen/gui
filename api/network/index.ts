import * as pool from './pool';
import * as vip from './vip';
export {poolRequest, addPoolRequest, deletePoolRequest} from './pool';
export {vipRequest, addVipRequest, deleteVipRequest} from './vip';
export default {...pool, ...vip};

import {connect} from 'dva';
import {IPPoolInput} from '@/components/apps/app/inputs/';

const IPPool = ({dispatch, ...props}: any) => {
  return (
    <IPPoolInput getIPPools={() => dispatch({type: 'nwpool/get'})} {...props} />
  );
};

export default connect(() => ({}))(IPPool);

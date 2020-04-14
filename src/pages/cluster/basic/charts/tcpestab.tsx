import {connect} from 'dva';
import {createSelector} from 'reselect';
import TcpestabChart from '@/components/cluster/charts/tcpestab';

export default connect(
  createSelector(
    [
      ({node: {metrics}}: any, {name}: any) => {
        const {data = undefined, used = 0, total = 0} =
          (metrics[name] || {})['tcpestab'] || {};
        return {used, total, data: data ? Object.assign(data) : undefined};
      }
    ],
    metric => metric
  )
)(({data, ...props}: any) => (
  <TcpestabChart {...props} type={'tcpestab'} data={data || []} />
));

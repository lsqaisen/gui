import {connect} from 'dva';
import {createSelector} from 'reselect';
import NetworkChart from '@/components/cluster/charts/network';

export default connect(
  createSelector(
    [
      ({node: {metrics}}: any, {name}: any) => {
        const {data = undefined} = (metrics[name] || {})['network'] || {};
        return {data: data ? Object.assign(data) : undefined};
      }
    ],
    metric => metric
  )
)(({data, ...props}: any) => (
  <NetworkChart {...props} type="network" data={data || []} />
));

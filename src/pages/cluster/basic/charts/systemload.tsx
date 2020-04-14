import {connect} from 'dva';
import {createSelector} from 'reselect';
import SystemLoadChart from '@/components/cluster/charts/systemload';

export default connect(
  createSelector(
    [
      ({node: {metrics}}: any, {name}: any) => {
        const {data = undefined} = (metrics[name] || {})['systemload'] || {};
        return {data: data ? Object.assign(data) : undefined};
      }
    ],
    metric => metric
  )
)(({data, ...props}: any) => (
  <SystemLoadChart {...props} type="systemload" data={data || []} />
));

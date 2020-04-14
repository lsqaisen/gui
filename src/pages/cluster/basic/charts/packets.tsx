import {connect} from 'dva';
import {createSelector} from 'reselect';
import PacketsChart from '@/components/cluster/charts/packets';

export default connect(
  createSelector(
    [
      ({node: {metrics}}: any, {name}: any) => {
        const {data = undefined} =
          (metrics[name] || {})['networkpackets'] || {};
        return {data: data ? Object.assign(data) : undefined};
      }
    ],
    metric => metric
  )
)(({data, ...props}: any) => (
  <PacketsChart {...props} type="networkpackets" data={data || []} />
));

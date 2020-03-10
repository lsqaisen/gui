import { connect } from 'dva';
import { createSelector } from 'reselect';
import InodeChart from '@/components/cluster/charts/inode';

export default connect(createSelector(
  [
    ({ node: { metrics } }: any, { name }: any) => {
      const { data = undefined, used = 0, total = 0 } = (metrics[name] || {})['inode'] || {};
      return { used, total, data: data ? Object.assign(data) : undefined };
    }
  ],
  (metric) => (metric)
))(({ data, ...props }: any) => (
  <InodeChart
    {...props}
    type="inode"
    data={data || []}
  />
));
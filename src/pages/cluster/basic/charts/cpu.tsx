import { connect } from 'dva';
import { createSelector } from 'reselect';
import CpuChart from '@/components/cluster/charts/cpu';

export default connect(createSelector(
  [
    ({ node: { metrics } }: any, { name }: any) => {
      const { data = undefined, used = 0, total = 0 } = (metrics[name] || {})['cpu'] || {};
      return { used, total, data: data ? Object.assign(data) : undefined };
    }
  ],
  (metric) => (metric)
))(({ data, ...props }: any) => (
  <CpuChart
    {...props}
    type="cpu"
    data={data || []}
  />
));
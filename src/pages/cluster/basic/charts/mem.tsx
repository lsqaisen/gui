import { connect } from 'dva';
import { createSelector } from 'reselect';
import MemChart from '@/components/cluster/charts/mem';

export default connect(createSelector(
  [
    ({ node: { metrics } }: any, { name }: any) => {
      const { data = undefined, used = 0, total = 0 } = (metrics[name] || {})['mem'] || {};
      return { used, total, data: data ? Object.assign(data) : undefined };
    }
  ],
  (metric) => (metric)
))(({ data, total, used, ...props }: any) => {
  const _total = window.Number(total).flowCeil(0);
  const _used = window.Number(used / 100 * total).flowCeil(4);
  return (
    <MemChart
      {...props}
      type="mem"
      total={_total}
      used={_used}
      data={data || []}
    />
  )
});
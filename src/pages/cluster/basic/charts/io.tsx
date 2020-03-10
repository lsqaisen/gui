import { connect } from 'dva';
import { createSelector } from 'reselect';
import IoChart from '@/components/cluster/charts/io';

export default connect(createSelector(
  [
    ({ node: { metrics } }: any, { name }: any) => {
      const { data: diskio_data = undefined } = (metrics[name] || {})['diskio'] || {};
      const { data: disk_data = undefined } = (metrics[name] || {})['disk'] || {};
      return {
        disk_data,
        diskio_data,
      }
    }
  ],
  (metric) => (metric)
))(({ disk_data, diskio_data, ...props }: any) => {
  return (
    <IoChart
      {...props}
      type={['diskio', 'disk']}
      data={[].concat(disk_data || []).concat(diskio_data || [])}
    />
  )
});
import {connect} from 'dva';
import {createSelector} from 'reselect';
import FileSystemChart from '@/components/cluster/charts/filesystem';

export default connect(
  createSelector(
    [
      ({node: {metrics}}: any, {name}: any) => {
        const {used = 0, total = 0, pused = 0} =
          (metrics[name] || {})['filesystem'] || {};
        return {used, total, pused};
      }
    ],
    metrics => metrics
  )
)((props: any) => <FileSystemChart {...props} type="filesystem" />);

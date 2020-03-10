import { useEffect } from 'react';
import { connect } from 'dva';
import { Loading } from 'library';
import { useInterval } from '@/utils/index';
import Detail from '@/components/cluster/detail';
import { INode, IPod, ClusterModelState } from '@/models/cluster/cluster';
import { Dispatch, ConnectLoading } from '@/models/connect';

export interface NodeDetailProps {
  loading: boolean;
  name: string;
  node: INode;
  pods: IPod[];
  dispatch: Dispatch<any>;
}

const NodeDetail = ({ loading, node, pods, name, dispatch }: NodeDetailProps) => {
  const getNodePods = () => dispatch({ type: 'cluster/pods', payload: name });
  const getDetail = () => dispatch({ type: 'cluster/node', payload: name });
  useInterval(getDetail, 5000);
  useEffect(() => {
    getNodePods();
    getDetail();
  }, [name])
  return (
    <Loading loading={!node || !pods}>
      <div style={{ padding: 24 }}>
        <Detail
          pods={pods}
          node={node}
          getDode={getDetail}
          onLoad={() => { getDetail(), getNodePods() }}
        />
      </div>
    </Loading>
  )
}


export type ConnectState = {
  cluster: ClusterModelState
  loading: ConnectLoading
}

export default connect(
  (
    { cluster, loading }: ConnectState,
    { match: { params: { detail } } }: any
  ) => {
    return ({ name: detail, node: cluster.details[detail], pods: cluster.pods[detail], loading: loading.effects['cluster/node'] || loading.effects['cluster/get'] })
  }
)(NodeDetail);
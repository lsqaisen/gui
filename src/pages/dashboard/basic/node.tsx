import { useEffect, useState } from 'react';
import { connect } from 'dva';
import CPU from '@/components/cluster/charts/cpu';
import Memory from '@/components/cluster/charts/mem';
import { useInterval } from '@/utils/index';
import { INode, ClusterModelState } from '@/models/cluster/cluster';
import { Dispatch } from '@/models/connect';
import { Row, Col, Card, Skeleton, Select } from 'antd';

export interface NodeDetailProps {
  node_details: { [key: string]: INode };
  nodes: INode[];
  dispatch: Dispatch<any>;
}

const NodeCpuMetrics = ({ node }: { node: INode }) => {
  return (
    <CPU total={node!.capacity.cpu / 1000} used={node!.usages.cpu / 1000} />
  )
}

const NodeMemMetrics = ({ node }: { node: INode }) => {
  return (
    <Memory total={node!.capacity.memory} used={node!.usages.memory} />
  )
}

const NodeMetrics = ({ node_details, nodes, dispatch }: NodeDetailProps) => {
  const [node_name, setNodeName] = useState(nodes[0].metadata.name);
  const getNode = () => dispatch({ type: 'cluster/node', payload: node_name });
  useInterval(getNode, 5000);
  useEffect(() => { node_name && getNode() }, [node_name]);
  const node = node_details[node_name];
  return (
    <Row gutter={24}>
      <Col span={24} style={{ marginBottom: 16 }}>
        <label>
          <span>节点：</span>
          <Select style={{ width: 280 }} value={node_name} onChange={setNodeName}>
            {nodes.map(node => <Select.Option key={node.metadata.name}>{node.metadata.name}</Select.Option>)}
          </Select>
        </label>
      </Col>
      <Col sm={24} xl={12} style={{ marginBottom: 16 }}>
        <section className="box" style={{ marginBottom: '24px' }}>
          <Skeleton loading={!node}>
            <NodeCpuMetrics node={node} />
          </Skeleton>
        </section>
      </Col>
      <Col sm={24} xl={12} style={{ marginBottom: 16 }}>
        <section className="box" style={{ marginBottom: '24px' }}>
          <Skeleton loading={!node}>
            <NodeMemMetrics node={node} />
          </Skeleton>
        </section>
      </Col>
    </Row>
  )
}

const Node = ({ node_details, nodes, dispatch }: NodeDetailProps) => {
  const getNodes = () => dispatch({ type: 'cluster/get' });
  useEffect(() => { getNodes() }, []);
  return (
    <Skeleton loading={nodes.length <= 0}>
      <NodeMetrics {...{ node_details, nodes, dispatch }} />
    </Skeleton>
  )
}

export type ConnectState = {
  cluster: ClusterModelState
}

export default connect(
  ({ cluster }: ConnectState) => {
    return ({ node_details: cluster.details, nodes: cluster.nodes })
  }
)(Node);
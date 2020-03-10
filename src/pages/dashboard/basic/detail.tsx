import { Descriptions, Skeleton, Statistic, Row, Col } from 'antd';
import { IMetrics, MetricsModelState, IDetail, IInventory } from '@/models/metrics';
import { ConnectLoading, Dispatch } from '@/models/connect';
import { connect } from 'dva';
import { useEffect } from 'react';

export type MetricsProps = {
  loading: boolean;
  data: IMetrics;
  dispatch: Dispatch<any>;
}

const Detail = ({ detail }: { detail: IDetail }) => (
  <Descriptions>
    <Descriptions.Item label="集群ID" span={3}>{detail.cluster_id}</Descriptions.Item>
    <Descriptions.Item label="平台信息" span={3}>{detail.platform}</Descriptions.Item>
    <Descriptions.Item label="版本信息" span={3}>{detail.version}</Descriptions.Item>
  </Descriptions>
)

const Inventory = ({ inventory }: { inventory: IInventory }) => (
  <Row>
    <Col span={12}>
      <Statistic title="节点统计" value={inventory.health_nodes} suffix={`/ ${inventory.all_nodes}`} />
    </Col>
    <Col span={12}>
      <Statistic title="Pod统计" value={inventory.health_pods} suffix={`/ ${inventory.all_pods}`} />
    </Col>
  </Row>
)

const Metrics = ({ data, dispatch }: MetricsProps) => {
  const getDetails = () => dispatch({ type: 'metrics/details' });
  useEffect(() => { getDetails() }, []);
  return (
    <>
      <section className="box" style={{ marginBottom: '24px' }}>
        <Skeleton loading={!data.detail}>
          <Detail detail={data!.detail} />
        </Skeleton>
      </section>
      <section className="box" style={{ marginBottom: '24px' }}>
        <Skeleton loading={!data.inventory}>
          <Inventory inventory={data!.inventory} />
        </Skeleton>
      </section>
    </>
  )
}


export type ConnectState = {
  metrics: MetricsModelState;
  loading: ConnectLoading;
}
export default connect(({ metrics, loading }: ConnectState) => ({ data: metrics.details || {}, loading: loading.effects['metrics/details'] }))(Metrics)
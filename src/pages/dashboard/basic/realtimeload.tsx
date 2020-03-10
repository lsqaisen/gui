import { connect } from 'dva';
import { PageHeader, Row, Col, Skeleton } from 'antd';
import { Charts } from 'library';
import { SimpleProps } from 'library/type/charts/simple';
import { MetricsModelState, IMetrics, IResources } from '@/models/metrics';
import { ConnectLoading, Dispatch } from '@/models/connect';

export interface RealtimeLoadItemProps extends SimpleProps {
  title: string;
}

const RealtimeLoadItem = ({ color, title, data }: RealtimeLoadItemProps) => {
  return (
    <PageHeader title={<header style={{ padding: '16px 16px 0' }}>{title}</header>} style={{ padding: 0 }}>
      <Charts.Circle
        line
        type="area"
        symbol="%"
        color={color}
        timeMask="mm:ss"
        data={data}
      />
    </PageHeader>
  )
}

export type MetricsProps = {
  loading: boolean;
  data: IMetrics;
  dispatch: Dispatch<any>;
}


const CUP = ({ resources }: { resources: IResources }) => (
  <RealtimeLoadItem
    color={['#198bfb', '#eceef1']}
    title="集群CPU"
    data={[
      {
        type: 'CPU',
        value: Number(Number(resources.usages.cpu / resources.capacity.cpu * 100).toFixed(0)),
      },
    ]}
  />
)

const MEM = ({ resources }: { resources: IResources }) => (
  <RealtimeLoadItem
    color={['#9088fc', '#eceef1']}
    title="集群内存"
    data={[
      {
        type: '内存',
        value: Number(Number(resources.usages.memory / resources.capacity.memory * 100).toFixed(0)),
      },
    ]}
  />
)


const POD = ({ resources, inventory }: IMetrics) => (
  <RealtimeLoadItem
    color={['#198bfb', '#eceef1']}
    title="集群POD"
    data={[
      {
        type: 'POD',
        value: Number(Number(inventory.all_pods / resources.capacity.pods * 100).toFixed(0)),
      },
    ]}
  />
)

const Metrics = ({ data }: MetricsProps) => {
  return (
    <Row gutter={16}>
      <Col sm={24} md={8}>
        <section className="box" style={{ padding: 0, marginBottom: '24px' }}>
          <Skeleton loading={!data.resources}>
            <CUP resources={data.resources} />
          </Skeleton>
        </section>
      </Col>
      <Col sm={24} md={8}>
        <section className="box" style={{ padding: 0, marginBottom: '24px' }}>
          <Skeleton loading={!data.resources}>
            <MEM resources={data.resources} />
          </Skeleton>
        </section>
      </Col>
      <Col sm={24} md={8}>
        <section className="box" style={{ padding: 0, marginBottom: '24px' }}>
          <Skeleton loading={!data.resources}>
            <POD resources={data.resources} inventory={data.inventory} detail={data.detail} />
          </Skeleton>
        </section>
      </Col>
    </Row>
  )
}

export type ConnectState = {
  metrics: MetricsModelState;
  loading: ConnectLoading;
}
export default connect(({ metrics, loading }: ConnectState) => ({ data: metrics.details || {}, loading: loading.effects['metrics/details'] }))(Metrics)

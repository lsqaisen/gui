import {PureComponent, Fragment} from 'react';
import {
  Tag,
  Tabs,
  Button,
  PageHeader,
  Row,
  Col,
  Statistic,
  Typography,
  Breadcrumb
} from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import {INode, IPod} from '@/models/cluster/cluster';
import Description from './description';
import Pods from './pods';
import CPU from '../charts/cpu';
import Memory from '../charts/mem';
import styles from './style/index.less';

const TabPane = Tabs.TabPane;
const {Title, Paragraph} = Typography;

export interface NodeProps {
  loading?: boolean;
  node?: INode;
  pods?: IPod[];
  onLoad?: () => void;
  getDode: () => any;
}

class Node extends PureComponent<NodeProps, any> {
  static readonly defaultProps: NodeProps = {
    node: {} as INode,
    pods: [] as IPod[],
    getDode: () => null
  };
  render() {
    const {pods, node, onLoad, getDode} = this.props;
    return (
      <Fragment>
        <Breadcrumb
          style={{marginBottom: 16}}
          routes={[
            {
              path: '/dashboard',
              breadcrumbName: '总览'
            },
            {
              path: `/cluster`,
              breadcrumbName: '节点列表'
            },
            {
              path: `/cluster/${node!.metadata.name}`,
              breadcrumbName: '节点详情'
            }
          ]}
          itemRender={(route, _, routes) => {
            const last = routes.indexOf(route) === routes.length - 1;
            return last ? (
              <span>{route.breadcrumbName}</span>
            ) : (
              <Link to={route.path}>{route.breadcrumbName}</Link>
            );
          }}
        />
        <PageHeader
          className="box"
          onBack={router.goBack}
          title={node!.metadata.name}
          subTitle={
            (
              node!.addresses.find((v: any) => v.type === 'InternalIP') || {
                address: ''
              }
            ).address
          }
          tags={
            [
              <Tag
                key="status"
                color={node!.status !== 'Ready' ? 'red' : 'green'}
              >
                {node!.status.split(',').indexOf('Ready') !== -1 ? (
                  node!.status.split(',').indexOf('SchedulingDisabled') !==
                  -1 ? (
                    <span style={{color: '#f5222d'}}>维护中</span>
                  ) : (
                    <span style={{color: '#52c41a'}}>运行中</span>
                  )
                ) : (
                  <span style={{color: '#f5222d'}}>异常</span>
                )}
              </Tag>
            ] as any
          }
          extra={[
            <Button key="3" onClick={getDode}>
              刷新
            </Button>
          ]}
          footer={
            <Tabs style={{padding: '0 16px'}} defaultActiveKey="1">
              <TabPane tab="监控信息" key="1">
                <Row gutter={24} style={{padding: '24px 0'}}>
                  <Col md={12} sm={24}>
                    <CPU
                      total={node!.capacity.cpu / 1000}
                      used={node!.usages.cpu / 1000}
                    />
                  </Col>
                  <Col md={12} sm={24}>
                    <Memory
                      total={node!.capacity.memory}
                      used={node!.usages.memory}
                    />
                  </Col>
                  <Col md={8} sm={24}>
                    {/* <SystemLoad name={name} dur={dur} step={step} /> */}
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Pod列表" key="2">
                <Pods pods={pods || []} />
              </TabPane>
              <TabPane tab="其他信息" key="other">
                <Typography style={{padding: '0 8px'}}>
                  <Title level={2}>Lables</Title>
                  <Paragraph>
                    {Object.entries(node!.metadata.labels || {}).map(
                      ([key, value]: any) => (
                        <Description key={key} term={key} span={24}>
                          <Paragraph copyable={{text: `${key}:${value}`}}>
                            {value}
                          </Paragraph>
                        </Description>
                      )
                    )}
                  </Paragraph>
                  <Title level={2}>NodeOther</Title>
                  <Paragraph>
                    {Object.entries(node!.metadata.annotations || {}).map(
                      ([key, value]: any) => (
                        <Description key={key} term={key} span={24}>
                          {value}
                        </Description>
                      )
                    )}
                  </Paragraph>
                </Typography>
              </TabPane>
            </Tabs>
          }
        >
          <Row className={`${styles.wrap} wrap`}>
            <Col className={styles.content} xs={24} lg={12}>
              <Row gutter={24}>
                <Description term="IP地址信息" span={24}>
                  {node!.addresses.map((v: any) => v.address).join('、')}
                </Description>
                <Description term="创建时间" span={24}>
                  {node!.metadata.creationTimestamp}
                </Description>
                <Description term="CPU分配/容量" xs={24} md={12}>
                  <Statistic
                    suffix={` / ${(node!.capacity.cpu || 0).toFixed(1)}GHz`}
                    value={((node!.allocatable.cpu || 0) / 1000).toFixed(1)}
                  />
                </Description>
                <Description term="内存" xs={24} md={12}>
                  <Statistic
                    suffix={` / ${(
                      (node!.capacity.memory || 0) /
                      (1024 * 1024)
                    ).toFixed(1)}GB`}
                    value={(
                      (node!.allocatable.memory || 0) /
                      (1024 * 1024)
                    ).toFixed(1)}
                  />
                </Description>
                <Description term="运行Pod数" xs={24} md={12}>
                  <b className={styles.blue}>{node!.pods} 个</b>
                </Description>
                <Description term="最大Pod数" xs={24} md={12}>
                  <b className={styles.blue}>{node!.allocatable.pods || 0}</b>{' '}
                  个
                </Description>
              </Row>
            </Col>
            <Col className={`${styles.extraContent} extraContent`}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic title="Status" value={node!.status} />
                </Col>
                <Col span={12}>
                  <Statistic title="Pods" suffix="个" value={node!.pods} />
                </Col>
              </Row>
            </Col>
          </Row>
        </PageHeader>
      </Fragment>
    );
  }
}

export default Node;

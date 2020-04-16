import {useState, useContext} from 'react';
import {
  Descriptions,
  PageHeader,
  Breadcrumb,
  Tag,
  Button,
  Tabs,
  Col,
  Row,
  Table,
  Empty
} from 'antd';
import Link from 'umi/link';
import router from 'umi/router';
import {IIngress} from '@/models/apps/ingress';
import Edit from '../edit';
import styles from './style/index.less';
import Context from '../context';

export interface IngressProps {
  loading?: boolean;
  ingress: IIngress;
  getDetail: () => any;
}

const Ingress = ({loading, ingress, getDetail}: IngressProps) => {
  const [visible, setVisible] = useState(false);
  const {editIngressRules} = useContext(Context);
  return (
    <>
      <Breadcrumb
        style={{marginBottom: 16}}
        routes={[
          {
            path: '/dashboard',
            breadcrumbName: '总览'
          },
          {
            path: `/apps/ingress`,
            breadcrumbName: '应用负载均衡列表'
          },
          {
            path: `/apps/ingress/${ingress.name}?namespace=${ingress.namespace}`,
            breadcrumbName: '负载均衡详情'
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
        style={{minHeight: '100%'}}
        title={ingress.name}
        onBack={router.goBack}
        tags={[
          <Tag>{`${({public: '公网', internal: '内网'} as any)[
            ingress.network_type
          ] || '未知'}`}</Tag>
        ]}
        extra={[
          <Button
            key="edit"
            style={{marginBottom: 16}}
            type="primary"
            onClick={() => setVisible(true)}
          >
            编辑
          </Button>,
          <Button key="3" onClick={getDetail}>
            刷新
          </Button>
        ]}
        footer={
          <Tabs>
            <Tabs.TabPane key="1" tab="规则列表">
              <section style={{padding: '16px 0'}}>
                <Table
                  columns={[
                    {
                      title: '协议',
                      dataIndex: 'protocol',
                      render: text => <a>{text}</a>
                    },
                    {
                      title: '域名',
                      dataIndex: 'host',
                      render: text => <a>{text || '使用默认VIP'}</a>
                    },
                    {
                      title: '路径',
                      dataIndex: 'path',
                      render: text => <a>{text || '--'}</a>
                    },
                    {
                      title: '服务',
                      dataIndex: 'service',
                      render: text => <a>{text}</a>
                    },
                    {
                      title: '服务端口',
                      dataIndex: 'port',
                      render: text => <a>{text}</a>
                    }
                  ]}
                  dataSource={ingress.rules.map(v => ({
                    key: JSON.stringify(v),
                    ...v
                  }))}
                />
              </section>
            </Tabs.TabPane>
            <Tabs.TabPane key="2" tab="监控信息">
              <Empty description="开发中....." />
            </Tabs.TabPane>
          </Tabs>
        }
      >
        <Row className={`${styles.wrap} wrap`}>
          <Col className={styles.content} xs={24} lg={12}>
            <Descriptions>
              <Descriptions.Item label="HTTP" span={3}>
                {ingress.listen_http ? '开启' : '关闭'}
              </Descriptions.Item>
              <Descriptions.Item label="HTTPS" span={3}>
                {ingress.listen_https ? '开启' : '关闭'}
              </Descriptions.Item>
              <Descriptions.Item label="后端证书" span={3}>
                {ingress.secret || '未使用'}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        <Edit
          data={ingress}
          visible={visible}
          onClose={() => setVisible(false)}
          submit={editIngressRules}
        />
      </PageHeader>
    </>
  );
};

export default Ingress;

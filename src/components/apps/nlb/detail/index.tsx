import { useState } from 'react';
import { Descriptions, PageHeader, Breadcrumb, Tag, Button, Tabs, Col, Row, Table, Empty } from 'antd';
import Link from 'umi/link';
import router from 'umi/router';
import { INlb } from '@/models/apps/nlb';
import styles from './style/index.less';

export interface IngressProps {
  loading?: boolean;
  nlb: INlb;
  getDetail: () => any;
}

const Ingress = ({ loading, nlb, getDetail }: IngressProps) => {
  return (
    <>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        routes={[{
          path: '/dashboard',
          breadcrumbName: '总览',
        }, {
          path: `/apps/nlb`,
          breadcrumbName: '网络负载均衡列表',
        }, {
          path: `/apps/nlb/${nlb.name}?namespace=${nlb.namespace}`,
          breadcrumbName: '负载均衡用详情',
        }]}
        itemRender={(route, _, routes) => {
          const last = routes.indexOf(route) === routes.length - 1;
          return last ? <span>{route.breadcrumbName}</span> : <Link to={route.path}>{route.breadcrumbName}</Link>;
        }}
      />
      <PageHeader
        className="box"
        style={{ minHeight: '100%' }}
        title={nlb.name}
        onBack={router.goBack}
        extra={[
          <Button key="3" onClick={getDetail}>刷新</Button>
        ]}
        footer={(
          <Tabs>
            <Tabs.TabPane key="1" tab="规则列表">
              <section style={{ padding: '16px 0' }}>
                {/* <Button style={{ marginBottom: 16 }} type="primary" onClick={() => setVisible(true)}>编辑</Button> */}
                <Table columns={[{
                  title: '协议',
                  dataIndex: 'protocol',
                  key: 'protocol',
                }, {
                  title: '目标端口',
                  dataIndex: 'target_port',
                  key: 'target_port',
                }, {
                  title: '导出端口',
                  dataIndex: 'port',
                  key: 'port',
                }, {
                  title: '节点端口',
                  dataIndex: 'node_port',
                  key: 'node_port',
                }]} dataSource={nlb.ports.map(v => ({ key: JSON.stringify(v), ...v }))} />
              </section>
            </Tabs.TabPane>
            <Tabs.TabPane key="2" tab="监控信息">
              <Empty description="开发中....." />
            </Tabs.TabPane>
          </Tabs>
        )}
      >
        <Row className={`${styles.wrap} wrap`}>
          <Col className={styles.content} xs={24} lg={12}>
            <Descriptions>
              <Descriptions.Item label="应用服务" span={3}>
                {nlb.app_name}
              </Descriptions.Item>
              <Descriptions.Item label="服务类型" span={3}>
                {nlb.app_type}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </PageHeader>
    </>
  )
}

export default Ingress;


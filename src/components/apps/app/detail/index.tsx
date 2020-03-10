import { Descriptions, PageHeader, Breadcrumb, Tag, Col, Row, Statistic, Button, Icon } from 'antd';
import Time from 'react-time-format';
import { IApp, IService } from '@/models/apps/apps';
import Link from 'umi/link';
import router from 'umi/router';
import { Inputs } from 'library';
import Context from '../context';
import { useState } from 'react';
import Edit from '../edit';
import EService from '../edit-service';
import styles from './style/index.less';

export interface ServiceProps {
  service: IService;
  app: IApp;
  reloadBtn?: React.ReactNode;
}

const EditApp = ({ app }: any) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button type="primary" onClick={() => { setVisible(true) }}>
        编辑容器
      </Button>
      <Edit data={app} visible={visible} onClose={() => setVisible(false)} />
    </>
  )
}


const EditService = ({ app }: any) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button type="primary" onClick={() => { setVisible(true) }}>
        编辑服务
      </Button>
      <EService data={app} visible={visible} onClose={() => setVisible(false)} />
    </>
  )
}

const Service: React.FC<ServiceProps> = ({ service, app, reloadBtn, children }) => {
  return (
    <>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        routes={[{
          path: '/dashboard',
          breadcrumbName: '总览',
        }, {
          path: `/apps/list`,
          breadcrumbName: '应用列表',
        }, {
          path: `/apps/list/${app.name}?namespace=${app.namespace}&type=${app.type}`,
          breadcrumbName: '应用详情',
        }]}
        itemRender={(route, _, routes) => {
          const last = routes.indexOf(route) === routes.length - 1;
          return last ? <span>{route.breadcrumbName}</span> : <Link to={route.path}>{route.breadcrumbName}</Link>;
        }}
      />
      <PageHeader
        className="box"
        style={{ minHeight: '100%' }}
        title={app.name}
        onBack={router.goBack}
        tags={[<Tag
          key="status"
          color={(app.instances || []).length > 0 && (app.instances || []).every(v => v.status === 'Running') ? 'green' : 'red'}>
          {(app.instances || []).length > 0 && (app.instances || []).every(v => v.status === 'Running') ? <span style={{ color: '#52c41a' }}>运行中</span> : <span style={{ color: '#f5222d' }}>异常</span>}
        </Tag>, <Tag key="type">{app.type}</Tag>] as any}
        extra={[
          <EditApp key="edit" app={app} />,
          <EditService key="service" app={{ ...app, service: service.name ? service : undefined }} />,
          reloadBtn,
        ]}
        footer={children}
      >
        <Row className={`${styles.wrap} wrap`}>
          <Col className={styles.content} xs={24} lg={12}>
            <Descriptions>
              <Descriptions.Item label="类型" span={3}>
                {({
                  "Deployment": "Deployment（可扩展的部署Pod）",
                  "DaemonSet": "DaemonSet（在每个主机上运行Pod）",
                  "StatefulSet": "StatefulSet（有状态集的运行Pod）",
                } as any)[app.type]}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间" span={3}>
                <Time format="YYYY-MM-DD  HH:mm" value={new Date(app.create_time)} />
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col className={`${styles.extraContent} extraContent`} xs={24} lg={12}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="Type" value={app.type} />
              </Col>
              <Col span={12}>
                <Statistic title="Replicas" suffix={(
                  <span>
                    {`/ `}
                    < Context.Consumer >
                      {({ modifyReplicas }) => <Inputs.Edit
                        type="number"
                        value={app.replicas}
                        onChange={(replicas) => modifyReplicas!({
                          ...app,
                          app_type: app.type,
                          replicas: Number(replicas)
                        })}
                      >
                      </Inputs.Edit>}
                    </Context.Consumer>
                  </span>
                )} value={app.replicas} />
              </Col>
            </Row>
          </Col>
        </Row>
      </PageHeader>
    </>
  )
}

export default Service;


import { Row, Col } from 'antd';
import { Page } from 'library';
import Metrics from './basic/detail';
import Images from './basic/images';
import Node from './basic/node';
import Users from './basic/users';
import Namespace from './basic/namespace';
import RealtimeLoad from './basic/realtimeload';

const Dashboard = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Page title="">
        <Row gutter={16}>
          <Col span={24} style={{ marginBottom: 16, }}>
          </Col>
          <Col sm={24} md={12} xl={8} style={{ marginBottom: 16, }}>
            <Metrics />
            <Images />
            <Users />
          </Col>

          <Col sm={24} md={12} xl={16} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={24} style={{ marginBottom: 16 }}>
                <RealtimeLoad />
              </Col>
              <Col span={24} style={{ marginBottom: 16 }}>
                <Namespace />
              </Col>
              <Col span={24} style={{ marginBottom: 16 }}>
                <Node />
              </Col>
            </Row>
          </Col>
        </Row>
      </Page>
    </div>
  )
}

export default Dashboard;
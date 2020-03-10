
import { Row, Col } from 'antd';
import Network from './Network';
import Packets from './Packets';
import Tcpestab from './Tcpestab';

export default (props) => {
    return (
        <Row style={{ boxShadow: `1px 0px 6px rgba(0, 0, 0, 0.1)`, backgroundColor: '#fff' }}>
            <Col span={8}>
                <Network {...props} />
            </Col>
            <Col span={8}>
                <Packets {...props} />
            </Col>
            <Col span={8}>
                <Tcpestab {...props} />
            </Col>
        </Row>
    )
}
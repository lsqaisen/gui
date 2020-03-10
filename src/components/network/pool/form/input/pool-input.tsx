import * as React from "react";
import { Row, Col, InputNumber } from "antd";
import { Inputs } from 'library';

export default class extends React.PureComponent<any, any> {
  render() {
    const { value, onChange } = this.props;
    const [ip, cidr = 24] = value.split('/');
    return (
      <Row>
        <Col span={12}>
          <Inputs.IP
            value={ip}
            placeholder="节点IP起始地址"
            onChange={v => onChange(`${v.target.value}/${cidr}`)}
          />
        </Col>
        <Col span={6}>
          <InputNumber
            style={{ width: '100%' }}
            placeholder="cidr"
            value={cidr}
            onChange={v => onChange(`${ip}/${v}`)}
          />
        </Col>
      </Row>
    )
  }
}
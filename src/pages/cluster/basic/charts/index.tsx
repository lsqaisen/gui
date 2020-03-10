import { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { createSelector } from 'reselect';
import { Row, Col, Select, Radio } from 'antd';
import Cpu from './cpu';
import Mem from './mem';
import SystemLoad from './systemload';
import FileSystem from './filesystem';
import Io from './io';
import Inode from './inode';
import Tcpestab from './tcpestab';
import Network from './network';
import Packets from './packets';

const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(createSelector(
  [
    (props: any) => props.node.nodes['$all'] || [],
  ],
  (nodes) => ({ nodes })
))
class Metric extends PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: props.name || '.*',
      nodes: [],
      dur: 60 * 10,
      step: 5,
    }
  }
  get = () => {
    return this.props.dispatch({
      type: 'node/nodes',
    })
  }
  componentDidMount() {
    this.get();
  }
  render() {
    const { nodes: { data = [] } } = this.props;
    const { name, step, dur } = this.state;
    return (
      <Fragment>
        <Row style={{ margin: '24px 0' }}>
          {this.props.name ? null : (
            <Col sm={24}>
              <label style={{ marginRight: 56 }}>
                {`节点：`}
                <Select value={name} style={{ width: '240px' }} onChange={name => this.setState({ name })}>
                  <Option key='.*'>所有节点{`(${data.length})`}</Option>
                  {data.map((node: any) => <Option key={node.name}>{node.name}</Option>)}
                </Select>
              </label>
            </Col>
          )}
          <Col sm={24}>
            <label>
              {`时间：`}
              <RadioGroup value={dur} onChange={e => this.setState({
                dur: e.target.value,
                step: e.target.value == 60 * 10 ? 5 : e.target.value / 180
              })}>
                <RadioButton value={60 * 10}>实时</RadioButton>
                <RadioButton value={60 * 60 * 3}>近3小时</RadioButton>
                <RadioButton value={60 * 60 * 12}>近12小时</RadioButton>
                <RadioButton value={60 * 60 * 24}>近24小时</RadioButton>
                <RadioButton value={60 * 60 * 24 * 3}>近3天</RadioButton>
                <RadioButton value={60 * 60 * 24 * 7}>近7天</RadioButton>
              </RadioGroup>
            </label>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col md={8} sm={24} >
            <Cpu name={name} dur={dur} step={step} />
          </Col>
          <Col md={8} sm={24}>
            <Mem name={name} dur={dur} step={step} />
          </Col>
          <Col md={8} sm={24}>
            <SystemLoad name={name} dur={dur} step={step} />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col md={6} sm={24}>
            <FileSystem name={name} dur={dur} step={step} />
          </Col>
          <Col md={9} sm={24}>
            <Io name={name} dur={dur} step={step} />
          </Col>
          <Col md={9} sm={24}>
            <Inode name={name} dur={dur} step={step} />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col md={8} sm={24}>
            <Tcpestab name={name} dur={dur} step={step} />
          </Col>
          <Col md={8} sm={24}>
            <Network name={name} dur={dur} step={step} />
          </Col>
          <Col md={8} sm={24}>
            <Packets name={name} dur={dur} step={step} />
          </Col>
        </Row>
      </Fragment>
    )
  }
}


export default Metric;
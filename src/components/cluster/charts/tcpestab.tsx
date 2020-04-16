import {PureComponent} from 'react';
import {Row, Col, Statistic, PageHeader} from 'antd';
import basic, {BasicProps} from './basic';
import {Charts} from 'library';
import Empty from './basic/empty';

const Chart = Charts.Simple;

export interface TcpestabProps extends BasicProps {
  timeMask: string;
}

@basic
class Tcpestab extends PureComponent<TcpestabProps, any> {
  render() {
    const {data, timeMask} = this.props;
    if (data!.length <= 0) return <Empty description="暂无TCP连接数数据" />;
    return (
      <PageHeader style={{padding: 0}} title="TCP连接数">
        <Row>
          <Col style={{paddingBottom: 16}}>
            <Statistic suffix="（个）" value={data!.slice(-1)[0].value} />
          </Col>
          <Col span={24}>
            <Chart
              line
              type="area"
              min={undefined}
              timeMask={timeMask}
              symbol="个"
              color={['#286cff']}
              data={data}
            />
          </Col>
        </Row>
      </PageHeader>
    );
  }
}

export default Tcpestab;

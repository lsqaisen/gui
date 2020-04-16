import {PureComponent} from 'react';
import {Row, Col, PageHeader} from 'antd';
import basic, {BasicProps} from './basic';
import {Charts} from 'library';
import Empty from './basic/empty';

const Chart = Charts.Contrast;

export interface IoProps extends BasicProps {
  timeMask: string;
}

@basic
class Io extends PureComponent<IoProps, any> {
  render() {
    const {data, timeMask} = this.props;
    if (data!.length <= 0) return <Empty description="暂无磁盘读写请求数据" />;
    return (
      <PageHeader style={{padding: 0}} title="磁盘读写请求">
        <Row gutter={24}>
          <Col span={24} style={{height: 260}}>
            <Chart
              timeMask={timeMask}
              color={['#0db46eaa', '#286cffaa', '#286cff', '#0db46e']}
              data={data}
            />
          </Col>
        </Row>
      </PageHeader>
    );
  }
}

export default Io;

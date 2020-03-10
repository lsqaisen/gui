import { PureComponent } from 'react';
import { Row, Col, PageHeader } from 'antd';
import basic, { BasicProps } from './basic';
import { Charts } from 'library';
import Empty from './basic/empty';

const Chart = Charts.Simple;

export interface InodeProps extends BasicProps {
  timeMask: string
}

@basic
class Inode extends PureComponent<InodeProps, any> {
  render() {
    const { data, timeMask } = this.props;
    if (data!.length <= 0) return (<Empty description="暂无Inode监控数据" />);
    return (
      <PageHeader style={{ padding: 0 }} title="Inode使用率">
        <Row gutter={24}>
          <Col span={24} style={{ height: 260 }}>
            <Chart line type="area" timeMask={timeMask} color={["#286cff"]} data={data} />
          </Col>
        </Row>
      </PageHeader>
    )
  }
}

export default Inode;
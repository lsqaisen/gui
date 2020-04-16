import {PureComponent} from 'react';
import {PageHeader} from 'antd';
import basic, {BasicProps} from './basic';
import {Charts} from 'library';
import Empty from './basic/empty';

const Chart = Charts.Simple;

export interface PacketsProps extends BasicProps {
  timeMask: string;
}

@basic
class Packets extends PureComponent<PacketsProps, any> {
  render() {
    const {data, timeMask} = this.props;
    if (data!.length <= 0)
      return <Empty description="暂无网络流入流出数据包" />;
    return (
      <PageHeader style={{padding: 0}} title="网络流入流出数据包（pps）">
        <Chart
          height={308}
          legend={{position: 'top'}}
          min={undefined}
          line
          type="area"
          timeMask={timeMask}
          color={['#286cff', '#0db46e', '#ff9000']}
          data={data}
          symbol="pps"
        />
      </PageHeader>
    );
  }
}

export default Packets;

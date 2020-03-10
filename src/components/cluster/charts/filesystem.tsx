import { PureComponent } from 'react';
import { PageHeader, Statistic } from 'antd';
import { Charts } from 'library';
import basic, { BasicProps } from './basic';

const Chart = Charts.Circle;

export interface FileSystemProps extends BasicProps {
  timeMask: string;
  pused: number;
}

@basic
class FileSystem extends PureComponent<FileSystemProps, any> {
  render() {
    const { total, used, pused, timeMask } = this.props;
    return (
      <PageHeader style={{ padding: 0 }} title="磁盘使用情况">
        <Statistic
          title="磁盘使用量"
          value={used}
          suffix={`(${pused}%)/ ${total}`}
        />
        <Chart line type="area" timeMask={timeMask} color={["#286cff", "#eceef1"]} data={[{ type: '磁盘', value: Number(pused) }]} />
      </PageHeader>
    )
  }
}

export default FileSystem;
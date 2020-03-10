import { PureComponent, Fragment } from 'react';
import { Divider } from 'antd';
import * as G2 from '@antv/g2';
import { utils, EllipsisTooltip } from 'library';
import styles from './style/chart.less';

const generateUUID = utils.generateUUID;

interface ChartDataProps {
  title: string;
  actual: number;
  request: number;
}

export interface ChartProps {
  id?: string;
  color?: string;
  symbol?: string;
  percent?: number;
  extra?: any;
  data?: ChartDataProps[];
}

class Cpu extends PureComponent<ChartProps, any> {
  static readonly defaultProps: ChartProps = {
    id: `${new Date().getTime()}`,
    symbol: '%',
    percent: 100,
    data: [],
  }

  chart: any = undefined;

  id: any = generateUUID();

  UNSAFE_componentWillReceiveProps({ data = [] }: ChartProps) {
    if (JSON.stringify(data) !== JSON.stringify(this.props.data)) {
      this.chart.changeData(data);
    }

  }
  componentDidMount() {
    const { color, symbol, percent, data } = this.props;
    this.chart = new G2.Chart({
      container: this.id,
      forceFit: true,
      height: 36,
      padding: [10, 0, 10, 0]
    })
    const chart = this.chart;
    chart.source(data, {
      actual: {
        min: 0,
        max: percent,
        nice: false
      },
      request: {
        min: 0,
        max: percent,
        nice: false
      }
    })
    chart.legend(false);
    chart.axis(false);
    chart.tooltip(false);

    chart.coord().transpose();
    chart.guide().region({
      start: [-1, 0],
      end: [1, percent!],
      style: {
        fontSize: 12,
        fill: '#d8e4fd',
        fillOpacity: 1
      }
    });
    chart.interval().position('title*actual').color('actual', (val: any) => {
      if (val > data![0].request) return '#ff5242';
      return color;
    }).size(15).label('actual', (val: any) => {
      return {
        textStyle: {
          fontSize: '12px',
          fill: val > data![0].request ? '#ff5242' : color,
        },
        offset: 10,
        formatter(text: any) {
          return `${text}${symbol}`;
        }
      }
    });
    chart.point().position('title*request').color('#ff9000').shape('line').size(12).style({
      lineWidth: 1.5
    });
    chart.render();
  }
  render() {
    const { extra } = this.props;
    return (
      <Fragment>
        <div className={`${styles.cpu} fl`} id={this.id} />
        <Divider className={`${styles.divider} fl`} type="vertical" />
        <div className={`${styles.extra} fl`} style={{ lineHeight: '36px', width: 'calc(50% - 17px)', whiteSpace: 'nowrap' }}>
          <EllipsisTooltip title={extra}>{extra}</EllipsisTooltip>
        </div>
      </Fragment>
    )
  }
}

export default Cpu;

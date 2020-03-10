import { PureComponent } from 'react';
import * as G2 from '@antv/g2'
import Chart, { Types } from './basic';

export interface MultiProps {
  types: { [key: string]: any },
  color?: string[];
  symbol?: string;
  timeMask?: string;
  data?: any[];
  scale?: any;
  padding?: any;
  initDraw?: (chart: G2.Chart) => void;
}

class Multi extends PureComponent<MultiProps, any> {
  static readonly defaultProps: MultiProps = {
    types: ['line', 'area'],
    symbol: '%',
    timeMask: 'mm:ss',
    color: ['#286cff'],
    data: [],
    initDraw: () => null,
  }

  chart: G2.Chart | null | undefined;

  initDraw = (chart: G2.Chart) => {
    const { scale, types, timeMask, color, data, initDraw } = this.props;
    const _scale = scale || {
      time: {
        type: 'time',
        mask: timeMask
      },
      ...types,
    };

    chart.source(data, _scale);
    chart.line().position('time*value').color('name', color!);
    initDraw!(chart);
  }

  UNSAFE_componentWillReceiveProps({ data = [], timeMask }: MultiProps) {
    if (JSON.stringify(data) !== JSON.stringify(this.props.data)) {
      this.chart!.changeData(data);
    }
    if (timeMask !== this.props.timeMask) {
      this.chart!.scale({
        time: {
          type: 'time',
          mask: timeMask,
        }
      });
    }
  }
  render() {
    return (
      <Chart
        {...this.props}
        ref={(ref: any) => ref && (this.chart = ref.chart)}
        onDraw={this.initDraw}
      />
    )
  }
}

export default Multi;

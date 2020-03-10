import { PureComponent } from 'react';
import * as G2 from '@antv/g2'
import Chart, { Types } from './basic';

export interface SimpleProps {
  min?: number;
  max?: number;
  legend?: any;
  line?: boolean;
  axis?: boolean;
  tooltip?: boolean;
  type?: Types;
  color?: string[];
  symbol?: string;
  timeMask?: string;
  padding?: any,
  data?: any[];
  height?: number;
  opacity?: number;
  formatter?: (val: any) => any;
  initDraw?: (chart: G2.Chart) => void;
}

class Simple extends PureComponent<SimpleProps, any> {
  static readonly defaultProps: SimpleProps = {
    min: 0,
    max: undefined,
    legend: false,
    line: false,
    axis: true,
    tooltip: true,
    type: 'line',
    symbol: '%',
    timeMask: 'mm:ss',
    opacity: 1,
    color: ['#286cff'],
    data: [],
    initDraw: () => null,
  }

  chart: G2.Chart | null | undefined;

  initDraw = (chart: G2.Chart) => {
    const { min, max, legend, line, axis, tooltip, type, data, symbol, color, formatter, opacity, timeMask, initDraw } = this.props;
    chart.legend(legend!);
    chart.source(data);
    chart.axis(axis!);
    chart.tooltip(tooltip!)
    chart.scale({
      value: {
        min: min || min === 0 ? min : undefined,
        max: max,
        type: 'linear',
        sync: true,
        formatter: formatter ? formatter : (val: any) => {
          return `${val}${symbol}`
        },
      },
      time: {
        type: 'time',
        mask: timeMask,
      }
    });
    if (type !== 'line' && line) {
      chart.line().position('time*value').color("title", color!).shape('smooth');
    }
    chart[type!]().position('time*value').color("title", color!).shape('smooth').opacity(line ? .3 : opacity!);
    initDraw!(chart);
  }

  UNSAFE_componentWillReceiveProps({ data = [], timeMask }: SimpleProps) {
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

export default Simple;

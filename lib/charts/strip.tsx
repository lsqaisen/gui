import { PureComponent } from 'react';
import * as G2 from '@antv/g2'
import Chart, { Types } from './basic';

export interface RadialBarProps {
  title: string;
  min?: number;
  max?: number;
  legend?: any;
  line?: boolean;
  axis?: boolean;
  tooltip?: boolean;
  color?: string[];
  symbol?: string;
  padding?: any,
  data?: any[];
  height?: number;
  opacity?: number;
  formatter?: (val: any) => any;
  initDraw?: (chart: G2.Chart) => void;
}

class RadialBar extends PureComponent<RadialBarProps, any> {
  static readonly defaultProps: RadialBarProps = {
    title: '',
    min: 0,
    max: undefined,
    legend: false,
    line: false,
    axis: true,
    tooltip: true,
    symbol: '%',
    opacity: 1,
    color: undefined,
    data: [],
    initDraw: () => null,
  }

  chart: G2.Chart | null | undefined;

  initDraw = (chart: G2.Chart) => {
    const { title, legend, axis, color, data, min, max, symbol, formatter, initDraw } = this.props;
    chart.source(data, {
      value: {
        min: min || min === 0 ? min : undefined,
        max: max,
        formatter: formatter ? formatter : (val: any) => {
          return `${val}${symbol}`
        },
      }
    });
    chart.interval().position('date*expected').color('#752136').shape('borderRadius').tooltip('expected').opacity(0.6);
    chart.interval().position('date*actual').color('#db0d2d').tooltip('actual').shape('date*actual', function (date, val) {
      if (val === 0) {
        return;
      } else {
        return 'borderRadius';
      }
    });
    initDraw!(chart);
  }

  UNSAFE_componentWillReceiveProps({ data = [] }: RadialBarProps) {
    if (JSON.stringify(data) !== JSON.stringify(this.props.data)) {
      this.chart!.changeData(data);
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

export default RadialBar;

import {PureComponent} from 'react';
import * as G2 from '@antv/g2';
import Chart, {Types} from './basic';

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
  padding?: any;
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
    initDraw: () => null
  };

  chart: G2.Chart | null | undefined;

  initDraw = (chart: G2.Chart) => {
    const {
      title,
      legend,
      axis,
      color,
      data,
      min,
      max,
      symbol,
      formatter,
      initDraw
    } = this.props;
    chart.source(data, {
      value: {
        min: min || min === 0 ? min : undefined,
        max: max,
        formatter: formatter
          ? formatter
          : (val: any) => {
              return `${val}${symbol}`;
            }
      }
    });
    chart
      .coord('polar', {
        innerRadius: 0.1
      })
      .transpose();
    chart
      .interval()
      .position('name*value')
      .color('value', color!)
      .tooltip('value')
      .label('value', {
        offset: -5
      });
    data!.map(function(obj) {
      chart.guide().text({
        position: [obj.name, 0],
        content: obj.name + ' ',
        style: {
          textAlign: 'right'
        }
      });
    });
    chart.axis(legend!);
    chart.axis(axis!);
    chart.guide().text({
      position: ['50%', '50%'],
      content: String(title).toLocaleUpperCase(),
      style: {
        textAlign: 'center',
        fontSize: 24,
        fill: '#8543e0'
      }
    });
    initDraw!(chart);
  };

  UNSAFE_componentWillReceiveProps({data = []}: RadialBarProps) {
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
    );
  }
}

export default RadialBar;

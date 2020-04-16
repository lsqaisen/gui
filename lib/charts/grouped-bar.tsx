import {PureComponent} from 'react';
import * as G2 from '@antv/g2';
import Chart, {Types} from './basic';

export interface GroupedBarProps {
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

class GroupedBar extends PureComponent<GroupedBarProps, any> {
  static readonly defaultProps: GroupedBarProps = {
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
      legend,
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
        nice: false,
        formatter: formatter
          ? formatter
          : (val: any) => {
              return `${val}${symbol}`;
            }
      }
    });
    chart.axis('name', {
      label: {
        textStyle: {
          fill: '#aaaaaa',
          fontSize: 12
        }
      },
      tickLine: {
        alignWithLabel: false,
        length: 0
      }
    });
    chart.axis('value', {
      label: {
        textStyle: {
          fill: '#aaaaaa',
          fontSize: 12
        }
      },
      title: {
        offset: 30,
        textStyle: {
          fontSize: 14,
          fontWeight: 300
        }
      }
    });
    chart.legend(true);
    chart.coord().transpose();
    chart
      .interval()
      .position('name*value')
      .color('type', color!)
      .opacity(1)
      .adjust([
        {
          type: 'dodge',
          marginRatio: 0.3
        }
      ]);
    initDraw!(chart);
  };

  UNSAFE_componentWillReceiveProps({data = [], timeMask}: GroupedBarProps) {
    if (JSON.stringify(data) !== JSON.stringify(this.props.data)) {
      this.chart!.changeData(data);
    }
    if (timeMask !== this.props.timeMask) {
      this.chart!.scale({
        time: {
          type: 'time',
          mask: timeMask
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
    );
  }
}

export default GroupedBar;

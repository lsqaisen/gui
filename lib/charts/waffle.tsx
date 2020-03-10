import { PureComponent } from 'react';
import * as G2 from '@antv/g2'
import * as DataSet from '@antv/data-set'
import Chart, { Types } from './basic';

export interface WaffleProps {
  line?: boolean;
  type?: Types;
  color?: string[];
  symbol?: string;
  timeMask?: string;
  data?: any[];
  padding?: any;
  imageMap: any;
  initDraw?: (chart: G2.Chart) => void;
}

class Waffle extends PureComponent<WaffleProps, any> {
  static readonly defaultProps: WaffleProps = {
    line: false,
    type: 'line',
    symbol: '%',
    timeMask: 'mm:ss',
    color: ['#286cff'],
    data: [],
    imageMap: {},
    initDraw: () => null,
  }

  chart: G2.Chart | null | undefined;

  initDraw = (chart: G2.Chart) => {
    const { line, type, color, data, imageMap, initDraw } = this.props;

    var dv = new DataSet.View().source(data).transform({
      type: 'waffle',
      maxCount: 500,
      rows: 5
    });

    chart.source(dv);
    chart.scale({
      x: {
        nice: false
      },
      y: {
        nice: false
      }
    });
    chart.axis(false);
    chart.legend('name', {
      position: 'bottom'
    });
    chart.legend(false);
    chart.point().position('x*y').size(265 / 12).shape('name', (name: any) => {
      return ['image', imageMap[name]];
    });
  }

  UNSAFE_componentWillReceiveProps({ data = [], timeMask }: WaffleProps) {
    if (JSON.stringify(data) !== JSON.stringify(this.props.data)) {
      var dv = new DataSet.View().source(data).transform({
        type: 'waffle',
      });
      this.chart!.source(dv);
      // this.chart!.changeData(dv);
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

export default Waffle;

import { PureComponent } from 'react';
import * as G2 from '@antv/g2'
import Chart, { Types } from './basic';

export interface MirrorProps {
  min?: number;
  max?: number;
  size?: number;
  color?: string[];
  symbol?: string;
  timeMask?: string;
  data?: any[];
  scale?: any;
  padding?: any;
  initDraw?: (chart: G2.Chart) => void;
}

class Mirror extends PureComponent<MirrorProps, any> {
  static readonly defaultProps: MirrorProps = {
    min: 0,
    max: undefined,
    size: 20,
    symbol: '%',
    timeMask: 'mm:ss',
    color: ['#286cff'],
    data: [],
    initDraw: () => null,
  }

  chart: G2.Chart | null | undefined;

  initDraw = (chart: G2.Chart) => {
    const { min, max, size, scale, timeMask, color, data, initDraw } = this.props;
    const _scale = scale || {
      time: {
        type: 'time',
        mask: timeMask
      },
      value: {
        min: min || min === 0 ? min : undefined,
        max: max,
      }
    };

    chart.source(data, _scale);
    chart.facet('mirror', {
      fields: ['name'],
      padding: [0, 0, 40, 0] as any,
      eachView: function eachView(view) {
        view.interval().position('time*value').color('name', color!).size(size!);
      }
    });
    initDraw!(chart);
  }

  UNSAFE_componentWillReceiveProps({ data = [], timeMask }: MirrorProps) {
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

export default Mirror;

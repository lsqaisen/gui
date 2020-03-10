import { PureComponent } from 'react';
import { Tooltip } from 'antd';

export interface EllipsisTooltipProps {
  title?: any;
  width?: number | string;
}

class EllipsisTooltip extends PureComponent<EllipsisTooltipProps, any> {
  static defaultProps = {
    width: '100%'
  }
  state = {
    visible: false
  }
  container: any = null;
  handleVisibleChange = (visible: boolean) => {
    if (this.container.clientWidth < this.container.scrollWidth) {
      this.setState({
        visible: visible
      })
    }
  }
  render() {
    return (
      <Tooltip visible={this.state.visible} onVisibleChange={this.handleVisibleChange} title={this.props.title}>
        <div ref={node => this.container = node as any} style={{
          float: 'left',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          maxWidth: this.props.width,
        }}>{this.props.children}</div>
      </Tooltip>
    )
  }
}

export default EllipsisTooltip;
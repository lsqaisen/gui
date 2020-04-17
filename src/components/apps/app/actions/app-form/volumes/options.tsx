import {PureComponent} from 'react';
import {Button, Drawer, Input} from 'antd';
import {WrappedFormUtils} from 'antd/lib/form/Form';

export type OptionsProps = {
  title: string;
  dump: (value: any) => any;
};

export type VolumeOptionsProps = {
  value?: any;
  onChange?: (value: any) => void;
  [key: string]: any;
};

const options = ({title, dump}: OptionsProps) => (
  Component: React.ComponentType<any>
) =>
  class extends PureComponent<VolumeOptionsProps, any> {
    form?: WrappedFormUtils;
    state = {
      visible: true,
    };
    componentDidMount() {
      this.setState({visible: false});
    }
    render() {
      const {value = {}, onChange = () => null, ...props} = this.props;
      const {visible} = this.state;
      return (
        <>
          <Input
            value={dump(value)}
            placeholder="点击配置"
            onFocus={() => this.setState({visible: true})}
          />
          <Drawer
            destroyOnClose={false}
            bodyStyle={{height: 'calc(100% - 108px)', overflow: 'auto'}}
            title={title}
            width={480}
            placement="right"
            onClose={() => {
              this.setState({visible: false});
            }}
            visible={visible}
          >
            <Component
              value={value}
              ref={(ref: any) => {
                ref && (this.form = ref);
              }}
              onChange={onChange}
              {...props}
            />
            <div className={'drawer-bottom-actions'}>
              <Button
                onClick={() => {
                  this.setState({visible: false});
                }}
                style={{marginRight: 8}}
              >
                取消
              </Button>
              <Button
                onClick={() => {
                  this.form!.validateFields(
                    async (errors: any, values: any) => {
                      if (!errors) {
                        this.setState({visible: false});
                        onChange(values);
                      }
                    }
                  );
                }}
                type="primary"
              >
                确认
              </Button>
            </div>
          </Drawer>
        </>
      );
    }
  };

export default options;

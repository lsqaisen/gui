import * as React from 'react';
import {WrappedFormUtils} from 'antd/lib/form/Form';
import {Drawer, Button} from 'antd';
import Loading from '../loading';
import styles from './style/index.less';

export interface MakeDrawerFormProps<P> {
  width?: string | number;
  canFullScreen?: boolean;
  btn?: React.ReactNode;
  btnText?: string;
  btnIcon?: React.ReactNode;
  submit?: (values: P) => Promise<any> | void;
  onCreate?: (data: any) => void;
}

interface MakeDrawerFormState {
  loading: boolean;
  visible: boolean;
  show: boolean;
  fullscreen: boolean;
}

const makeDrawerForm = <P extends any, C extends MakeDrawerFormProps<P>>(
  Component: React.ComponentType<C>
) => {
  return class extends React.PureComponent<C, MakeDrawerFormState> {
    form?: WrappedFormUtils;

    state = {
      loading: false,
      visible: false,
      show: false,
      fullscreen: false,
    };

    render() {
      const {
        width = 640,
        canFullScreen,
        btn,
        btnText = '添加',
        btnIcon,
        submit = () => null,
        onCreate = () => null,
        ...props
      } = this.props;
      const {loading, visible, show, fullscreen} = this.state;
      return (
        <>
          {btn ? (
            React.cloneElement(btn as any, {
              onClick: () => {
                this.setState({visible: true});
              },
            })
          ) : (
            <Button
              type="primary"
              onClick={() => {
                this.setState({visible: true});
              }}
            >
              {btnText}
              {btnIcon}
            </Button>
          )}
          <Drawer
            className={styles['make-drawer']}
            bodyStyle={{height: 'calc(100% - 108px)', overflow: 'auto'}}
            destroyOnClose
            maskClosable={false}
            title={
              canFullScreen ? (
                <>
                  <Button
                    type="link"
                    icon={!fullscreen ? 'fullscreen' : 'fullscreen-exit'}
                    onClick={() => this.setState({fullscreen: !fullscreen})}
                  />
                  {btnText}
                </>
              ) : (
                btnText
              )
            }
            width={fullscreen ? '100%' : width}
            placement="right"
            onClose={() => {
              this.setState({visible: false, fullscreen: false});
            }}
            visible={visible}
            afterVisibleChange={(visible) => {
              visible && this.setState({show: true});
            }}
          >
            <Loading loading={!show}>
              <Component
                ref={(ref: any) => {
                  ref && (this.form = ref);
                }}
                {...(props as C)}
              />
            </Loading>
            <div className={styles['drawer-bottom-actions']}>
              <Button
                onClick={() => {
                  this.setState({visible: false, fullscreen: false});
                }}
                style={{marginRight: 8}}
              >
                取消
              </Button>
              <Button
                loading={loading}
                onClick={() => {
                  this.form!.validateFieldsAndScroll(
                    async (error: any, values: P) => {
                      if (!error) {
                        this.setState({loading: true});
                        if ((await submit!(values)) as any) {
                          this.setState({loading: false});
                        } else {
                          onCreate(values);
                          this.setState({
                            visible: false,
                            fullscreen: false,
                            loading: false,
                          });
                        }
                      }
                    }
                  );
                }}
                type="primary"
              >
                提交
              </Button>
            </div>
          </Drawer>
        </>
      );
    }
  };
};

export default makeDrawerForm;

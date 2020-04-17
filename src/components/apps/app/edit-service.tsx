import EditServiceForm from './form/edit-service';
import Context from './context';

import {PureComponent} from 'react';
import {Button, Drawer} from 'antd';
import {App} from 'api/type/app';

export interface EditServiceProps {
  data?: App;
  visible?: boolean;
  onClose?: () => void;
}

class EditService extends PureComponent<EditServiceProps, any> {
  state = {
    loading: false,
  };

  render() {
    const {visible, data, onClose} = this.props;
    const {loading} = this.state;
    return (
      <Drawer
        destroyOnClose
        maskClosable={false}
        title="编辑容器"
        width={720}
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <EditServiceForm data={data} ref="editapp" />
        <div className={'drawer-bottom-actions'}>
          <Button onClick={onClose} style={{marginRight: 8}}>
            取消
          </Button>
          <Context.Consumer>
            {({modifyService}) => (
              <Button
                loading={loading}
                onClick={() => {
                  (this.refs.editapp as any).validateFields(
                    async (error: any, values: App) => {
                      if (!error) {
                        this.setState({loading: true});
                        // if (values.service) values.service.name = data!.name;
                        if (
                          (await modifyService!({
                            name: data!.name,
                            namespace: data!.namespace,
                            service: values.service,
                          })) as any
                        ) {
                          this.setState({loading: false});
                        } else {
                          this.setState({loading: false});
                          onClose!();
                        }
                      }
                    }
                  );
                }}
                type="primary"
              >
                提交
              </Button>
            )}
          </Context.Consumer>
        </div>
      </Drawer>
    );
  }
}

export default EditService;

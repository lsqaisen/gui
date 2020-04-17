import {PureComponent} from 'react';
import {Button, Drawer} from 'antd';
import EditRulesForm from './form/edit-form';
import {ModifyIngressRulesType} from 'api/type/app';
import {IIngress} from '@/models/apps/ingress';
import {WrappedFormUtils} from 'antd/lib/form/Form';

export interface EditRulesProps {
  data?: IIngress;
  visible?: boolean;
  onClose?: () => void;
  submit?: (value: ModifyIngressRulesType) => Promise<any>;
}

class EditRules extends PureComponent<EditRulesProps, any> {
  form?: WrappedFormUtils;
  static readonly defaultProps = {
    submit: () => null,
  };

  state = {
    loading: false,
  };

  render() {
    const {visible, data, onClose, submit} = this.props;
    const {loading} = this.state;
    return (
      <Drawer
        destroyOnClose
        maskClosable={false}
        title="编辑转发规则"
        width={482}
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <EditRulesForm ref={(ref: any) => (this.form = ref)} value={data} />
        <div className={'drawer-bottom-actions'}>
          <Button onClick={onClose} style={{marginRight: 8}}>
            取消
          </Button>
          <Button
            loading={loading}
            onClick={() => {
              this.form!.validateFields(
                async (error: any, values: ModifyIngressRulesType) => {
                  if (!error) {
                    this.setState({loading: true});
                    if ((await submit!(values)) as any) {
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
        </div>
      </Drawer>
    );
  }
}

export default EditRules;

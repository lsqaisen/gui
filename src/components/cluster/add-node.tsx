import {PureComponent, Fragment} from 'react';
import {Form, Button, Drawer} from 'antd';
import {ImportOutlined} from '@ant-design/icons';
import AddNodeForm from './form/add-node-form';
import {addNodesRequest} from 'api/type/cluster';
import styles from './style/chart.less';

export interface AddNodeProps {
  onSubmit?: (value: addNodesRequest) => any;
}

class AddNode extends PureComponent<AddNodeProps, any> {
  static readonly defaultProps: AddNodeProps = {
    onSubmit: () => null
  };

  state = {
    loading: false,
    visible: false
  };

  render() {
    const {onSubmit} = this.props;
    const {loading, visible} = this.state;
    return (
      <Fragment>
        <Button
          className={styles.btn}
          type="primary"
          onClick={() => {
            this.setState({visible: true});
          }}
        >
          <ImportOutlined /> 安装节点
        </Button>
        <Drawer
          bodyStyle={{height: 'calc(100% - 108px)', overflow: 'auto'}}
          title="安装节点"
          width={500}
          placement="right"
          onClose={() => {
            this.setState({visible: false});
          }}
          visible={visible}
        >
          <Form
            name="add-node"
            colon={false}
            labelAlign="left"
            initialValues={{
              account: 'root'
            }}
            onFinish={async values => {
              this.setState({loading: true});
              if (await onSubmit!(values as addNodesRequest)) {
                this.setState({loading: false});
              } else {
                this.setState({visible: false, loading: false});
              }
            }}
          >
            <AddNodeForm />
            <div className={'drawer-bottom-actions'}>
              <Button
                onClick={() => {
                  this.setState({visible: false});
                }}
                style={{marginRight: 8}}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                提交
              </Button>
            </div>
          </Form>
        </Drawer>
      </Fragment>
    );
  }
}

export default AddNode;

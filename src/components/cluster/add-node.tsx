import { PureComponent, Fragment } from 'react';
import { Icon, Button, Drawer } from 'antd';
import AddNodeForm from './form/add-node-form';
import { installRequest } from '@/services/node';
import styles from './style/chart.less';

export interface AddNodeProps {
  onSubmit?: (value: installRequest) => any
}

class AddNode extends PureComponent<AddNodeProps, any> {
  static readonly defaultProps: AddNodeProps = {
    onSubmit: () => null
  };

  state = {
    loading: false,
    visible: false,
  }

  render() {
    const { onSubmit } = this.props;
    const { loading, visible } = this.state;
    return (
      <Fragment >
        <Button className={styles.btn} type="primary" onClick={() => { this.setState({ visible: true }) }}>
          <Icon type="import" /> 安装节点
        </Button>
        <Drawer
          bodyStyle={{ height: 'calc(100% - 108px)', overflow: 'auto' }}
          title="安装节点"
          width={500}
          placement="right"
          onClose={() => { this.setState({ visible: false }) }}
          visible={visible}
        >
          <AddNodeForm ref="addnode" />
          <div className={"drawer-bottom-actions"} >
            <Button onClick={() => { this.setState({ visible: false }) }} style={{ marginRight: 8 }}> 取消 </Button>
            <Button loading={loading} onClick={() => {
              (this.refs.addnode as any).validateFields(async (error: any, values: installRequest) => {
                if (!error) {
                  this.setState({ loading: true })
                  if ((await onSubmit!({ ...values, addresses: (values.addresses as any).list })) as any) {
                    this.setState({ loading: false })
                  } else {
                    this.setState({ visible: false, loading: false })
                  }
                }
              })
            }} type="primary"> 提交 </Button>
          </div>
        </Drawer>
      </Fragment>
    )
  }
}

export default AddNode;
import { PureComponent, cloneElement } from 'react';
import { Icon, Button, Drawer } from 'antd';
import AddForm, { PrivateFromProps } from './form/add-form';
import { addPrivateRequest } from 'api/type/registry';

export interface AddProps extends PrivateFromProps {
  btn?: React.ReactNode;
  submit?: (value: addPrivateRequest) => void;
}

class Add extends PureComponent<AddProps, any> {
  static readonly defaultProps = {
    submit: () => null
  };

  state = {
    loading: false,
    visible: false,
  }

  render() {
    const { btn, submit } = this.props;
    const { loading, visible } = this.state;
    return (
      <div>
        {btn ? cloneElement(btn as any, {
          onClick: () => { this.setState({ visible: true }) }
        }) : <Button type="primary" onClick={() => { this.setState({ visible: true }) }}>
            添加仓库账号 <Icon type="plus" />
          </Button>}
        <Drawer
          maskClosable={false}
          title="添加仓库账号"
          width={482}
          placement="right"
          onClose={() => { this.setState({ visible: false }) }}
          visible={visible}
        >
          <AddForm ref="add" />
          <div className={"drawer-bottom-actions"} >
            <Button onClick={() => { this.setState({ visible: false }) }} style={{ marginRight: 8 }}> 取消 </Button>
            <Button loading={loading} onClick={() => {
              (this.refs.add as any).validateFields(async (error: any, values: addPrivateRequest) => {
                if (!error) {
                  this.setState({ loading: true })
                  if ((await submit!(values)) as any) {
                    this.setState({ loading: false })
                  } else {
                    this.setState({ visible: false, loading: false })
                  }
                }
              })
            }} type="primary"> 提交 </Button>
          </div>
        </Drawer>
      </div>
    )
  }
}

export default Add;
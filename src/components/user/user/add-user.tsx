import { PureComponent, cloneElement } from 'react';
import { Icon, Button, Drawer } from 'antd';
import AddUserForm from './form/user-form';
import { userRequest } from 'api/type/user';

export interface AddUserProps {
  admin?: boolean;
  btn?: React.ReactNode;
  submit?: (value: userRequest) => void
}

class AddUser extends PureComponent<AddUserProps, any> {
  static readonly defaultProps = {
    submit: () => null
  };

  state = {
    loading: false,
    visible: false,
  }

  render() {
    const { admin, btn, submit } = this.props;
    const { loading, visible } = this.state;
    return (
      <div>
        {btn ? cloneElement(btn as any, {
          onClick: () => { this.setState({ visible: true }) }
        }) : <Button type="primary" onClick={() => { this.setState({ visible: true }) }}>
            添加用户 <Icon type="plus" />
          </Button>}
        <Drawer
          destroyOnClose
          maskClosable={false}
          title="添加用户"
          width={482}
          placement="right"
          onClose={() => { this.setState({ visible: false }) }}
          visible={visible}
        >
          <AddUserForm admin={admin} ref="adduser" />
          <div className={"drawer-bottom-actions"} >
            <Button onClick={() => { this.setState({ visible: false }) }} style={{ marginRight: 8 }}> 取消 </Button>
            <Button loading={loading} onClick={() => {
              (this.refs.adduser as any).validateFields(async (error: any, values: userRequest) => {
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

export default AddUser;
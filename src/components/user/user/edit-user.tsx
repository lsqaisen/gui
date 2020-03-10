import { PureComponent } from 'react';
import { Button, Drawer } from 'antd';
import EditUserForm from './form/user-form';
import { updateUserRequest } from 'api/type/user';
import { IUser } from '@/models/uesr/user';

export interface EditUserProps {
  data?: IUser;
  visible?: boolean;
  onClose?: () => void;
  submit?: (value: updateUserRequest) => void
}

class EditUser extends PureComponent<EditUserProps, any> {
  static readonly defaultProps = {
    submit: () => null
  };

  state = {
    loading: false,
  }

  render() {
    const { visible, data, onClose, submit } = this.props;
    const { loading } = this.state;
    return (
      <Drawer
        destroyOnClose
        maskClosable={false}
        title="添加用户"
        width={482}
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <EditUserForm edit user={data} ref="edituser" />
        <div className={"drawer-bottom-actions"} >
          <Button onClick={onClose} style={{ marginRight: 8 }}> 取消 </Button>
          <Button loading={loading} onClick={() => {
            (this.refs.edituser as any).validateFields(async (error: any, values: updateUserRequest) => {
              if (!error) {
                this.setState({ loading: true })
                if ((await submit!({ ...data, ...values })) as any) {
                  this.setState({ loading: false })
                } else {
                  this.setState({ loading: false })
                  onClose!()
                }
              }
            })
          }} type="primary"> 提交 </Button>
        </div>
      </Drawer>
    )
  }
}

export default EditUser;
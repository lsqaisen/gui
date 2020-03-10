import { PureComponent, Fragment, cloneElement } from 'react';
import { Button, Drawer, Icon, Radio } from 'antd';
import UploadRepositoyForm, { UploadRepositoyFormProps } from './form/upload-repositoy-form';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

export interface UploadRepositoyProps extends UploadRepositoyFormProps {
  btn?: React.ReactNode;
  submit?: (value: any) => void;
}

class UploadRepositoy extends PureComponent<UploadRepositoyProps, any> {
  static readonly defaultProps = {
    submit: () => null,
  };

  state = {
    type: 'internal',
    loading: false,
    visible: false,
  }

  render() {
    const { admin, namespace, username, btn, submit, searchProjects } = this.props;
    const { type, loading, visible } = this.state;
    return (
      <Fragment>
        {btn ? cloneElement(btn as any, {
          onClick: () => { this.setState({ visible: true }) }
        }) : <Button type="primary" onClick={() => { this.setState({ visible: true }) }}>
            上传镜像 <Icon type="plus" />
          </Button>}
        <Drawer
          bodyStyle={{ overflow: 'auto', height: `calc(100% - ${type === 'file' ? 110 : 55}px)` }}
          maskClosable={false}
          title="上传镜像"
          width={482}
          placement="right"
          onClose={() => { this.setState({ visible: false }) }}
          visible={visible}
        >

          {/* <RadioGroup value={type} onChange={(e) => this.setState({ type: e.target.value })}>
            <RadioButton value="file">文件上传</RadioButton>
            <RadioButton value="internal">集群内部上传</RadioButton>
            <RadioButton value="external">集群外部上传</RadioButton>
          </RadioGroup> */}
          <UploadRepositoyForm ref="upload" {...{ type: type as any, admin, namespace, username, searchProjects }} />
          {type === 'file' && <div className={"drawer-bottom-actions"} >
            <Button onClick={() => { this.setState({ visible: false }) }} style={{ marginRight: 8 }}> 取消 </Button>
            <Button loading={loading} onClick={() => {
              (this.refs.upload as any).validateFields(async (error: any, values: any) => {
                if (!error) {
                  this.setState({ loading: true })
                  try {
                    const formData = new FormData(document.getElementById('upload') as any);
                    console.log(formData)
                    if ((await submit!(formData)) as any) {
                      this.setState({ loading: false })
                    } else {
                      this.setState({ loading: false })
                      throw (new Error())
                    }
                  } catch (err) {
                    this.setState({ visible: false, loading: false })
                  }
                }
              })
            }} type="primary"> 提交 </Button>
          </div>}
        </Drawer>
      </Fragment>
    )
  }
}

export default UploadRepositoy;
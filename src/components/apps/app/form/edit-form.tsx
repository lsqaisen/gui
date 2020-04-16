import * as React from 'react';
import {Form, Input, Typography, Radio} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {ColProps} from 'antd/lib/grid/col';
import {App} from 'api/type/app';
import Containers from './app-form/containers';
import Service from './app-form/service';

const FormItem = Form.Item;

export interface EditFormProps extends FormComponentProps {
  data?: App;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
}

@(Form.create() as any)
class EditForm extends React.PureComponent<EditFormProps, any> {
  static readonly defaultProps = {
    form: {},
    labelCol: {xs: 24, md: 4},
    wrapperCol: {xs: 24, md: 20}
  };

  render() {
    const {data, labelCol, wrapperCol, form} = this.props;
    const {getFieldDecorator, getFieldValue} = form;
    const {
      name,
      namespace,
      type = 'Deployment',
      replicas,
      labels,
      volumes,
      containers = [{}],
      service
    } = data || ({} as App);
    console.log(namespace);
    return (
      <Form>
        <FormItem
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          label="命名空间"
          required
        >
          {getFieldDecorator('namespace', {
            initialValue: namespace
          })(<Input disabled />)}
        </FormItem>
        <FormItem
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          label="服务名称"
          extra="最长63个字符，只能包含小写字母、数字和字符‘-’，小写字母开头，小写字母或数字结尾."
          required
        >
          {getFieldDecorator('name', {
            initialValue: name,
            rules: [
              {required: true, message: '服务名称必须填写！'},
              {max: 64, message: '最长63个字符'},
              {
                pattern: /^[a-z0-9-]+$/,
                message: '只能包含小写字母、数字和字符‘-’'
              },
              {pattern: /^[a-z]/, message: '小写字母开头'},
              {pattern: /[a-z0-9]$/, message: '小写字母或数字结尾'}
            ]
          })(<Input disabled style={{maxWidth: 320}} placeholder="服务名称" />)}
        </FormItem>
        <FormItem
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          label="类型"
          required
        >
          {getFieldDecorator('type', {
            initialValue: type
          })(
            <Radio.Group disabled style={{maxWidth: 320}}>
              <Radio value="Deployment">Deployment（可扩展的部署Pod）</Radio>
              <Radio value="DaemonSet">DaemonSet（在每个主机上运行Pod）</Radio>
              <Radio value="StatefulSet">
                StatefulSet（有状态集的运行Pod）
              </Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          labelCol={{span: 24}}
          wrapperCol={{span: 24}}
          label={
            <Typography.Text strong style={{fontSize: '16px'}}>
              实例内容器
            </Typography.Text>
          }
          validateStatus=""
          help=""
        >
          {getFieldDecorator('containers', {
            initialValue: containers,
            rules: []
          })(
            <Containers
              labels={['name', 'image', 'env']}
              volumes={getFieldValue('volumes') || []}
            />
          )}
        </FormItem>
      </Form>
    );
  }
}

export default EditForm;

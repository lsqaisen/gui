import { PureComponent } from 'react';
import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import PoolInput from './input/pool-input';

const FormItem = Form.Item;

export interface ProjectFromProps {
  formItemLayout?: any;
}

@(Form.create() as any)
class AddProjectForm extends PureComponent<FormComponentProps & ProjectFromProps, any> {
  static readonly defaultProps = {
    form: {},
    formItemLayout: {
      labelCol: { xs: 24, md: 5 },
      wrapperCol: { xs: 24, md: 19 },
    },
  };

  render() {
    const { formItemLayout, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label="名称">
          {getFieldDecorator('name', {
            rules: [
              { required: true, message: '子网名称不能为空!' },
              { min: 3, max: 50, message: '名称长度为3~50！' },
              { pattern: /^[a-z0-9]{1,}$/, message: `名称由小写字母、数字组成！` },
              { pattern: /^[^\d]/, message: '开始字符不能是数字' }
            ],
          })(
            <Input placeholder='请输入子网名称' />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="IP池">
          {getFieldDecorator('cidr', {
            initialValue: '10.234.1.0/24',
            rules: [
              { required: true, message: '不能为空!' },

            ],
          })(
            <PoolInput placeholder='请输入备注' />
          )}
        </FormItem>
      </Form>
    )
  }
}

export default AddProjectForm;
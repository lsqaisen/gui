import * as React from 'react';
import {Form, Input} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {ColProps} from 'antd/lib/grid/col';
import {ConfigMapRequest} from 'api/type/app';
import {FormInput} from 'library';
import ContentInput from './content-input';

const FormItem = Form.Item;

export interface CreateFormProps extends FormComponentProps {
  value?: ConfigMapRequest;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
}

@(Form.create() as any)
class CreateForm extends React.PureComponent<CreateFormProps, any> {
  static readonly defaultProps = {
    form: {},
    labelCol: {xs: 24, md: 4},
    wrapperCol: {xs: 24, md: 20}
  };

  render() {
    const {value, labelCol, wrapperCol, form} = this.props;
    const {getFieldDecorator} = form;
    const {name, namespace, data} = value || ({} as ConfigMapRequest);
    return (
      <Form>
        <FormItem labelCol={labelCol} wrapperCol={wrapperCol} label="名称">
          {getFieldDecorator(`name`, {
            initialValue: name ? `${name}-clone` : undefined,
            validateFirst: true,
            rules: [
              {required: true, message: '名称必须填写！'},
              {max: 64, message: '名称字符长度不能超过64'},
              {
                pattern: /^[a-z0-9-]+$/,
                message: '名称由小写字母、数字和字符‘-’组成！'
              },
              {pattern: /^[a-z]/, message: '开始字符不能是数字或‘-’！'},
              {pattern: /[a-z0-9]$/, message: '结束字符不能是‘-’！'}
            ]
          })(<Input type="text" placeholder="配置名称" />)}
        </FormItem>
        <FormItem labelCol={labelCol} wrapperCol={wrapperCol} label="工作空间">
          {getFieldDecorator(`namespace`, {
            initialValue: namespace,
            validateFirst: true
          })(<Input disabled />)}
        </FormItem>
        <FormInput labelCol={labelCol} wrapperCol={wrapperCol} label="内容">
          {getFieldDecorator('data', {
            initialValue: data || {
              KEY: 'VALUE',
              FILE: `{PORT: "8080", ADDRESS: "0.0.0.0" }`
            },
            validateFirst: true,
            rules: []
          })(<ContentInput />)}
        </FormInput>
      </Form>
    );
  }
}

export default CreateForm;

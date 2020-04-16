import * as React from 'react';
import {Form, Input, Select} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {ColProps} from 'antd/lib/grid/col';
import {SecretRequest} from 'api/type/app';
import {FormInput, Inputs} from 'library';
import LabelsInput from './labels';
import TLSInput from './tls';

const FormItem = Form.Item;

const Labels = Inputs.Wapper({
  load: value =>
    Object.entries(value || {}).map(([key, value]: any) => ({key, value})),
  dump: value => {
    let data: {[key: string]: string} = {};
    value.forEach(({key, value}: any) => {
      data[key] = value;
    });
    return data;
  }
})(LabelsInput);

const TLS = Inputs.Wapper({
  load: (value = {}) => ({key: value[`tls.key`], crt: value[`tls.crt`]}),
  dump: ({key, crt}) => ({'tls.key': key, 'tls.crt': crt})
})(TLSInput);

export interface CreateFormProps extends FormComponentProps {
  value?: SecretRequest;
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
    const {getFieldDecorator, getFieldValue} = form;
    const {name, namespace, type = 'Opaque', stringData} =
      value || ({} as SecretRequest);
    return (
      <Form>
        <FormItem labelCol={labelCol} wrapperCol={wrapperCol} label="工作空间">
          {getFieldDecorator(`namespace`, {
            initialValue: namespace,
            validateFirst: true
          })(<Input disabled />)}
        </FormItem>
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
        <FormItem labelCol={labelCol} wrapperCol={wrapperCol} label="类型">
          {getFieldDecorator(`type`, {
            initialValue: type,
            validateFirst: true
          })(
            <Select>
              <Select.Option value="Opaque">Opaque</Select.Option>
              <Select.Option value="kubernetes.io/tls">
                kubernetes.io/tls
              </Select.Option>
            </Select>
          )}
        </FormItem>
        <FormInput labelCol={labelCol} wrapperCol={wrapperCol} label="内容">
          {getFieldValue('type') === 'Opaque'
            ? getFieldDecorator('stringData', {
                initialValue: stringData,
                validateFirst: true,
                rules: []
              })(<Labels />)
            : getFieldDecorator('stringData', {
                initialValue: stringData,
                validateFirst: true,
                rules: []
              })(<TLS />)}
        </FormInput>
      </Form>
    );
  }
}

export default CreateForm;

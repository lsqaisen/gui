import {PureComponent} from 'react';
import {Form, Input} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {ModifyIngressRulesType} from 'api/type/app';
import {FormInput} from 'library';
import RulesInput from './input/rules';

const FormItem = Form.Item;

export interface IngressFromProps {
  value?: ModifyIngressRulesType;
  formItemLayout?: any;
}

@(Form.create() as any)
class EditRulesForm extends PureComponent<
  FormComponentProps & IngressFromProps,
  any
> {
  static readonly defaultProps = {
    form: {},
    formItemLayout: {
      labelCol: {xs: 24, md: 5},
      wrapperCol: {xs: 24, md: 19}
    }
  };

  render() {
    const {value, formItemLayout, form} = this.props;
    const {getFieldDecorator, getFieldValue, setFieldsValue} = form;
    const {name, namespace, rules} = value || ({} as ModifyIngressRulesType);
    if (getFieldValue('namespace') !== namespace && !!namespace) {
      setFieldsValue({namespace});
    }
    if (getFieldValue('name') !== name && !!name) {
      setFieldsValue({name});
    }
    return (
      <Form>
        <FormItem {...formItemLayout} label="工作空间">
          {getFieldDecorator(`namespace`, {
            initialValue: namespace,
            validateFirst: true
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...formItemLayout} label="名称">
          {getFieldDecorator('name', {
            initialValue: name
          })(<Input disabled />)}
        </FormItem>
        <FormInput {...formItemLayout} label="转发配置">
          {getFieldDecorator('rules', {
            initialValue: rules,
            rules: []
          })(<RulesInput />)}
        </FormInput>
      </Form>
    );
  }
}

export default EditRulesForm;

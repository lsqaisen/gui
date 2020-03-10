import { PureComponent } from 'react';
import { Form, Input, Checkbox, Radio } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { ModifyIngressRulesType } from 'api/type/app';
import { FormInput, SearchSelect } from 'library';
import RulesInput from './input/rules';
import Context from '../context';
import { ISecret } from '@/models/apps/secret';

const FormItem = Form.Item;

export interface IngressFromProps {
  value?: ModifyIngressRulesType;
  formItemLayout?: any;
}

@(Form.create() as any)
class EditRulesForm extends PureComponent<FormComponentProps & IngressFromProps, any> {
  static readonly defaultProps = {
    form: {},
    formItemLayout: {
      labelCol: { xs: 24, md: 5 },
      wrapperCol: { xs: 24, md: 19 },
    },
  };

  render() {
    const { value, formItemLayout, form } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    const { name, namespace, rules, listen_http, listen_https, network_type, secret } = (value || {} as ModifyIngressRulesType)
    if (getFieldValue('namespace') !== namespace && !!namespace) {
      setFieldsValue({ namespace })
    }
    if (getFieldValue('name') !== name && !!name) {
      setFieldsValue({ name })
    }
    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label="工作空间"
        >
          {getFieldDecorator(`namespace`, {
            initialValue: namespace,
            validateFirst: true,
          })(<Input disabled />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="名称">
          {getFieldDecorator('name', {
            initialValue: name,
          })(<Input disabled />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="网络类型">
          {getFieldDecorator('network_type', {
            initialValue: network_type,
            rules: [
              { required: true, message: '必须选择网络类型!' },
            ],
          })(
            <Radio.Group disabled>
              <Radio.Button value="public">公网</Radio.Button>
              <Radio.Button value="internal">内网</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="监听端口">
          {getFieldDecorator('listen_http', {
            initialValue: listen_http,
            valuePropName: 'checked',

          })(
            <Checkbox disabled>Http:80</Checkbox>
          )}
          {getFieldDecorator('listen_https', {
            initialValue: listen_https,
            valuePropName: 'checked',
          })(
            <Checkbox disabled>Https:443</Checkbox>
          )}
        </FormItem>
        <Context.Consumer>
          {({ getSecrets }) => <FormItem
            {...formItemLayout}
            label="证书">
            {getFieldDecorator('secret', {
              initialValue: secret,
              rules: !!getFieldValue("listen_https") ? [
                { required: true, message: '必须选择证书!' },
              ] : [],
            })(
              <SearchSelect
                allowClear={!getFieldValue("listen_https")}
                style={{ width: '100%' }}
                initialLoad
                placeholder="选择后端证书"
                asyncSearch={async (page, callback) => {
                  let secrets: ISecret[] = await getSecrets!();
                  secrets = secrets.filter(v => v.type === 'kubernetes.io/tls');
                  callback({
                    total: secrets.length,
                    results: secrets.map((v) => ({
                      key: v.metadata.name,
                      label: v.metadata.name,
                      ...v,
                    })) as any,
                  })
                }}
              />
            )}
          </FormItem>}
        </Context.Consumer>
        <FormInput
          {...formItemLayout}
          label="转发配置">
          {getFieldDecorator('rules', {
            initialValue: rules,
            rules: [],
          })(
            <RulesInput />
          )}
        </FormInput>
      </Form>
    )
  }
}

export default EditRulesForm;
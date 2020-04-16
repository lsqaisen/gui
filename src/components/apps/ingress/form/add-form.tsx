import {PureComponent, forwardRef} from 'react';
import {Form, Input, Radio, Checkbox} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {IngressRequest} from 'api/type/app';
import {SearchSelect, FormInput} from 'library';
import Context from '../context';
import {ISecret} from '@/models/apps/secret';
import RulesInput from './input/rules';
import {InputProps} from 'antd/lib/input';

const FormItem = Form.Item;

export interface IngressFromProps {
  value?: IngressRequest;
  formItemLayout?: any;
}

const NameInput = forwardRef(
  ({value, onChange, ...props}: InputProps, ref: any) => {
    const [_, ..._value] = ((value || '') as any).split('-');
    return (
      <>
        <Input
          ref={ref}
          className="nameinput"
          value={_value.join('-')}
          {...props}
          onChange={e => onChange!(`lb-${e.target.value}` as any)}
          prefix={<span>lb-</span>}
        />
        <style>{`
        .nameinput.ant-input-affix-wrapper .ant-input:not(:first-child) {
          padding-left: 30px
        }
      `}</style>
      </>
    );
  }
);

@(Form.create() as any)
class AddIngressForm extends PureComponent<
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
    const {getFieldDecorator, getFieldValue, setFields, getFieldError} = form;
    const {
      name,
      namespace,
      network_type = 'public',
      listen_http = true,
      listen_https = false,
      secret,
      rules
    } = value || ({} as IngressRequest);
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
            initialValue: name,
            rules: [
              {required: true, message: '名称必须填写！'},
              {
                validator: (rule, value, callback) => {
                  if (value === 'lb-') callback('名称必须填写！');
                  callback();
                }
              },
              {max: 64, message: '最长63个字符'},
              {
                pattern: /^[a-z0-9-]+$/,
                message: '只能包含小写字母、数字和字符‘-’'
              },
              {pattern: /[a-z0-9]$/, message: '小写字母或数字结尾'}
            ]
          })(<NameInput placeholder="请输入负载均衡名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="网络类型">
          {getFieldDecorator('network_type', {
            initialValue: network_type,
            rules: [{required: true, message: '必须选择网络类型!'}]
          })(
            <Radio.Group>
              <Radio.Button value="public">公网</Radio.Button>
              <Radio.Button value="internal">内网</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="监听端口">
          {getFieldDecorator('listen_http', {
            initialValue: listen_http,
            valuePropName: 'checked'
          })(<Checkbox disabled>Http:80</Checkbox>)}
          {getFieldDecorator('listen_https', {
            initialValue: listen_https,
            valuePropName: 'checked'
          })(
            <Checkbox
              onChange={e => {
                if (e.target.checked) {
                  setFields({
                    secret: {
                      value: undefined,
                      errors: [Error('HTTPS启用时必须选择证书')]
                    }
                  });
                } else if (!e.target.checked && getFieldError('secret')) {
                  setFields({secret: {value: undefined, errors: undefined}});
                }
              }}
            >
              Https:443
            </Checkbox>
          )}
        </FormItem>
        <Context.Consumer>
          {({getSecrets}) => (
            <FormItem {...formItemLayout} label="证书">
              {getFieldDecorator('secret', {
                initialValue: secret,
                rules: !!getFieldValue('listen_https')
                  ? [{required: true, message: '必须选择证书!'}]
                  : []
              })(
                <SearchSelect
                  style={{width: '100%'}}
                  initialLoad
                  placeholder="选择后端证书"
                  asyncSearch={async (page, callback) => {
                    let secrets: ISecret[] = await getSecrets!();
                    secrets = secrets.filter(
                      v => v.type === 'kubernetes.io/tls'
                    );
                    callback({
                      total: secrets.length,
                      results: secrets.map(v => ({
                        key: v.metadata.name,
                        label: v.metadata.name,
                        ...v
                      })) as any
                    });
                  }}
                />
              )}
            </FormItem>
          )}
        </Context.Consumer>
        <FormInput {...formItemLayout} label="转发配置">
          {getFieldDecorator('rules', {
            initialValue: rules,
            rules: []
          })(<RulesInput https={!!getFieldValue('listen_https')} />)}
        </FormInput>
      </Form>
    );
  }
}

export default AddIngressForm;

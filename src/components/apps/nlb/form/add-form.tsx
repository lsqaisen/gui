import { PureComponent, forwardRef } from 'react';
import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { NlbRequest } from 'api/type/app';
import { SearchSelect, FormInput } from 'library';
import PortsInput from './input/rules';
import Context from '../context';
import { IApp } from '@/models/apps/apps';
import { InputProps } from 'antd/lib/input';

const FormItem = Form.Item;

export interface NlbFromProps {
  value?: NlbRequest;
  formItemLayout?: any;
}

const NameInput = forwardRef(({ value, onChange, ...props }: InputProps, ref: any) => {
  const [_, ..._value] = ((value || "") as any).split('-');
  return (
    <>
      <Input ref={ref} className="nameinput" value={_value.join('-')} {...props} onChange={(e) => onChange!(`nlb-${e.target.value}` as any)} prefix={<span>nlb-</span>} />
      <style>{`
        .nameinput.ant-input-affix-wrapper .ant-input:not(:first-child) {
          padding-left: 38px
        }
      `}</style>
    </>
  )
})

@(Form.create() as any)
class AddNlbForm extends PureComponent<FormComponentProps & NlbFromProps, any> {
  static readonly defaultProps = {
    form: {},
    formItemLayout: {
      labelCol: { xs: 24, md: 5 },
      wrapperCol: { xs: 24, md: 19 },
    },
  };

  render() {
    const { value, formItemLayout, form } = this.props;
    const { getFieldDecorator, setFieldsValue } = form;
    const { name, namespace, app_name, app_type, ports = [{}] } = (value || {} as NlbRequest)
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
            rules: [
              { required: true, message: '名称必须填写！' },
              {
                validator: (rule, value, callback) => {
                  if (value === 'nlb-') callback('名称必须填写！');
                  callback();
                }
              },
              { max: 64, message: '最长63个字符' },
              { pattern: /^[a-z0-9-]+$/, message: '只能包含小写字母、数字和字符‘-’' },
              { pattern: /[a-z0-9]$/, message: '小写字母或数字结尾' },
            ],
          })(
            <NameInput placeholder='请输入子网名称' />
          )}
        </FormItem>
        <Context.Consumer>
          {({ getApps }) => (
            <FormItem
              {...formItemLayout}
              label="应用服务">
              {getFieldDecorator('app_name', {
                initialValue: app_name,
                rules: [
                  { required: true, message: '必须选择服务!' },
                ],
              })(
                <SearchSelect
                  style={{ width: '100%' }}
                  initialLoad
                  placeholder="选择服务"
                  asyncSearch={async (page, callback) => {
                    let apps: IApp[] = await getApps!();
                    callback({
                      total: apps.length,
                      results: apps.map((v) => ({
                        key: v.name,
                        label: v.name,
                        ...v,
                      })) as any,
                    })
                  }}
                  onChangeOptions={(name, _, data) => {
                    const app_type = (data.find((v: IApp) => v.name === name) as IApp).type;
                    setFieldsValue({ app_type })
                  }}
                />
              )}
            </FormItem>
          )}
        </Context.Consumer>
        <FormItem
          {...formItemLayout}
          label="服务类型">
          {getFieldDecorator('app_type', {
            initialValue: app_type,
          })(
            <Input disabled />
          )}
        </FormItem>
        <FormInput
          {...formItemLayout}
          label="转发配置">
          {getFieldDecorator('ports', {
            initialValue: ports,
            rules: [],
          })(
            <PortsInput />
          )}
        </FormInput>
      </Form>
    )
  }
}

export default AddNlbForm;
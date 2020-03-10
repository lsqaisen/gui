import * as React from 'react';
import { Form, Select, Input } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { IngressRuleType, Port } from 'api/type/app';
import Context from '../../context';
import { SearchSelect } from 'library';
import { IService } from '@/models/apps/apps';

const FormItem = Form.Item;

export interface RuleInputProps {
  https: boolean;
  value: IngressRuleType;
  onChange: (value: IngressRuleType) => void;
  form: WrappedFormUtils;
}

@(Form.create({ name: 'rule' }) as any)
class RuleInput extends React.PureComponent<RuleInputProps, any> {
  static readonly defaultProps = {
    form: {} as WrappedFormUtils,
  }

  state = {
    servicePorts: []
  }

  UNSAFE_componentWillReceiveProps({ https }: RuleInputProps) {
    if (this.props.https !== https && !https && this.props.form.getFieldValue('protocol') === "HTTPS") {
      this.props.form.setFieldsValue({ protocol: 'HTTP' })
    }
  }

  render() {
    const { value, https, form } = this.props;
    const { protocol = "HTTP", port, host, path, service } = value!;
    const { getFieldDecorator, getFieldValue, getFieldError, setFields } = form;
    const { servicePorts } = this.state;
    const labelCol = { xs: 24, md: 5 },
      wrapperCol = { xs: 24, md: 19 };
    return (
      <>
        <FormItem
          {...{ labelCol, wrapperCol }}
          label="协议"
        >
          {getFieldDecorator('protocol', {
            initialValue: protocol.toLocaleUpperCase(),
          })(
            <Select style={{ width: 'calc(100% - 88px)', marginRight: 8 }} onChange={(value) => {
              if (value === "HTTP" && getFieldError("host")) { setFields({ host: { value: undefined, errors: undefined } }) }
              else if (value === "HTTP" && !getFieldError("host")) { setFields({ host: { value: undefined, errors: [Error("协议为HTTPS时域名必须填写")] } }) }
            }}>
              <Select.Option value="HTTP">HTTP</Select.Option>
              {https ? <Select.Option value="HTTPS">HTTPS</Select.Option> : []}
            </Select>
          )}
          <Input disabled style={{ width: 80 }} value={(getFieldValue("protocol") || "").toLocaleUpperCase() === "HTTP" ? 80 : 443} />
        </FormItem>
        <FormItem
          {...{ labelCol, wrapperCol }}
          label="域名"
        >
          {getFieldDecorator('host', {
            initialValue: host,
            rules: getFieldValue('protocol') === 'HTTPS' ? [
              { required: true, message: '协议为HTTPS时域名必须填写' },
            ] : [],
          })(
            <Input placeholder='不填默认VIP' />
          )}
        </FormItem>
        <FormItem
          {...{ labelCol, wrapperCol }}
          label="路径"
        >
          {getFieldDecorator('path', {
            initialValue: path,
            rules: [
              { pattern: /^(\/[^\/]+[\/]{0,1})*$/, message: '路径格式错误' }
            ]
          })(
            <Input placeholder="请输入路径" />
          )}
        </FormItem>
        <Context.Consumer>
          {({ getServices }) => (
            <FormItem
              {...{ labelCol, wrapperCol }}
              label="服务"
            >
              {getFieldDecorator('service', {
                initialValue: service,
                rules: [
                  { required: true, message: '服务必须选择' },
                ]
              })(
                <SearchSelect
                  style={{ width: '100%' }}
                  initialLoad
                  placeholder="选择服务"
                  asyncSearch={async (page, callback) => {
                    let services: IService[] = await getServices!();
                    callback({
                      total: services.length,
                      results: services.map((v) => ({
                        key: v.name,
                        label: v.name,
                        ...v,
                      })) as any,
                    })
                  }}
                  onChangeOptions={(name, _, apps: IService[]) => {
                    this.setState({
                      servicePorts: apps.find(v => v.name === name)!.ports || []
                    })
                  }}
                />
              )}
            </FormItem>
          )}
        </Context.Consumer>
        <FormItem
          {...{ labelCol, wrapperCol }}
          label="服务端口"
        >
          {getFieldDecorator('port', {
            initialValue: port,
            rules: [
              { required: true, message: '必须指定服务端口' },
            ]
          })(
            <Select style={{ width: '100%' }}>
              {servicePorts.map((v: Port) => <Select.Option key={v.port}>{v.port}</Select.Option>)}
            </Select>
          )}
        </FormItem>
      </>
    )
  }
}

export default RuleInput;
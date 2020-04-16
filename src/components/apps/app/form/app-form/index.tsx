import * as React from 'react';
import {Form, Input, Radio, InputNumber, Typography, Checkbox} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {ColProps} from 'antd/lib/grid/col';
import {App} from 'api/type/app';
import Labels from './labels';
import Volumes from './volumes';
import Containers from './containers';
import Service from './service';
import Context from '../../context';
import {SearchSelect} from 'library';
import {INetworkPool} from '@/models/network/pool';
import {InputProps} from 'antd/lib/input';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

export interface AppFormProps extends FormComponentProps {
  data?: App;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
}

const NameInput = React.forwardRef(
  ({value, onChange, ...props}: InputProps, ref: any) => {
    const [_, ..._value] = ((value || '') as any).split('-');
    return (
      <>
        <Input
          ref={ref}
          className="nameinput"
          value={_value.join('-')}
          {...props}
          onChange={e => onChange!(`app-${e.target.value}` as any)}
          prefix={<span>app-</span>}
        />
        <style>{`
        .nameinput.ant-input-affix-wrapper .ant-input:not(:first-child) {
          padding-left: 44px
        }
      `}</style>
      </>
    );
  }
);

@(Form.create() as any)
class AppForm extends React.PureComponent<AppFormProps, any> {
  static readonly defaultProps = {
    form: {},
    labelCol: {xs: 24, md: 4},
    wrapperCol: {xs: 24, md: 20}
  };

  constructor(props: AppFormProps) {
    super(props);
    this.state = {
      open: props.data && !!props.data.service ? true : false
    };
  }

  render() {
    const {data, labelCol, wrapperCol, form} = this.props;
    const {getFieldDecorator, getFieldValue, setFieldsValue} = form;
    const {
      name,
      namespace,
      type = 'Deployment',
      replicas,
      labels,
      volumes,
      containers = [{}],
      service,
      ip_pool
    } = data || ({} as App);
    const {open} = this.state;
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
            validateFirst: true,
            rules: [
              {required: true, message: '服务名称必须填写！'},
              {
                validator: (rule, value, callback) => {
                  if (value === 'app-') callback('服务名称必须填写！');
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
          })(<NameInput placeholder="服务名称" />)}
        </FormItem>
        <Context.Consumer>
          {({getIPPools}) => (
            <FormItem
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              label="虚拟子网"
            >
              {getFieldDecorator('ip_pool', {
                initialValue: ip_pool
              })(
                <SearchSelect
                  style={{width: '100%'}}
                  showSearch
                  allowClear
                  initialLoad={true}
                  placeholder="选择虚拟子网"
                  onChange={() => {
                    form.setFieldsValue({image_tag: undefined});
                  }}
                  asyncSearch={async (page, callback) => {
                    const pools: INetworkPool[] = await getIPPools!();
                    callback({
                      total: pools.length,
                      results: pools.map(pool => ({
                        key: pool.name,
                        label: pool.name
                      }))
                    });
                  }}
                />
              )}
            </FormItem>
          )}
        </Context.Consumer>
        <FormItem
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          label="类型"
          required
        >
          {getFieldDecorator('type', {
            initialValue: type
          })(
            <RadioGroup style={{maxWidth: 320}}>
              <Radio value="Deployment">Deployment（可扩展的部署Pod）</Radio>
              <Radio value="DaemonSet">DaemonSet（在每个主机上运行Pod）</Radio>
              <Radio value="StatefulSet">
                StatefulSet（有状态集的运行Pod）
              </Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          label="标签"
          extra={`只能包含字母、数字及分隔符("-"、"_"、"."、"/")， 且必须以字母、数字开头和结尾`}
          validateStatus=""
          help=""
        >
          {getFieldDecorator('labels', {
            initialValue: Object.entries(labels || {}).map(([name, value]) => ({
              name,
              value
            })),
            rules: []
          })(<Labels />)}
        </FormItem>
        <FormItem
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          label="数据卷"
          validateStatus=""
          help=""
        >
          {getFieldDecorator('volumes', {
            initialValue: volumes,
            rules: []
          })(<Volumes />)}
        </FormItem>
        <FormItem
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          label="实例数量"
          required
        >
          {getFieldDecorator('replicas', {
            initialValue: replicas || 1,
            rules: [{required: true, message: '必须指定实例数量！'}]
          })(
            <InputNumber
              style={{width: 180}}
              min={1}
              max={10000}
              placeholder="实例数量"
            />
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
              volumes={(getFieldValue('volumes') || []).filter(
                (v: any) => !v.host_path
              )}
            />
          )}
        </FormItem>
        <FormItem
          labelCol={{span: 24}}
          wrapperCol={{span: 24}}
          label={
            <Typography.Text strong style={{fontSize: '16px'}}>
              访问设置（Service）
            </Typography.Text>
          }
          validateStatus=""
          help=""
        >
          <FormItem labelCol={labelCol} wrapperCol={wrapperCol} label="Service">
            <label htmlFor="">
              <Checkbox
                checked={open}
                onChange={e => {
                  this.setState({open: e.target.checked});
                  if (e.target.checked) {
                    setFieldsValue({
                      service: {
                        type: 'LoadBalancer',
                        external_traffic_policy: 'Cluster',
                        session_affinity: 'None',
                        load_balance: {auto_create: true},
                        ports: []
                      }
                    });
                  } else {
                    setFieldsValue({service: undefined});
                  }
                }}
              >
                <a>启用</a>
              </Checkbox>
            </label>
          </FormItem>
          {getFieldDecorator('service', {
            initialValue: service,
            rules: []
          })(<Service portsRequired={getFieldValue('type') === 'DaemonSet'} />)}
        </FormItem>
      </Form>
    );
  }
}

export default AppForm;

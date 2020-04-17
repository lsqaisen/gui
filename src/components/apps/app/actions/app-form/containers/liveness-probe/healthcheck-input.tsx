import {PureComponent} from 'react';
import {Form, Radio, InputNumber, Card} from 'antd';
import {FormInput} from 'library';
import {FormInputProps} from 'library/type/forminput/';
import {LivenessProbe} from 'api/type/app/';
import TcpInput from './tcp-input';
import HttpInput from './http-input';
import ExecInput from './exec-input';

const FormItem = Form.Item;

export interface LivenessProbeInputProps extends FormInputProps<LivenessProbe> {
  formItemLayout?: any;
}

@(FormInput.create({name: 'healthCheck'}) as any)
class LivenessProbeInput extends PureComponent<LivenessProbeInputProps, any> {
  static readonly defaultProps = {
    form: {} as any,
    value: {},
    onChange: () => null,
    formItemLayout: {
      labelCol: {xs: 24, md: 5},
      wrapperCol: {xs: 24, md: 19},
    },
  };
  constructor(props: LivenessProbeInputProps) {
    super(props);
    this.state = {
      protocol: props.value!.exec
        ? 'CMD'
        : props.value!.tcpSocket
        ? 'TCP'
        : 'HTTP',
    };
  }
  componentDidMount() {}

  render() {
    const {formItemLayout, value, form} = this.props;
    const {
      tcpSocket,
      httpGet,
      exec,
      initialDelaySeconds,
      periodSeconds,
      timeoutSeconds,
      successThreshold,
      failureThreshold,
    } = value!;
    const {getFieldDecorator, setFieldsValue} = form;
    const {protocol} = this.state;
    return (
      <Card>
        <FormItem {...formItemLayout} label="检测协议">
          <Radio.Group
            value={protocol}
            onChange={(e) => {
              this.setState({protocol: e.target.value});
              let value = {};
              switch (e.target.value) {
                case 'TCP':
                  value = {
                    exec: undefined,
                    tcpSocket: {port: undefined},
                    httpGet: undefined,
                    initialDelaySeconds: 5,
                    timeoutSeconds: 6,
                    periodSeconds: 6,
                    successThreshold: 1,
                    failureThreshold: 3,
                  };
                  break;
                case 'HTTP':
                  value = {
                    exec: undefined,
                    tcpSocket: undefined,
                    httpGet: {
                      host: undefined,
                      path: undefined,
                      scheme: undefined,
                      port: undefined,
                    },
                    initialDelaySeconds: 5,
                    timeoutSeconds: 6,
                    periodSeconds: 6,
                    successThreshold: 1,
                    failureThreshold: 3,
                  };
                case 'CMD':
                  value = {
                    exec: {command: undefined},
                    tcpSocket: undefined,
                    httpGet: undefined,
                    initialDelaySeconds: 5,
                    timeoutSeconds: 6,
                    periodSeconds: 6,
                    successThreshold: 1,
                    failureThreshold: 3,
                  };
              }
              setFieldsValue(value);
            }}
          >
            <Radio value="CMD">Command</Radio>
            <Radio value="HTTP">HTTP(S)</Radio>
            <Radio value="TCP">TCP</Radio>
          </Radio.Group>
        </FormItem>
        {(() => {
          switch (protocol) {
            case 'TCP':
              return (
                <FormInput {...formItemLayout} label="监听端口">
                  {getFieldDecorator('tcpSocket', {
                    initialValue: tcpSocket,
                    rules: [],
                  })(<TcpInput />)}
                </FormInput>
              );
            case 'HTTP':
              return (
                <FormInput>
                  {getFieldDecorator('httpGet', {
                    initialValue: httpGet,
                    rules: [],
                  })(<HttpInput {...formItemLayout} />)}
                </FormInput>
              );
            case 'CMD':
              return (
                <FormInput {...formItemLayout} label="命令" required>
                  {getFieldDecorator('exec', {
                    initialValue: exec,
                    rules: [],
                  })(<ExecInput />)}
                </FormInput>
              );
            default:
              return null;
          }
        })()}
        <FormItem {...formItemLayout} label="初始化延时">
          {getFieldDecorator('initialDelaySeconds', {
            initialValue: initialDelaySeconds,
            validateFirst: true,
            rules: [{required: true, message: '初始化延时不能为空！'}],
          })(
            <InputNumber
              style={{width: 180}}
              placeholder="请输入初始化延时时间"
            />
          )}
          秒
        </FormItem>
        <FormItem {...formItemLayout} label="检测间隔">
          {getFieldDecorator('periodSeconds', {
            initialValue: periodSeconds,
            rules: [{required: true, message: '检测间隔不能为空！'}],
          })(<InputNumber style={{width: 180}} placeholder="请输入检测间隔" />)}
          秒
        </FormItem>
        <FormItem {...formItemLayout} label="响应时限">
          {getFieldDecorator('timeoutSeconds', {
            initialValue: timeoutSeconds,
            rules: [{required: true, message: '响应时限不能为空！'}],
          })(<InputNumber style={{width: 180}} placeholder="请输入响应时限" />)}
          秒
        </FormItem>
        <FormItem {...formItemLayout} label="健康阈值">
          {getFieldDecorator('successThreshold', {
            initialValue: successThreshold,
            rules: [{required: true, message: '健康阈值不能为空！'}],
          })(<InputNumber style={{width: 180}} placeholder="请输入健康阈值" />)}
          次
        </FormItem>
        <FormItem {...formItemLayout} label="故障阈值">
          {getFieldDecorator('failureThreshold', {
            initialValue: failureThreshold,
            rules: [{required: true, message: '故障阈值不能为空！'}],
          })(<InputNumber style={{width: 180}} placeholder="请输入故障阈值" />)}
          次
        </FormItem>
      </Card>
    );
  }
}

export default LivenessProbeInput;

import * as React from 'react';
import {Form, Checkbox, Switch} from 'antd';
import {FormInput} from 'library';
import {FormInputProps} from 'library/type/forminput/';
import {LivenessProbe} from 'api/type/app/';
import HealthcheckInput from './healthcheck-input';
import Description from '../description';

export interface LivenessProbeInputProps
  extends FormInputProps<LivenessProbe> {}

@(FormInput.create({
  name: 'livenessProbe',
  onValuesChange: ({onChange}, _, allValues) => {
    onChange(allValues.livenessProbe);
  }
}) as any)
class LivenessProbeInput extends React.PureComponent<
  LivenessProbeInputProps,
  any
> {
  static readonly defaultProps = {
    form: {},
    value: {},
    onChange: () => null
  };

  changeHealthCheckStatus = (e: any) => {
    if (e.target.checked) {
      this.props.onChange!({
        exec: {command: []},
        initialDelaySeconds: 5,
        timeoutSeconds: 6,
        periodSeconds: 6,
        successThreshold: 1,
        failureThreshold: 3
      });
    } else {
      this.props.onChange!(undefined as any);
    }
  };

  render() {
    const {value, form} = this.props;
    const {getFieldDecorator} = form;
    const status = !value!.exec && !value!.httpGet && !value!.tcpSocket;
    return (
      <React.Fragment>
        <FormInput>
          <label htmlFor="">
            <Checkbox checked={!status} onChange={this.changeHealthCheckStatus}>
              <a>存活检查</a>
            </Checkbox>
          </label>
          <span>检查容器是否运行正常，不正常则重启容器</span>
        </FormInput>
        {!status && (
          <FormInput>
            {getFieldDecorator('livenessProbe', {
              initialValue: value! || {},
              rules: []
            })(<HealthcheckInput />)}
          </FormInput>
        )}
      </React.Fragment>
    );
  }
}

export default LivenessProbeInput;

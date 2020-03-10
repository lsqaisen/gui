import * as React from 'react';
import { Form, Radio, Checkbox } from 'antd';
import { FormInput } from 'library';
import { FormInputProps } from 'library/type/forminput/';
import { Service } from 'api/type/app/';
import LoadBalance from './load-balance';
import Ports from './ports';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

export interface ServiceInputProps extends FormInputProps<Service> {
  portsRequired?: boolean;
}

@(FormInput.create({ name: 'service-input' }) as any)
class ServiceInput extends React.PureComponent<ServiceInputProps, any> {
  static readonly defaultProps = {
    value: undefined,
    form: {} as any,
  }

  render() {
    const { value, portsRequired, form } = this.props;
    const { type = "LoadBalancer", external_traffic_policy = "Cluster", session_affinity = "None", load_balance = { auto_create: true }, ports } = value || {};
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    const labelCol = { xs: 24, md: 5 };
    const wrapperCol = { xs: 24, md: 19 };
    const typeFieldValue = getFieldValue('type');
    return (value ? <>
      <FormItem
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        label="服务访问方式"
        required>
        {getFieldDecorator('type', {
          initialValue: type,
          rules: [],
        })(
          <RadioGroup onChange={(e) => {
            switch (e.target.value) {
              case "LoadBalancer":
                setFieldsValue({
                  external_traffic_policy: "Cluster",
                  session_affinity: "None",
                  load_balance: { auto_create: true },
                  ports: [{}]
                });
                break;
              case "ClusterIP":
                setFieldsValue({
                  external_traffic_policy: "Cluster",
                  session_affinity: "None",
                  load_balance: undefined,
                  ports: [{}]
                });
                break;
              case "NodePort":
                setFieldsValue({
                  external_traffic_policy: "Cluster",
                  session_affinity: "None",
                  load_balance: undefined,
                  ports: [{}]
                });
                break;
              case "ExternalName": break;
            }
          }}>
            <Radio value="LoadBalancer">提供公网访问</Radio>
            <Radio value="ClusterIP">仅在集群内访问</Radio>
            <Radio value="NodePort">主机端口访问</Radio>
            {/* <Radio value="ExternalName">提供外网访问</Radio> */}
          </RadioGroup>
        )}
      </FormItem>
      {typeFieldValue === 'LoadBalancer' && <FormItem
        style={{ display: "none" }}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        label="负载均衡器"
      >
        {getFieldDecorator('load_balance', {
          initialValue: load_balance,
          rules: [],
        })(
          <LoadBalance />
        )}
      </FormItem>}
      <FormInput
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        label="端口映射"
        key={getFieldValue('type')}
        required
      >
        {getFieldDecorator('ports', {
          initialValue: ports && ports.length <= 0 ? [{}] : ports,
          rules: [],
        })(
          <Ports required={true} />
        )}
      </FormInput>
      <FormItem
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        label="externalTrafficPolicy"
      >
        {getFieldDecorator('external_traffic_policy', {
          initialValue: external_traffic_policy,
          rules: [],
        })(
          <RadioGroup>
            <Radio disabled={!(getFieldValue("type") === "LoadBalancer")} value="Local">Local</Radio>
            <Radio value="Cluster">Cluster</Radio>
          </RadioGroup>
        )}
      </FormItem>
      <FormItem
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        label="Session Affinity"
      >
        {getFieldDecorator('session_affinity', {
          initialValue: session_affinity,
          rules: [],
        })(
          <RadioGroup>
            <Radio value="ClientIP">ClientIP</Radio>
            <Radio value="None">None</Radio>
          </RadioGroup>
        )}
      </FormItem>
    </> : null)
  }
}

export default ServiceInput;
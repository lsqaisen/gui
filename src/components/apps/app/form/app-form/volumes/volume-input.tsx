import * as React from 'react';
import {Form, Row, Col, Select, Input} from 'antd';
import {FormInput} from 'library';
import {FormInputProps} from 'library/type/forminput/';
import {Volume} from 'api/type/app/';
import HostPath from './host-path';
import ConfigMap from './option/config-map';
import Secret from './option/secret';

const Option = Select.Option;
const FormItem = Form.Item;

export interface VolumeInputProps extends FormInputProps<Volume> {
  others: Volume[];
}

type StateProps = {
  type: 'conf' | 'host' | 'secret';
};

@(FormInput.create({name: 'volume'}) as any)
class VolumeInput extends React.PureComponent<VolumeInputProps, StateProps> {
  static readonly defaultProps = {
    form: {} as any
  };

  state: StateProps = {
    type: 'host'
  };

  render() {
    const {value, form} = this.props;
    const {name, host_path, config_map, secret} = value!;
    const {getFieldDecorator, getFieldValue, setFieldsValue} = form;
    const {type} = this.state;
    switch (type) {
      case 'host':
        if (
          JSON.stringify(getFieldValue('host_path') || {}) !==
          JSON.stringify(host_path || {})
        ) {
          setFieldsValue({host_path});
        }
        break;
      case 'conf':
        if (
          JSON.stringify(getFieldValue('config_map') || {}) !==
          JSON.stringify(config_map || {})
        ) {
          setFieldsValue({config_map});
        }
        break;
      case 'secret':
        if (
          JSON.stringify(getFieldValue('secret') || {}) !==
          JSON.stringify(secret || {})
        ) {
          setFieldsValue({secret});
        }
        break;
      default:
        break;
    }
    return (
      <Row gutter={8}>
        <Col span={6}>
          <FormItem>
            <Select
              value={type}
              onChange={(type: any) => this.setState({type})}
            >
              <Option key="host">主机路径</Option>
              <Option key="conf">ConfigMap</Option>
              <Option key="secret">Secret</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem>
            {getFieldDecorator('name', {
              initialValue: name,
              rules: [{required: true, message: '卷名称必须填写'}]
            })(<Input placeholder="数据卷名称" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          {type === 'host' ? (
            <FormItem>
              {getFieldDecorator('host_path', {
                initialValue: host_path,
                rules: [
                  {
                    validator: (rule, value: Volume['host_path'], callback) => {
                      if (!value || !value.path) {
                        callback('未设置主机路径');
                      }
                      callback();
                    }
                  }
                ]
              })(<HostPath />)}
            </FormItem>
          ) : type === 'conf' ? (
            <FormItem>
              {getFieldDecorator('config_map', {
                initialValue: config_map,
                rules: [
                  {
                    validator: (
                      rule,
                      value: Volume['config_map'],
                      callback
                    ) => {
                      if (!value || !value.name) {
                        callback('未设置ConfigMap');
                      }
                      callback();
                    }
                  }
                ]
              })(<ConfigMap />)}
            </FormItem>
          ) : (
            <FormItem>
              {getFieldDecorator('secret', {
                initialValue: secret,
                rules: [
                  {
                    validator: (rule, value: Volume['secret'], callback) => {
                      if (!value || !value.secretName) {
                        callback('未设置证书');
                      }
                      callback();
                    }
                  }
                ]
              })(<Secret />)}
            </FormItem>
          )}
        </Col>
      </Row>
    );
  }
}

export default VolumeInput;

import * as React from 'react';
import { Form, Row, Col, Select, Input, Button, Tooltip } from 'antd';
import { FormInput } from 'library';
import { FormInputProps } from 'library/type/forminput/';
import { Env } from 'api/type/app';
import ValueFrom from './value-from';

const Option = Select.Option;
const FormItem = Form.Item;

type StateProps = {
  type: 'define' | 'link'
}

export interface EnvInputProps extends FormInputProps<Env> {
  others: Env[];
}

@(FormInput.create({ name: 'env' }) as any)
class EnvInput extends React.PureComponent<EnvInputProps, StateProps> {
  static readonly defaultProps = {
    form: {} as any,
  }

  constructor(props: EnvInputProps) {
    super(props);
    this.state = {
      type: props.value && props.value.valueFrom ? 'link' : 'define'
    }
  }

  render() {
    const { value, others, form } = this.props;
    const { name, value: _value, valueFrom } = value || {};
    const { getFieldDecorator, getFieldError, setFields } = form;
    const { type } = this.state;
    if (getFieldError('name') && !!name && others.every(v => v.name !== name)) {
      setFields({ name: { value: name, errors: undefined } })
    }
    return (
      <Row>
        <Col style={{ width: 'calc(100% - 42px)', float: "left" }}>
          <Row gutter={4}>
            <Col span={type === "define" ? 11 : 6}>
              <FormItem>
                {getFieldDecorator('name', {
                  initialValue: name,
                  rules: [
                    { required: true, message: '标签名必须填写' },
                    {
                      validator: (_, value, callback) => {
                        if (others.some((other) => !!value && (other || {}).name === value)) {
                          callback('存在相同的标签名')
                        }
                        callback()
                      }
                    }],
                })(
                  <Input placeholder='请输入标签名' />
                )}
              </FormItem>
            </Col>
            <Col span={1}><p className="ant-form-split">=</p></Col>
            {type === "define" ? <Col span={12}>
              <FormItem>
                {getFieldDecorator('value', {
                  initialValue: _value,
                  rules: [
                    { required: true, message: '标签值必须填写' },
                  ]
                })(
                  <Input />
                )}
              </FormItem>
            </Col> : <Col span={17}>
                <FormInput>
                  {getFieldDecorator('valueFrom', {
                    initialValue: valueFrom,
                    rules: []
                  })(
                    <ValueFrom />
                  )}
                </FormInput>
              </Col>}
          </Row>
        </Col>
        <Col style={{ width: 32, float: "right" }}>
          <Tooltip title={type === "define" ? "引用ConfigMap/Secret" : "自定义"}>
            <Button
              style={{ height: 30 }}
              icon={type === "define" ? "link" : "edit"}
              onClick={() => {
                form.setFieldsValue({ name: undefined, value: undefined, valueFrom: undefined })
                this.setState({ type: type === 'define' ? 'link' : 'define' })
              }}
            />
          </Tooltip>
        </Col>
      </Row>
    )
  }
}

export default EnvInput;
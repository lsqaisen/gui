import * as React from 'react';
import {Form, Row, Col, Select, Input} from 'antd';
import {FormInput} from 'library';
import {FormInputProps} from 'library/type/forminput/';

const Option = Select.Option;
const FormItem = Form.Item;

export type Label = {
  name?: string;
  value?: string;
};
export interface LabelInputProps extends FormInputProps<Label> {
  others: Label[];
}

@(FormInput.create({name: 'label'}) as any)
class LabelInput extends React.PureComponent<LabelInputProps, any> {
  static readonly defaultProps = {
    form: {} as any
  };

  render() {
    const {value, others, form} = this.props;
    const {name, value: _value} = value!;
    const {getFieldDecorator, getFieldError, setFields} = form;
    if (getFieldError('name') && !!name && others.every(v => v.name !== name)) {
      setFields({name: {value: name, errors: undefined}});
    }
    return (
      <Row gutter={8}>
        <Col span={10}>
          <FormItem>
            {getFieldDecorator('name', {
              initialValue: name,
              rules: [
                {required: true, message: '标签名必须填写'},
                {
                  validator: (_, value, callback) => {
                    if (others.some(({name}) => !!value && name === value)) {
                      callback('存在相同的标签名');
                    }
                    callback();
                  }
                }
              ]
            })(<Input placeholder="请输入标签名" />)}
          </FormItem>
        </Col>
        <Col span={1}>
          <p className="ant-form-split">=</p>
        </Col>
        <Col span={13}>
          <FormItem>
            {getFieldDecorator('value', {
              initialValue: _value,
              rules: [{required: true, message: '标签值必须填写'}]
            })(<Input placeholder="请输入标签值" />)}
          </FormItem>
        </Col>
      </Row>
    );
  }
}

export default LabelInput;

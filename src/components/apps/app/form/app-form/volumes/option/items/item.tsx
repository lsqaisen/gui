import * as React from 'react';
import { forwardRef } from 'react';
import { Form, Row, Col, Input, Select, InputNumber } from 'antd';
import { FormInput } from 'library';
import { FormInputProps } from 'library/type/forminput/';
import { VolumeItem } from 'api/type/app/';
import { InputNumberProps } from 'antd/lib/input-number';

const FormItem = Form.Item;

export interface ItemProps extends FormInputProps<VolumeItem> {
  others: VolumeItem[];
  itemsData: any[];
}

@(FormInput.create({ name: 'item' }) as any)
class Item extends React.PureComponent<ItemProps, any> {
  static readonly defaultProps = {
    form: {} as any,
  }

  render() {
    const { value, others, itemsData = [], form } = this.props;
    const { key, mode = 644, path } = value!;
    const { getFieldDecorator, getFieldError, setFields } = form;
    if (getFieldError('key') && !!key && others.every(v => v.key !== key)) {
      setFields({ key: { value: key, errors: undefined } })
    }
    return (
      <Row gutter={8}>
        <Col span={8}>
          <FormItem>
            {getFieldDecorator('key', {
              initialValue: key,
              rules: [
                { required: true, message: '必须选择选项称' },
                {
                  validator: (_, value, callback) => {
                    if (others.some(({ key }) => !!value && key === value)) {
                      callback('存在相同的选项名称')
                    }
                    callback()
                  }
                }],
            })(
              <Select style={{ width: '100%' }} placeholder="">
                {itemsData.map(v => (
                  <Select.Option key={v} value={v}>{v}</Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem>
            {getFieldDecorator('path', {
              initialValue: path,
              rules: [
                { required: true, message: '子路径必须填写' },
              ]
            })(
              <Input placeholder="子路径" />
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem>
            {getFieldDecorator('mode', {
              initialValue: mode,
              rules: [
                { required: true, message: '权限必须填写' },
                {
                  validator: (rule, value, callback) => {
                    const v = Number(`0o${value}`);
                    if (Number.isNaN(v)) {
                      callback(`应是8进制数`)
                    } else if (v < 0 || v > 0o777) {
                      callback(`范围为0～777`)
                    }
                    callback();
                  }
                }
              ]
            })(
              <InputNumber placeholder="请输入权限" min={0} max={777} />
            )}
          </FormItem>
        </Col>
      </Row>
    )
  }
}

export default Item;
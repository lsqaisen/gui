import * as React from 'react';
import {Form, Row, Col, Select, Input} from 'antd';
import {FormInput} from 'library';
import {FormInputProps} from 'library/type/forminput/';
import {VolumeMount, Volume} from 'api/type/app';
import {SelectProps} from 'antd/lib/select';

const Option = Select.Option;
const FormItem = Form.Item;

export interface VolumeMountInputProps extends FormInputProps<VolumeMount> {
  volumes: Volume[];
  others: VolumeMount[];
}

class ReadOnly extends React.PureComponent<SelectProps, any> {
  render() {
    const {value, onChange = () => null, ...props} = this.props;
    return (
      <Select
        {...props}
        defaultValue={value ? 1 : 0}
        onChange={(value: any, options: any) =>
          onChange(!!value as any, options)
        }
      >
        <Option value={0}>读写</Option>
        <Option value={1}>只读</Option>
      </Select>
    );
  }
}

@(FormInput.create({name: 'volumemount'}) as any)
class VolumeMountInput extends React.PureComponent<VolumeMountInputProps, any> {
  static readonly defaultProps = {
    form: {} as any
  };

  render() {
    const {value, others, volumes, form} = this.props;
    const {name, mount_path, sub_path, read_only} = value!;
    const {getFieldDecorator, getFieldError, setFields} = form;
    if (
      getFieldError('mount_path') &&
      !!mount_path &&
      others.every(v => v.mount_path !== mount_path)
    ) {
      setFields({mount_path: {value: mount_path, errors: undefined}});
    }
    return (
      <Row gutter={4}>
        <Col span={7}>
          <FormItem>
            {getFieldDecorator('name', {
              initialValue: name,
              rules: [{required: true, message: '必须选择数据卷'}]
            })(
              <Select placeholder="选择挂载卷">
                {volumes
                  .filter(v => v.name)
                  .map(v => (
                    <Select.Option key={v.name}>{v.name}</Select.Option>
                  ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem>
            {getFieldDecorator('mount_path', {
              initialValue: mount_path,
              rules: [
                {required: true, message: '必须填写'},
                {
                  validator: (_, value, callback) => {
                    if (
                      others.some(
                        ({mount_path}) => !!value && mount_path === value
                      )
                    ) {
                      callback('存在相同的挂载路径');
                    }
                    callback();
                  }
                }
              ]
            })(<Input placeholder="挂载路径" />)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem>
            {getFieldDecorator('sub_path', {
              initialValue: sub_path
            })(<Input placeholder="文件名或子路径" />)}
          </FormItem>
        </Col>
        <Col span={5}>
          <FormItem>
            {getFieldDecorator('read_only', {
              initialValue: read_only
            })(<ReadOnly />)}
          </FormItem>
        </Col>
      </Row>
    );
  }
}

export default VolumeMountInput;

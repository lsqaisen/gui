import { PureComponent } from 'react';
import { Form, Input, Radio } from 'antd';
import * as YAML from 'js-yaml';
import { Inputs } from 'library';
import { FormInputProps } from 'library/type/forminput/';
import { ImportAppType } from 'api/type/app';

const FormItem = Form.Item

export interface YamlFormProps extends FormInputProps<ImportAppType> { }

@(Form.create() as any)
class YamlForm extends PureComponent<YamlFormProps, any> {
  static readonly defaultProps = {
    form: {} as any,
    labelCol: { xs: 24, md: 4 },
    wrapperCol: { xs: 24, md: 20 },
  }

  render() {
    const { value, form } = this.props;
    const { getFieldDecorator } = form;
    const { type = "Deployment", namespace, yaml = "" } = value || {};
    const labelCol = { xs: 24, md: 4 },
      wrapperCol = { xs: 24, md: 20 };
    return (
      <>
        <FormItem
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          label="命名空间"
          required>
          {getFieldDecorator('namespace', {
            initialValue: namespace,
          })(
            <Input style={{ maxWidth: 320 }} disabled />
          )}
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
            rules: [
              { required: true, message: '服务名称必须填写！' },
              { max: 64, message: '最长63个字符' },
              { pattern: /^[a-z0-9-]+$/, message: '只能包含小写字母、数字和字符‘-’' },
              { pattern: /^[a-z]/, message: '小写字母开头' },
              { pattern: /[a-z0-9]$/, message: '小写字母或数字结尾' },
            ]
          })(
            <Input style={{ maxWidth: 320 }} placeholder="服务名称" />
          )}
        </FormItem>
        <FormItem
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          label="类型"
          required>
          {getFieldDecorator('type', {
            initialValue: type,
          })(
            <Radio.Group style={{ maxWidth: 320 }}>
              <Radio value="Deployment">Deployment（可扩展的部署Pod）</Radio>
              <Radio value="DaemonSet">DaemonSet（在每个主机上运行Pod）</Radio>
              <Radio value="StatefulSet">StatefulSet（有状态集的运行Pod）</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          label="内容"
          required>
          {getFieldDecorator('yaml', {
            initialValue: yaml,
            rules: [
              { required: true, message: '值必须填写' },
              {
                validator: (_, value, callback) => {
                  try {
                    YAML.load(value);
                    callback();
                  } catch (error) {
                    callback('YAML格式不正确！')
                  }
                  callback();
                }
              }
            ]
          })(
            <Inputs.Code style={{ height: 300 }} mode="yaml" />
          )}
        </FormItem>
      </>
    )
  }
}

export default YamlForm;
import { PureComponent } from 'react';
import { FormInput } from 'library';
import RuleInput from '../rule';
import options from '@/components/apps/app/form/app-form/volumes/options';
import { NlbPortType } from 'api/type/app';
import { Form } from 'antd';
import { FormInputProps } from 'library/type/forminput';

const Rule = options({
  title: "配置转发规则",
  dump: (value: NlbPortType) => value.port ? `${value.protocol}:${value.target_port}->${value.port}` : undefined
})(RuleInput);


@(FormInput.create({
  onValuesChange: ({ onChange }, _, allValues) => {
    onChange(allValues['rule'])
  }
}) as any)
export default class extends PureComponent<FormInputProps, any> {
  render() {
    const { value, form: { getFieldDecorator } } = this.props;
    return (
      <Form.Item>
        {getFieldDecorator('rule', {
          initialValue: value,
          rules: [
            {
              validator: (_, value, callback) => {
                if (!value && !value.port) {
                  callback('转发规则不能为空')
                }
                callback()
              }
            },
          ],
        })(
          <Rule />
        )}
      </Form.Item>
    )
  }
}


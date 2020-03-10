import { PureComponent } from 'react';
import { FormInput } from 'library';
import RuleInput from '../rule';
import options from '@/components/apps/app/form/app-form/volumes/options';
import { IngressRuleType } from 'api/type/app';
import { Form } from 'antd';
import { FormInputProps } from 'library/type/forminput';

const Rule = options({
  title: "配置转发规则",
  dump: (value: IngressRuleType) => value.service ? `${value.protocol.toLocaleLowerCase()}://${value.host || '#VIP'}:${value.protocol.toLocaleUpperCase() === 'HTTP' ? '80' : '443'}${value.path || ""}->${value.service}:${value.port}` : undefined,
})(RuleInput);


@(FormInput.create({
  onValuesChange: ({ onChange }, _, allValues) => {
    onChange(allValues['rule'])
  }
}) as any)
export default class extends PureComponent<FormInputProps & { https: boolean }, any> {
  render() {
    const { value, https, form: { getFieldDecorator } } = this.props;
    return (
      <Form.Item>
        {getFieldDecorator('rule', {
          initialValue: value,
          rules: [
            {
              validator: (_, value, callback) => {
                if (!value.service) {
                  callback('转发规则不能为空')
                }
                callback()
              }
            },
          ],
        })(
          <Rule https={https} />
        )}
      </Form.Item>
    )
  }
}


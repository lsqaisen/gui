import { PureComponent } from 'react';
import { FormInput } from 'library';
import { Form } from 'antd';
import Input from './input';
import { FormInputProps } from 'library/type/forminput';

@(FormInput.create({
  onValuesChange: ({ onChange }, _, allValues) => {
    onChange(allValues['addresse'])
  }
}) as any)
export default class extends PureComponent<FormInputProps, any> {
  render() {
    const { value, form: { getFieldDecorator } } = this.props;
    return (
      <Form.Item>
        {getFieldDecorator('addresse', {
          initialValue: value,
          rules: [
            {
              validator: (_, value, callback) => {
                if (!value) {
                  callback('必须填写IP地址范围或cidr')
                } else {
                  const data = value.split(/[\-\/]/);
                  if (!data[0] || !data[1]) {
                    callback('IP地址范围或cidr数据有误')
                  }
                }
                callback()
              }
            }
          ],
        })(
          <Input />
        )}
      </Form.Item>
    )
  }
}

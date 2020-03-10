import { PureComponent } from 'react';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { IPrivilege } from '@/models/uesr/privileges';
import { FormInput } from 'library';
import { modules } from '../index';
import Privileges from './input/privileges';

export interface PrivateFromProps {
  value: IPrivilege[];
  formItemLayout?: any;
  onChange?: (value: IPrivilege[]) => void;
}

@(Form.create({
  onValuesChange: ({ onChange }: any, _, allValues) => {
    onChange(allValues.privileges)
  }
}) as any)
class PrivilegesForm extends PureComponent<FormComponentProps & PrivateFromProps, any> {
  static readonly defaultProps = {
    value: Object.keys(modules).map(module => ({ module, modes: ['c', 'r', 'u', 'd'] } as IPrivilege)),
    form: {},
  };

  render() {
    const { value, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <FormInput>
          {getFieldDecorator('privileges', {
            initialValue: value,
            rules: [],
          })(
            <Privileges />
          )}
        </FormInput>
      </Form>
    )
  }
}

export default PrivilegesForm;
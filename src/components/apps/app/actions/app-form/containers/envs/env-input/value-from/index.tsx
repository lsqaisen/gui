import * as React from 'react';
import { Form, Row, Col, Input, Select } from 'antd';
import { FormInput, SearchSelect } from 'library';
import { FormInputProps } from 'library/type/forminput/';
import { EnvFieldRef, EnvKeyRef, EnvResourceFieldRef } from 'api/type/app/';
import KeyRefInput from './key-ref-input';
import Context from '@/components/apps/app/context';
import { IConfigMap } from '@/models/apps/configmap';
import { ISecret } from '@/models/apps/secret';

const FormItem = Form.Item;
const Option = Select.Option;

export interface ValueFromProps extends FormInputProps<{
  configMapKeyRef: EnvKeyRef
  secretKeyRef: EnvKeyRef
  fieldRef: EnvFieldRef
  resourceFieldRef: EnvResourceFieldRef
}> { }

@(FormInput.create({ name: "value-from-input" }) as any)
class ValueFrom extends React.PureComponent<ValueFromProps, any> {
  static readonly defaultProps = {
    value: {},
    form: {} as any,
  }

  constructor(props: ValueFromProps) {
    super(props);
    this.state = {
      type: props.value ? (props.value.configMapKeyRef ? 'conf' : (props.value.secretKeyRef ? 'secret' : '')) : ''
    }
  }
  render() {
    const { value, form } = this.props;
    const { configMapKeyRef, secretKeyRef } = value!;
    const { getFieldDecorator } = form;
    const { type } = this.state;
    return (type === "conf" ? <FormInput>
      {getFieldDecorator('configMapKeyRef', {
        initialValue: configMapKeyRef,
        rules: []
      })(
        <KeyRefInput onTypeChanage={(type, callback) => {
          this.setState({ type }, callback)
        }} />
      )}
    </FormInput> : <FormInput>
        {getFieldDecorator('secretKeyRef', {
          initialValue: secretKeyRef,
          rules: []
        })(
          <KeyRefInput onTypeChanage={(type, callback) => {
            this.setState({ type }, callback)
          }} />
        )}
      </FormInput>)
  }
}

export default ValueFrom;
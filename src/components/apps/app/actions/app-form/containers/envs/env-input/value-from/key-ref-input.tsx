import * as React from 'react';
import { Form, Row, Col, Select } from 'antd';
import { FormInput, SearchSelect } from 'library';
import { FormInputProps } from 'library/type/forminput/';
import { EnvKeyRef } from 'api/type/app/';
import Context from '@/components/apps/app/context';
import { IConfigMap } from '@/models/apps/configmap';
import { ISecret } from '@/models/apps/secret';

const FormItem = Form.Item;
const Option = Select.Option;

export interface KeyRefProps extends FormInputProps<EnvKeyRef> {
  onTypeChanage: (type: string, callback: () => void) => void;
}

@(FormInput.create({ name: "value-from-input" }) as any)
class KeyRef extends React.PureComponent<KeyRefProps, any> {
  static readonly defaultProps = {
    value: {} as EnvKeyRef,
    form: {} as any,
  }
  state = {
    keys: []
  }

  render() {
    const { value, form, onTypeChanage } = this.props;
    const { key, name } = value!;
    const { getFieldDecorator, setFieldsValue } = form;
    const { keys } = this.state;
    return (
      <Row gutter={4}>
        <Col span={12}>
          <Context.Consumer>
            {({ getConfigMaps, getSecrets }) => (
              <FormItem>
                {getFieldDecorator('name', {
                  initialValue: name,
                  rules: []
                })(
                  <SearchSelect
                    showSearch
                    style={{ width: '100%' }}
                    initialLoad={true}
                    placeholder="选择ConfigMap"
                    asyncSearch={async (page, callback) => {
                      let [configmaps, secrets] = await Promise.all([getConfigMaps!(), getSecrets!()]);
                      const results = [...configmaps.map((v: IConfigMap) => ({
                        key: v.name,
                        label: v.name,
                        ...v,
                      })) as any,
                      ...secrets.map((v: ISecret) => ({
                        key: v.metadata.name,
                        label: v.metadata.name,
                        ...v,
                      })) as any];
                      if (name) {
                        const selectValue = results.find((v: IConfigMap | ISecret) => ((v as IConfigMap).name || (v as ISecret).metadata.name) === name);
                        this.setState({ keys: Object.keys(selectValue.data || {}) });
                      }
                      callback({
                        total: configmaps.length,
                        results,
                      })
                    }}
                    onChangeOptions={(name, _, data) => {
                      const selectValue = data.find((v: IConfigMap | ISecret) => ((v as IConfigMap).name || (v as ISecret).metadata.name) === name);
                      if (!!selectValue.metadata) {
                        onTypeChanage('secret', () => {
                          setFieldsValue({ name: selectValue.metadata.name });
                          this.setState({ keys: Object.keys(selectValue.data || {}) });
                        })
                      } else {
                        onTypeChanage('conf', () => {
                          setFieldsValue({ name: selectValue.name });
                          this.setState({ keys: Object.keys(selectValue.data || {}) });
                        })
                      }
                    }}
                  />
                )}
              </FormItem>
            )}
          </Context.Consumer>
        </Col>
        <Col span={12}>
          <FormItem>
            {getFieldDecorator('key', {
              initialValue: key,
              rules: [
                { required: true, message: '标签值必须填写' },
              ]
            })(
              <Select>
                {keys.map(v => (<Option key={v}>{v}</Option>))}
              </Select>
            )}
          </FormItem>
        </Col>
      </Row >
    )
  }
}

export default KeyRef;
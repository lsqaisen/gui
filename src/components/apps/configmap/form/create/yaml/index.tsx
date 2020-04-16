import {PureComponent} from 'react';
import {Form} from 'antd';
import * as YAML from 'js-yaml';
import {FormInput, Inputs} from 'library';
import {FormInputProps} from 'library/type/forminput/';
import styles from '../style/index.less';

const FormItem = Form.Item;

export interface YamlInputProps
  extends FormInputProps<{[key: string]: string}> {}

const YamlCode = Inputs.Wapper({
  load: value => {
    let yaml: {[key: string]: string} = {};
    Object.entries(value).forEach(([k, v]: any) => {
      yaml[k] = YAML.load(v);
    });
    return YAML.dump(yaml);
  },
  dump: value => {
    let yaml: {[key: string]: string} = {};
    Object.entries(YAML.load(value)).forEach(([k, v]: any) => {
      yaml[k] = YAML.dump(v);
    });
    return yaml;
  }
})(Inputs.Code);

@(FormInput.create({
  name: 'yaml',
  onValuesChange: ({onChange}, _, allValues) => {
    onChange(allValues.yaml);
  }
}) as any)
class YamlInput extends PureComponent<YamlInputProps, any> {
  static readonly defaultProps = {
    form: {} as any
  };

  render() {
    const {value, form} = this.props;
    const {getFieldDecorator} = form;
    return (
      <FormItem>
        {getFieldDecorator('yaml', {
          initialValue: value,
          rules: [
            {required: true, message: '值必须填写'},
            {
              validator: (_, value, callback) => {
                try {
                  YAML.load(value);
                  callback();
                } catch (error) {
                  callback('YAML格式不正确！');
                }
                callback();
              }
            }
          ]
        })(<YamlCode className={styles[`code-input`]} autosize mode="yaml" />)}
      </FormItem>
    );
  }
}

export default YamlInput;

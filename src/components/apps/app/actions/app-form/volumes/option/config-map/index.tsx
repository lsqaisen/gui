import { Form } from 'antd';
import ConfigMapInput from './input';
import options from '../../options';
import { ConfigMap } from 'api/type/app';

export default options({
  title: "配置ConfigMap",
  dump: (value: ConfigMap) => value.name ? `${value.name}${value.optional ? '(指定部分key)' : ''}` : undefined,
})(Form.create({ name: 'configmap' })(ConfigMapInput));
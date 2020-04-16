import {Form} from 'antd';
import SecretInput from './input';
import options from '../../options';
import {Secret} from 'api/type/app';

export default options({
  title: '配置Secret',
  dump: (value: Secret) =>
    value.secretName
      ? `${value.secretName}${value.optional ? '(指定部分key)' : ''}`
      : undefined
})(Form.create({name: 'secret'})(SecretInput));

import { Form } from 'antd';
import HostPathInput from './input';
import options from '../options';
import { HostPath } from 'api/type/app';

export default options({
  title: "配置主机路径",
  dump: (value: HostPath) => value.path ? `${value.path}(${value.type || "NoChecks"})` : undefined,
})(Form.create({ name: 'host-path' })(HostPathInput));
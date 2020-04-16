import {Icon} from 'antd';
import AppNamespaceForm from './form/add-namespace-form';
import {makeDrawerForm} from 'library';

export interface AppNamespaceProps {
  btn?: React.ReactNode;
  onSubmit?: (name: string) => void;
}

const Add = makeDrawerForm<string, any>(AppNamespaceForm);

export default ({btn, onSubmit}: AppNamespaceProps) => (
  <Add
    btnText="添加命名空间"
    btnIcon={<Icon type="plus" />}
    btn={btn}
    submit={({name}: any) => onSubmit!(name)}
  />
);

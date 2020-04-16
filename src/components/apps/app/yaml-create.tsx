import YamlForm from './form/yaml-form';
import {IConfigMap} from '@/models/apps/configmap';
import Context from './context';
import {makeDrawerForm} from 'library';
import {ImportAppType} from 'api/type/app';

export interface CreateProps {
  data?: IConfigMap;
}

export const Add = makeDrawerForm<ImportAppType, any>(YamlForm);

export default (props: any) => (
  <Context.Consumer>
    {({namespace, importApp}) => (
      <Add
        {...props}
        canFullScreen
        btnText="YAML添加资源"
        // btnIcon={<Icon type="plus" />}
        submit={importApp}
        value={{namespace} as ImportAppType}
      />
    )}
  </Context.Consumer>
);

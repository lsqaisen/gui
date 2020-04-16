import {Icon} from 'antd';
import CreateForm from './form/create';
import {IConfigMap} from '@/models/apps/configmap';
import Context from './context';
import {makeDrawerForm} from 'library';
import {ConfigMapRequest} from 'api/type/app';

export interface CreateProps {
  data?: IConfigMap;
}

export const Add = makeDrawerForm<ConfigMapRequest, any>(CreateForm);

export default (props: any) => (
  <Context.Consumer>
    {({namespace, createConfigMap}) => (
      <Add
        {...props}
        canFullScreen
        btnText="添加配置"
        btnIcon={<Icon type="plus" />}
        submit={createConfigMap}
        value={{namespace} as ConfigMapRequest}
      />
    )}
  </Context.Consumer>
);

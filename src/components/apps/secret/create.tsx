import {Icon} from 'antd';
import CreateForm from './form/create';
import {ISecret} from '@/models/apps/secret';
import Context from './context';
import {makeDrawerForm} from 'library';
import {SecretRequest} from 'api/type/app';

export interface CreateProps {
  data?: ISecret;
}

export const Add = makeDrawerForm<SecretRequest, any>(CreateForm);

export default (props: any) => (
  <Context.Consumer>
    {({namespace, createSecret}) => (
      <Add
        {...props}
        canFullScreen
        btnText="添加配置"
        btnIcon={<Icon type="plus" />}
        submit={createSecret}
        value={{namespace} as SecretRequest}
      />
    )}
  </Context.Consumer>
);

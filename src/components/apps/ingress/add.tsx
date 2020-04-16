import {Icon} from 'antd';
import AddPoolForm from './form/add-form';
import Context from './context';
import {makeDrawerForm} from 'library';
import {IngressRequest, IngressRuleType} from 'api/type/app';

const Add = makeDrawerForm<IngressRequest, any>(AddPoolForm);

export default (props: any) => (
  <Context.Consumer>
    {({namespace, createIngress}) => (
      <Add
        {...props}
        btnText="添加负载均衡"
        btnIcon={<Icon type="plus" />}
        submit={createIngress}
        value={{namespace, rules: [{} as IngressRuleType]} as IngressRequest}
      />
    )}
  </Context.Consumer>
);

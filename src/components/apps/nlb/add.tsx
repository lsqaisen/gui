import { Icon } from 'antd';
import AddPoolForm from './form/add-form';
import Context from './context';
import { makeDrawerForm } from 'library';
import { NlbRequest } from 'api/type/app';

const Add = makeDrawerForm<NlbRequest, any>(AddPoolForm)

export default (props: any) => (
  <Context.Consumer>
    {({ namespace, createNlb }) => (<Add
      {...props}
      btnText="添加负载均衡"
      btnIcon={<Icon type="plus" />}
      submit={createNlb}
      value={{ namespace } as NlbRequest}
    />)}
  </Context.Consumer>
)
import { Icon } from 'antd';
import AddVipForm from './form/add-form';
import { addVipRequest } from 'api/type/network';
import Context from './context';
import { makeDrawerForm } from 'library'

const Add = makeDrawerForm<addVipRequest, any>(AddVipForm)

export default () => (
  <Context.Consumer>
    {({ createVip }) => (<Add width={520} btnText="添加负载均衡VIP" btnIcon={<Icon type="plus" />} submit={createVip} />)}
  </Context.Consumer>
)
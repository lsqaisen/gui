import { Icon } from 'antd';
import AddPoolForm from './form/add-form';
import { addPoolRequest } from 'api/type/network';
import Context from './context';
import { makeDrawerForm } from 'library';

const Add = makeDrawerForm<addPoolRequest>(AddPoolForm)

export default () => (
  <Context.Consumer>
    {({ createPool }) => (<Add btnText="添加IP池" btnIcon={<Icon type="plus" />} submit={createPool} />)}
  </Context.Consumer>
)
import Add, { AddProps } from '@/components/registry/private/add';
import { addPrivateRequest } from 'api/type/registry';

export interface AddPrivateProps extends AddProps {
  dispatch: React.Dispatch<any>;
}

export default ({ dispatch }: AddPrivateProps) => {
  const addUser = (payload: addPrivateRequest) => dispatch({ type: 'private/add', payload: { ...payload } })
  return (
    <Add
      submit={addUser}
    />
  )
}


import AddUser, { AddUserProps as AddProps } from '@/components/user/user/add-user';
import { userRequest } from 'api/type/user';

export interface AddUserProps extends AddProps {
  dispatch: React.Dispatch<any>
}

export default ({ dispatch }: AddUserProps) => {
  const addUser = (payload: userRequest) => dispatch({ type: 'users/add', payload })
  return (
    <AddUser
      submit={addUser}
    />
  )
}


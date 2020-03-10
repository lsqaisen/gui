import EditUser, { EditUserProps as EditProps } from '@/components/user/user/edit-user';
import { updateUserRequest } from 'api/type/user';

export interface EditUserProps extends EditProps {
  dispatch: React.Dispatch<any>
}

export default ({ dispatch, ...props }: EditUserProps) => {
  const editUser = (payload: updateUserRequest) => dispatch({ type: 'users/update', payload })
  return (
    <EditUser
      {...props}
      submit={editUser}
    />
  )
}


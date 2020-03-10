import * as React from 'react';
import Delete from '@/components/registry/private/delete';
import { IPrivate } from '@/models/registry/private';

interface ActionsProps {
  data?: IPrivate;
  dispatch: React.Dispatch<any>
}

export default ({ data = {} as IPrivate, dispatch }: ActionsProps) => {
  return (
    <Delete
      data={data}
      btn={<a style={{ color: '#ff5242' }} />}
      onOk={() => {
        return dispatch({
          type: `private/delete`,
          payload: data
        })
      }}
    > 删除</Delete>
  )
}

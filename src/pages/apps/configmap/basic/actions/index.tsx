import * as React from 'react';
import Delete from '@/components/apps/configmap/delete';

export default ({ data, dispatch }: any) => {
  return (
    <Delete
      btn={<a style={{ color: '#ff5242' }} />}
      data={data}
      onOk={() => {
        return dispatch({
          type: `configmap/delete`,
          payload: data
        })
      }}
    >删除</Delete>
  )
}

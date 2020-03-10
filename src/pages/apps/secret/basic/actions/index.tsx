import * as React from 'react';
import Delete from '@/components/apps/secret/delete';

export default ({data, dispatch}: any) => {
  return (
    <Delete
      btn={<a style={{color: '#ff5242'}} />}
      data={data}
      onOk={() => {
        return dispatch({
          type: `secret/delete`,
          payload: {
            name: data.metadata.name,
            namespace: data.metadata.namespace,
          },
        });
      }}
    >
      删除
    </Delete>
  );
};

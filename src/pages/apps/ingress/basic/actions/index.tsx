import * as React from 'react';
import Delete from '@/components/apps/ingress/delete';
import { Menu } from 'antd';

export default ({ data, dispatch, onClick, ...props }: any) => {
  return (
    <>
      <Menu.Item  {...props} onClick={() => onClick!('addrules')}>编辑</Menu.Item>
      <Menu.Divider {...props} />
      <Delete
        btn={<Menu.Item style={{ color: '#ff5242' }} {...props} />}
        data={data}
        onDelete={() => {
          return dispatch({
            type: `ingress/delete`,
            payload: data
          })
        }}
      >删除</Delete>
    </>
  )
}

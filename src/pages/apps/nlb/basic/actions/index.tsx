import * as React from 'react';
import Delete from '@/components/apps/nlb/delete';
import { Menu } from 'antd';

export default ({ data, dispatch, onClick, ...props }: any) => {
  return (
    <>
      {/* <Menu.Item  {...props} onClick={() => onClick!('addrules')}>修改转发规则</Menu.Item>
      <Menu.Divider {...props} /> */}
      <Delete
        btn={<Menu.Item style={{ color: '#ff5242' }} {...props} />}
        data={data}
        onDelete={() => {
          return dispatch({
            type: `nlb/delete`,
            payload: data
          })
        }}
      >删除</Delete>
    </>
  )
}

import * as React from 'react';
import { Menu } from 'antd';
import Delete from '@/components/registry/images/delete';
import ChangeStatus from '@/components/registry/images/change-status';
import { IImage, ITag } from '@/models/registry/images';

interface ActionsProps {
  type?: "image" | "tag";
  data?: ITag | IImage;
  update?: (name?: string) => void;
  dispatch: React.Dispatch<any>
}

export default ({ type = "image", data = {} as IImage, update = () => null, dispatch, ...props }: ActionsProps) => {
  return (
    <React.Fragment>
      {type === "image" ? [<ChangeStatus
        key="lock"
        data={data}
        actionType={!data.locked ? "lock" : "unlock"}
        btn={<Menu.Item {...props} />}
        callback={() => update(data.name)}
        onOk={() => {
          return dispatch({
            type: `registry/changeStatus`,
            payload: {
              name: data.name,
              action: !data.locked ? "lock" : "unlock",
              tag: data.tag
            }
          })
        }}
      > {data.locked ? '解锁' : '上锁'}</ChangeStatus>,
      <ChangeStatus
        key="pub"
        data={data}
        actionType={!data.is_public ? "pub" : "unpub"}
        btn={<Menu.Item {...props} />}
        callback={() => update(data.name)}
        onOk={() => {
          return dispatch({
            type: `registry/changeStatus`,
            payload: {
              name: data.name,
              action: !data.is_public ? "pub" : "unpub",
              tag: data.tag
            }
          })
        }}
      > {!data.is_public ? '公开' : '私有'}</ChangeStatus>] : []}
      <Menu.Divider {...props} />
      <Delete
        key="delete"
        data={data}
        btn={type === "image" ? <Menu.Item {...props} style={{ color: '#ff5242' }} /> : <a style={{ color: '#ff5242' }} />}
        callback={() => update(data.name)}
        onOk={() => {
          return dispatch({
            type: `registry/deleteImage`,
            payload: {
              name: data.name,
              tag: data.tag
            }
          })
        }}
      > 删除</Delete>
    </React.Fragment >
  )
}

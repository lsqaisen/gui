import { Menu } from 'antd';
import Delete from '@/components/apps/app/delete';
import ModifyReplicas from '@/components/apps/app/modify-replicas';
import { IApp } from '@/models/apps/apps';

interface ActionsProps {
  data?: IApp;
  update?: (name?: string) => void;
  dispatch: React.Dispatch<any>;
  onClick?: (key: string) => void;
}

export default ({ data = {} as IApp, update = () => null, onClick, dispatch, ...props }: ActionsProps) => {
  return (
    <>
      <Menu.Item {...props} onClick={() => onClick!('edit')}>编辑</Menu.Item>
      <ModifyReplicas
        key="lock"
        data={data}
        btn={<Menu.Item disabled={!data.replicas} {...props} />}
        callback={() => update(data.name)}
        onOk={(replicas) => {
          return dispatch({
            type: `apps/modifyReplicas`,
            payload: {
              ...data,
              app_type: data.type,
              replicas,
            }
          })
        }}
      >修改实例数</ModifyReplicas>
      <Menu.Divider {...props} />
      <Delete
        key="delete"
        data={data}
        btn={<Menu.Item {...props} style={{ color: '#ff5242' }} />}
        callback={() => update(data.name)}
        onOk={() => {
          return dispatch({
            type: `apps/delete`,
            payload: { app_type: data.type, ...data }
          })
        }}
      > 删除</Delete>
    </>
  )
}

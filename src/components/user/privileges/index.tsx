import { IPrivilege } from "@/models/uesr/privileges";
import { Checkbox, List, Descriptions } from "antd";

export const modules: any = {
  users: '用户管理',
  apps: '应用管理',
  registry: '镜像仓库',
  cluster: '集群管理',
  network: '网路管理',
}

export type PrivilegesProps = {
  loading: boolean;
  privileges: IPrivilege[];
  onChange: (privileges: IPrivilege[]) => void
}

export default ({ loading, privileges, onChange }: PrivilegesProps) => {
  return (
    <List
      loading={loading}
      dataSource={privileges}
      renderItem={(v, i) => (
        <List.Item>
          <Descriptions>
            <Descriptions.Item span={24} label={modules[v.module]}>
              <Checkbox.Group options={[
                { label: '查看', value: 'c' },
                { label: '创建', value: 'r' },
                { label: '更新', value: 'u' },
                { label: '删除', value: 'd' },
              ]}
                value={v.modes}
                onChange={(checkedValue) => {
                  let _privileges = Object.assign(privileges);
                  _privileges[i] = { ...v, modes: checkedValue };
                  onChange!(_privileges);
                }}
              />
            </Descriptions.Item>
          </Descriptions>
        </List.Item>
      )}
    />
  )
}
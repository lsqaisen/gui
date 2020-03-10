import { Table, Tag, Typography } from "antd";
import { EllipsisTooltip } from "library";
import Time from 'react-time-format';
import { IVersion } from "@/models/apps/apps";

export interface VersionsProps {
  data: IVersion[];
}

const Versions = ({ data }: VersionsProps) => {
  return (
    <Table columns={[{
      title: '名称',
      dataIndex: 'name',
      render: (t, r) => <a>{t}{r.current && <Tag color='green'>当前版本</Tag>}</a>,
    }, {
      title: '版本',
      dataIndex: 'version',
      render: text => <a>{text}</a>,
    }, {
      title: '详情',
      dataIndex: 'detail',
      width: '60%',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 186,
          minWidth: 126,
        }
      }),
      render: t => (
        <Typography.Text copyable={{ text: t }}>
          <EllipsisTooltip title={t} width="calc(100% - 22px)">{t}</EllipsisTooltip>
        </Typography.Text>
      ),
    }, {
      title: '更新时间',
      dataIndex: 'upgrade_time',
      render: text => <Time format="YYYY-MM-DD  HH:mm" value={new Date(text)} />,
    }]} dataSource={data.map(v => ({ key: v.version, ...v }))} />
  )
}

export default Versions;
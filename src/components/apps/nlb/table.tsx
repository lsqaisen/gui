import {PureComponent} from 'react';
import {ColumnProps} from 'antd/lib/table';
import {Table, EllipsisTooltip} from 'library';
import {INlb} from '@/models/apps/nlb';
import {Typography} from 'antd';
import Link from 'umi/link';

export type INlbProps = {
  data: INlb[];
  loading: boolean;
  actions?: React.ReactNode | (() => React.ReactNode);
};

class Nlb extends PureComponent<INlbProps, any> {
  columns: ColumnProps<INlb>[] = [
    {
      title: '负载均衡',
      dataIndex: 'name',
      width: 226,
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          minWidth: 186,
          maxWidth: 226
        }
      }),
      render: (t, r, i) => {
        return (
          <Typography.Text copyable={{text: t}}>
            <EllipsisTooltip title={t} width="calc(100% - 22px)">
              <Link to={`/apps/nlb/${t}?ns=${r.namespace}`}>{t}</Link>
            </EllipsisTooltip>
          </Typography.Text>
        );
      }
    },
    {
      title: '访问IP',
      dataIndex: 'ip',
      width: 116,
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 116,
          minWidth: 116
        }
      }),
      render: (t, r) => <EllipsisTooltip title={r.ip}>{r.ip}</EllipsisTooltip>
    },
    {
      title: '应用名称',
      dataIndex: 'app_name',
      width: 156,
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          minWidth: 96,
          maxWidth: 156
        }
      }),
      render: (t, r, i) => <EllipsisTooltip title={t}>{t}</EllipsisTooltip>
    },
    {
      title: '转发规则',
      dataIndex: 'ports',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 286,
          minWidth: 286
        }
      }),
      render: (t, r, i) => {
        const text = r.ports.map(
          port =>
            `${port.protocol}:${r.ip}:${port.port}->${r.app_name}:${port.target_port}`
        );
        return <EllipsisTooltip title={text}>{text}</EllipsisTooltip>;
      }
    }
  ];
  render() {
    const {loading, data, actions, children, ...props} = this.props;
    return (
      <Table<INlb>
        {...props}
        loading={loading}
        columns={this.columns}
        dataSource={data.map(v => ({key: v.name, ...v}))}
        actions={actions}
      >
        {children}
      </Table>
    );
  }
}

export default Nlb;

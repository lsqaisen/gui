import {PureComponent} from 'react';
import Time from 'react-time-format';
import {ColumnProps} from 'antd/lib/table';
import {Table, EllipsisTooltip, Status} from 'library';
import {IInstance} from '@/models/apps/apps';
import Containers from './containers';

export type ImagesProps = {
  data: IInstance[];
  loading: boolean;
};

class Instances extends PureComponent<ImagesProps, any> {
  columns: ColumnProps<IInstance>[] = [
    {
      title: '实例名称',
      dataIndex: 'name',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 156,
          minWidth: 82,
          cursor: 'pointer'
        }
      }),
      render: (t, r) => <EllipsisTooltip title={t}>{t}</EllipsisTooltip>
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      width: 116,
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 186,
          minWidth: 116
        }
      })
    },
    {
      title: '节点IP',
      dataIndex: 'node_ip',
      width: 116,
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 186,
          minWidth: 116
        }
      })
    },
    {
      title: '重启次数',
      dataIndex: 'restart_count',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 186,
          minWidth: 116
        }
      })
    },
    {
      title: '运行时间',
      dataIndex: 'duration',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 186,
          minWidth: 116
        }
      })
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      width: 136,
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 136,
          minWidth: 136
        }
      }),
      render: (t, r, i) => (
        <Time format="YYYY-MM-DD  HH:mm" value={new Date(t)} />
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 128,
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 128,
          minWidth: 128
        }
      }),
      render: (t, r) => (
        <Status
          status={t}
          text={t}
          info={{
            error: [],
            info: [],
            warning: [],
            success: ['abnormal', 'running']
          }}
        />
      )
    }
  ];
  render() {
    const {loading, data, children, ...props} = this.props;
    return (
      <Table<IInstance>
        {...props}
        actionFixed={false}
        pagination={{
          total: data.length
        }}
        loading={loading}
        columns={this.columns}
        dataSource={data.map(v => ({key: v.name, ...v}))}
        expandedRowRender={(
          record: IInstance,
          index: number,
          indent: number,
          expanded: boolean
        ) => <Containers loading={loading} data={record.containers || []} />}
      >
        {children}
      </Table>
    );
  }
}

export default Instances;

import {PureComponent} from 'react';
import Time from 'react-time-format';
import {ColumnProps} from 'antd/lib/table';
import {Table, EllipsisTooltip, Status} from 'library';
import {IContainer} from '@/models/apps/apps';

export type ImagesProps = {
  data: IContainer[];
  loading: boolean;
};

class Containers extends PureComponent<ImagesProps, any> {
  columns: ColumnProps<IContainer>[] = [
    {
      title: '容器名称',
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
      title: '镜像',
      dataIndex: 'image',
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
      <Table<IContainer>
        {...props}
        style={{
          marginBottom: 8,
          backgroundColor: 'transparent',
          transform: 'scale(1)'
        }}
        actionFixed={false}
        pagination={false}
        loading={loading}
        columns={this.columns}
        dataSource={data.map(v => ({key: v.name, ...v}))}
      >
        {children}
      </Table>
    );
  }
}

export default Containers;

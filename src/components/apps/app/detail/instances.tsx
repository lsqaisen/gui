import { PureComponent } from 'react';
import Time from 'react-time-format';
import { ColumnProps } from 'antd/lib/table';
import { Table, EllipsisTooltip, Status } from 'library';
import { IInstance } from '@/models/apps/apps';
import Containers from './containers';
import { Tooltip, Button, Cascader } from 'antd';


export type InstancesProps = {
  loading: boolean;
  ns: string;
  data: IInstance[];
  actions?: React.ReactNode | (() => React.ReactNode);
}

class Instances extends PureComponent<InstancesProps, any> {
  columns: ColumnProps<IInstance>[] = [{
    title: '实例名称',
    dataIndex: 'name',
    onCell: () => ({
      style: {
        whiteSpace: 'nowrap',
        maxWidth: 156,
        minWidth: 82,
        cursor: 'pointer',
      }
    }),
    render: (t, r) => <EllipsisTooltip title={t}>{t}</EllipsisTooltip>,
  }, {
    title: 'IP地址(Pod/节点)',
    dataIndex: 'ip',
    width: 186,
    onCell: () => ({
      style: {
        whiteSpace: 'nowrap',
        maxWidth: 186,
        minWidth: 116,
      }
    }),
    render: (t, r) => <EllipsisTooltip title={`${r.ip}/${r.node_ip}`}>{`${r.ip}/${r.node_ip}`}</EllipsisTooltip>,
  }, {
    title: '重启数',
    dataIndex: 'restart_count',
    width: 64,
    onCell: () => {
      return {
        style: {
          whiteSpace: 'nowrap',
          minWidth: 64,
          maxWidth: 64,
        }
      }
    },
  }, {
    title: '运行时间',
    dataIndex: 'duration',
    onCell: () => ({
      style: {
        whiteSpace: 'nowrap',
        maxWidth: 186,
        minWidth: 116,
      }
    }),
  }, {
    title: '创建时间',
    dataIndex: 'create_time',
    width: 136,
    onCell: () => ({
      style: {
        whiteSpace: 'nowrap',
        maxWidth: 136,
        minWidth: 136,
      }
    }),
    render: (t, r, i) => <Time format="YYYY-MM-DD  HH:mm" value={new Date(t)} />,
  }, {
    title: '状态',
    dataIndex: 'status',
    width: 88,
    onCell: () => ({
      style: {
        whiteSpace: 'nowrap',
        maxWidth: 88,
        minWidth: 88,
      }
    }),
    render: (t, r) => <Status status={t} text={t} info={{ error: [], info: [], warning: [], success: ['abnormal', 'running'] }} />,
  }, {
    title: '控制台',
    dataIndex: '',
    width: 84,
    className: 'tc',
    onCell: () => {
      return {
        style: {
          minWidth: 84,
        }
      }
    },
    render: (t, r) => (
      r.containers.length > 1 ? <>
        <Tooltip title="日志">
          <Cascader options={r.containers.map(v => ({ label: v.name, value: v.name }))} onChange={(value) => {
            window.open(`/#/log/pod/${r.name}?cntr=${value}&ns=${this.props.ns}`)
          }}>
            <Button style={{ float: 'left' }} type="link" icon="file-text" />
          </Cascader>
        </Tooltip>
        <Tooltip title="终端">
          <Cascader options={r.containers.map(v => ({ label: v.name, value: v.name }))} onChange={(value) => {
            window.open(`/#/terminal/pod/${r.name}?cntr=${value}&ns=${this.props.ns}`)
          }}>
            <Button style={{ float: 'left' }} type="link" icon="code" />
          </Cascader>
        </Tooltip>
      </> : <>
          <Tooltip title="日志">
            <Button style={{ float: 'left' }} type="link" icon="file-text" onClick={e => { e.preventDefault(); window.open(`/#/log/pod/${r.name}?cntr=${r.containers[0].name}&ns=${this.props.ns}`) }} />
          </Tooltip>
          <Tooltip title="终端">
            <Button style={{ float: 'left' }} type="link" icon="code" onClick={e => { e.preventDefault(); window.open(`/#/terminal/pod/${r.name}?cntr=${r.containers[0].name}&ns=${this.props.ns}`) }} />
          </Tooltip>
        </>
    )
  }];
  render() {
    const { loading, data, children, ...props } = this.props;
    return (
      <Table<IInstance>
        {...props}
        actionType="button"
        actionFixed={false}
        pagination={{
          total: data.length,
        }}
        loading={loading}
        columns={this.columns}
        dataSource={data.map(v => ({ key: v.name, ...v }))}
        expandedRowRender={(record: IInstance, index: number, indent: number, expanded: boolean) => (
          <section style={{ position: 'relative', width: '100%' }}>
            <Containers loading={loading} data={record.containers || []} />
          </section>
        )}
      >
        {children}
      </Table>
    )
  }
}

export default Instances;
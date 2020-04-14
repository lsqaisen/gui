import { PureComponent } from 'react';
import { Icon, Tooltip, Button, Cascader } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { Table, EllipsisTooltip, Status } from 'library';
import { IPod } from '@/models/cluster/cluster';

export type PodsProps = {
  pods: IPod[];
}

class Pods extends PureComponent<PodsProps, any> {
  columns: ColumnProps<IPod>[] = [
    {
      title: '副本名称',
      dataIndex: 'name',
      onCell: (r) => {
        return ({
          style: {
            cursor: "pointer",
            whiteSpace: 'nowrap',
            maxWidth: 400,
            color: '#286cff',
          }
        })
      },
      render: (t, r) => (<EllipsisTooltip title={r.metadata.name}>{r.metadata.name}</EllipsisTooltip>)
    }, {
      title: '副本IP',
      dataIndex: 'podIP',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 180,
        }
      }),
      render: (t, r) => <EllipsisTooltip title={t}>{t}</EllipsisTooltip>,
    }, {
      title: '节点IP',
      dataIndex: 'hostIP',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 180,
        }
      }),
      render: (t, r) => <EllipsisTooltip title={t}>{t} </EllipsisTooltip>,
    }, {
      title: "CPU",
      dataIndex: 'cpu-usages',
      width: 86,
      onCell: () => {
        return {
          style: {
            whiteSpace: 'nowrap',
            minWidth: 86,
            maxWidth: 86,
          }
        }
      },
      render: (_, r) => r.capacity ? `${((r || {}).capacity || {}).cpu / 1000}核` : "--"
    }, {
      title: "内存",
      dataIndex: 'memory',
      width: 86,
      onCell: () => {
        return {
          style: {
            whiteSpace: 'nowrap',
            minWidth: 86,
            maxWidth: 86,
          }
        }
      },
      render: (_, r) => r.capacity ? `${window.Number(((r || {}).capacity || {}).memory).flowCeil(2)}` : "--"
    }, {
      title: '重启数',
      dataIndex: 'restartCount',
      className: "tc",
      width: 78,
      onCell: () => {
        return {
          style: {
            whiteSpace: 'nowrap',
            minWidth: 78,
            maxWidth: 78,
          }
        }
      },
    }, {
      title: '状态',
      dataIndex: 'status',
      width: 86,
      onCell: () => {
        return {
          style: {
            whiteSpace: 'nowrap',
            minWidth: 86,
            maxWidth: 86,
          }
        }
      },
      render: (t, r) => <Status status={t} text={t} />,
    }, {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
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
            <Cascader options={r.containers.map(v => ({ label: v, value: v }))} onChange={(value) => {
              window.open(`/#/log/pod/${r.metadata.name}?cntr=${value}&ns=${r.metadata.namespace}`)
            }}>
              <Button style={{ float: 'left' }} type="link" icon="file-text" />
            </Cascader>
          </Tooltip>
          <Tooltip title="终端">
            <Cascader options={r.containers.map(v => ({ label: v, value: v }))} onChange={(value) => {
              window.open(`/#/terminal/pod/${r.metadata.name}?cntr=${value}&ns=${r.metadata.namespace}`)
            }}>
              <Button style={{ float: 'left' }} type="link" icon="code" />
            </Cascader>
          </Tooltip>
        </> : <>
            <Tooltip title="日志">
              <Button style={{ float: 'left' }} type="link" icon="file-text" onClick={e => { e.preventDefault(); window.open(`/#/log/pod/${r.metadata.name}?cntr=${r.containers[0]}&ns=${r.metadata.namespace}`) }} />
            </Tooltip>
            <Tooltip title="终端">
              <Button style={{ float: 'left' }} type="link" icon="code" onClick={e => { e.preventDefault(); window.open(`/#/terminal/pod/${r.metadata.name}?cntr=${r.containers[0]}&ns=${r.metadata.namespace}`) }} />
            </Tooltip>
          </>
      )
    }
  ];
  state = {
    visible: false,
    containers: [],
  }
  showContainers = (containers: any[]) => {
    this.setState({
      visible: true,
      containers,
    })
  }
  render() {
    const { pods, children, ...props } = this.props;
    return (
      <Table<IPod>
        {...props}
        columns={this.columns}
        dataSource={pods!.map((v: IPod) => ({ key: v.metadata.name, ...v }))}
      >
        {children}
      </Table>
    )
  }
}

export default Pods;


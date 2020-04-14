import * as React from 'react';
import {PureComponent, Fragment} from 'react';
import {Divider} from 'antd';
import {ColumnProps} from 'antd/lib/table';
import Link from 'umi/link';
import {Table, EllipsisTooltip, Status} from 'library';
import {ActionTableProps} from 'library/type/table/';
import Chart from './chart';

interface INode {
  key: number;
  addresses: {
    type: 'ExternalIP' | 'InternalIP' | 'Hostname';
    address: string;
  }[];
  allocatable: {
    cpu: number;
    'ephemeral-storage': number;
    'hugepages-1Gi': number;
    'hugepages-2Mi': number;
    memory: number;
    pods: number;
  };
  allocated: {
    cpu: number;
    memory: number;
  };
  capacity: {
    cpu: number;
    'ephemeral-storage': number;
    'hugepages-1Gi': number;
    'hugepages-2Mi': number;
    memory: number;
    pods: number;
  };
  metadata: {
    annotations: {[key: string]: any};
    creationTimestamp: string;
    labels: {[key: string]: any};
    name: string;
    resourceVersion: string;
    selfLink: string;
    uid: string;
  };
  nodeInfo: {[key: string]: any};
  pods: number;
  status: 'Ready' | 'Pendding' | 'Running';
  usages: {
    cpu: number;
    memory: number;
  };
}

export interface NodeProps extends ActionTableProps<INode> {
  nodes: INode[];
  loading: boolean;
}

class Node extends PureComponent<NodeProps, any> {
  columns: ColumnProps<INode>[] = [
    {
      title: '节点名称',
      dataIndex: 'name',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 185,
          minWidth: 126
        }
      }),
      render: (_, r) => {
        let text = `${r.metadata.name}<${
          (r.addresses.find(v => v.type === 'InternalIP') || {address: '--'})
            .address
        }>`;
        return (
          <EllipsisTooltip title={text}>
            <Link to={`/cluster/${r.metadata.name}`}>{text}</Link>
          </EllipsisTooltip>
        );
      }
    },
    {
      title: '副本数',
      dataIndex: 'pods',
      className: 'tc',
      width: 148,
      onCell: () => {
        return {
          style: {
            whiteSpace: 'nowrap',
            maxWidth: 148,
            minWidth: 128
          }
        };
      },
      render: (t, r) => `${t}/${r.allocatable.pods}`
    },
    {
      title: (
        <Fragment>
          CPU
          <Divider type="vertical" />
          总共/申请
        </Fragment>
      ),
      dataIndex: 'cpu-usages',
      width: 200,
      onCell: () => {
        return {
          style: {
            whiteSpace: 'nowrap',
            minWidth: 200,
            maxWidth: 200
          }
        };
      },
      render: (_, r) => (
        <Chart
          color="#5380ea"
          extra={`${r.capacity.cpu ? `${r.capacity.cpu / 1000}核` : '--'}/${r
            .allocated.cpu / 1000}核`}
          percent={r.capacity.cpu}
          symbol="M"
          data={[
            {
              title: 'cpu',
              actual: (r.usages || {}).cpu || 0,
              request: r.allocated.cpu
            }
          ]}
        />
      )
    },
    {
      title: (
        <Fragment>
          内存
          <Divider type="vertical" />
          总共/申请
        </Fragment>
      ),
      dataIndex: 'mem-usages',
      width: 200,
      onCell: () => {
        return {
          style: {
            whiteSpace: 'nowrap',
            minWidth: 200,
            maxWidth: 200
          }
        };
      },
      render: (_, r) => (
        <Chart
          color="#3fc3cf"
          extra={`${
            r.capacity.memory
              ? `${window.Number(r.capacity.memory).flowCeil(2)}`
              : '--'
          }/${window.Number(r.allocated.memory).flowCeil(2)}`}
          percent={r.capacity.memory / 1024 / 1024 / 1024}
          symbol="Gi"
          data={[
            {
              title: 'mem',
              actual: Number(
                Number(
                  ((r.usages || {}).memory || 0) / 1024 / 1024 / 1024
                ).toFixed(2)
              ),
              request: Number(
                Number(r.allocated.memory / 1024 / 1024 / 1024).toFixed(2)
              )
            }
          ]}
        />
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
      render: (t, r) => <Status status={t} text={t} />
    }
  ];
  render() {
    const {loading, nodes, children, ...props} = this.props;
    return (
      <Table<INode>
        {...props}
        loading={loading}
        columns={this.columns}
        dataSource={(nodes || []).map(_ => ({key: _.metadata.name, ..._}))}
      >
        {children}
      </Table>
    );
  }
}

export default Node;

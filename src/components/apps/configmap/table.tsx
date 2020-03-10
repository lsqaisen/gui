import * as React from 'react';
import { PureComponent, Fragment } from 'react';
import { Drawer, Typography, Descriptions, Divider } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import Time from 'react-time-format';
import SyntaxHighlighter from 'react-syntax-highlighter';
import * as YAML from 'js-yaml';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Table, EllipsisTooltip } from 'library';
import { ActionTableProps } from 'library/type/table/';

interface IConfigMap {
  key: number
  creation_timestamp: string
  binary_data?: { [key: string]: any }
  data: { [key: string]: any }
  name: string
  namespace: string
}

export interface ConfigMapTableProps extends ActionTableProps<IConfigMap> { }

const Config = ({ data }: any) => {
  const text = JSON.stringify(data),
    yaml = YAML.dump(data || {});
  return (
    <Fragment>
      <Descriptions title={<Typography.Text style={{ fontWeight: 'bold', fontSize: '16px' }} copyable={{ text }}>配置项</Typography.Text>}>
        {Object.entries(data || {}).map(([key, value]: any) => (<Descriptions.Item span={3} key={key} label={key}>
          <Typography.Text copyable={{ text: `${key}:${value}` }}>{value}</Typography.Text>
        </Descriptions.Item>))}
      </Descriptions>
      <Divider />
      <Typography.Text style={{ fontWeight: 'bold', fontSize: '16px' }} copyable={{ text: yaml }}>YAML格式</Typography.Text>
      <SyntaxHighlighter language="yaml" style={vs}>{yaml}</SyntaxHighlighter>
    </Fragment>
  )
}

class ConfigMapTable extends PureComponent<ConfigMapTableProps, any> {
  columns: ColumnProps<IConfigMap>[] = [
    {
      title: '配置名称',
      dataIndex: 'name',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 185,
          minWidth: 126,
        }
      }),
      render: (t) => (<EllipsisTooltip title={t}>{t}</EllipsisTooltip>),
    },
    {
      title: '命名空间',
      dataIndex: 'namespace',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 185,
          minWidth: 126,
        }
      }),
      render: (t) => (<EllipsisTooltip title={t}>{t}</EllipsisTooltip>),
    },
    {
      title: '配置项',
      dataIndex: 'data',
      onCell: (r) => {
        return ({
          onClick: () => this.showDetails(r.data!),
          style: {
            cursor: "pointer",
            whiteSpace: 'nowrap',
            maxWidth: 400,
          }
        })
      },
      render: (t) => (
        <div>
          <div style={{ float: 'left', maxWidth: 'calc(100% - 80px' }}>
            <EllipsisTooltip title="">{JSON.stringify(t || {})}</EllipsisTooltip>
          </div>
          <span>{Object.keys(t || {}).length}项, </span>
          <a>详情</a>
        </div>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'creation_timestamp',
      width: 136,
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 136,
          minWidth: 136,
        }
      }),
      render: (t) => <Time format="YYYY-MM-DD  HH:mm" value={new Date(t)} />,
    },
  ];
  state = {
    visible: false,
    data: {},
  }
  showDetails = (data: any) => {
    this.setState({
      visible: true,
      data,
    })
  }
  render() {
    const { loading, children, ...props } = this.props;
    const { visible, data } = this.state;
    return (
      <Fragment>
        <Table<IConfigMap>
          {...props}
          actionText="删除"
          actionType="button"
          loading={loading}
          columns={this.columns}
        >
          {children}
        </Table>
        <Drawer
          title="ConfigMap配置详情"
          width={640}
          placement="right"
          maskStyle={{ backgroundColor: 'transparent' }}
          onClose={() => { this.setState({ visible: false }) }}
          visible={visible}
        >
          <Config data={data} />
        </Drawer>
      </Fragment>
    )
  }
}

export default ConfigMapTable;
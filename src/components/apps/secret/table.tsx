import * as React from 'react';
import {PureComponent, Fragment} from 'react';
import {Drawer, Typography, Descriptions, Divider} from 'antd';
import {ColumnProps} from 'antd/lib/table';
import Time from 'react-time-format';
import SyntaxHighlighter from 'react-syntax-highlighter';
import * as YAML from 'js-yaml';
import {vs} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {Table, EllipsisTooltip} from 'library';
import {ActionTableProps} from 'library/type/table/';
import {ISecret} from '@/models/apps/secret';

export interface SecretTableProps extends ActionTableProps<ISecret> {}

const Config = ({data}: any) => {
  const text = JSON.stringify(data),
    yaml = YAML.dump(data || {});
  return (
    <Fragment>
      <Descriptions
        title={
          <Typography.Text
            style={{fontWeight: 'bold', fontSize: '16px'}}
            copyable={{text}}
          >
            配置项
          </Typography.Text>
        }
      >
        {Object.entries(data || {}).map(([key, value]: any) => (
          <Descriptions.Item span={3} key={key} label={key}>
            <Typography.Paragraph
              style={{wordBreak: 'break-all'}}
              ellipsis={{rows: 3}}
              copyable={{text: `${key}:${value}`}}
            >
              {value}
            </Typography.Paragraph>
          </Descriptions.Item>
        ))}
      </Descriptions>
      <Divider />
      <Typography.Text
        style={{fontWeight: 'bold', fontSize: '16px'}}
        copyable={{text: yaml}}
      >
        YAML格式
      </Typography.Text>
      <SyntaxHighlighter language="yaml" style={vs}>
        {yaml}
      </SyntaxHighlighter>
    </Fragment>
  );
};

class SecretTable extends PureComponent<SecretTableProps, any> {
  columns: ColumnProps<ISecret>[] = [
    {
      title: '配置名称',
      dataIndex: 'name',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 185,
          minWidth: 126
        }
      }),
      render: (t, r) => (
        <EllipsisTooltip title={r.metadata.name}>
          {r.metadata.name}
        </EllipsisTooltip>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 185,
          minWidth: 126
        }
      }),
      render: (t, r) => <EllipsisTooltip title={t}>{t}</EllipsisTooltip>
    },
    {
      title: '配置项',
      dataIndex: 'data',
      onCell: r => {
        return {
          onClick: () => this.showDetails(r.data!),
          style: {
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            maxWidth: 400
          }
        };
      },
      render: t => (
        <div>
          <div style={{float: 'left', maxWidth: 'calc(100% - 80px'}}>
            <EllipsisTooltip title="">
              {JSON.stringify(t || {})}
            </EllipsisTooltip>
          </div>
          <span>{Object.keys(t || {}).length}项, </span>
          <a>详情</a>
        </div>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'creation_timestamp',
      width: 136,
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 136,
          minWidth: 136
        }
      }),
      render: (t, r) => (
        <Time
          format="YYYY-MM-DD  HH:mm"
          value={new Date(r.metadata.creationTimestamp)}
        />
      )
    }
  ];
  state = {
    visible: false,
    data: {}
  };
  showDetails = (data: any) => {
    this.setState({
      visible: true,
      data
    });
  };
  render() {
    const {loading, children, ...props} = this.props;
    const {visible, data} = this.state;
    return (
      <>
        <Table<ISecret>
          {...props}
          actionText="删除"
          actionType="button"
          loading={loading}
          columns={this.columns}
        >
          {children}
        </Table>

        <Drawer
          title="证书配置详情"
          width={640}
          placement="right"
          maskStyle={{backgroundColor: 'transparent'}}
          onClose={() => {
            this.setState({visible: false});
          }}
          visible={visible}
        >
          <Config data={data} />
        </Drawer>
      </>
    );
  }
}

export default SecretTable;

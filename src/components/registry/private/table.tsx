import * as React from 'react';
import { PureComponent } from 'react';
import { ColumnProps } from 'antd/lib/table';
import Time from 'react-time-format';
import { Table, EllipsisTooltip } from 'library';
import { IPrivate } from '@/models/registry/private';

export type ProjectProps = {
  data: IPrivate[];
  loading: boolean;
  actions?: React.ReactNode | (() => React.ReactNode);
}

class Project extends PureComponent<ProjectProps, any> {
  columns: ColumnProps<IPrivate>[] = [{
    title: '仓库域名',
    dataIndex: 'domain',
    onCell: () => ({
      style: {
        whiteSpace: 'nowrap',
        maxWidth: 156,
        minWidth: 82,
      }
    }),
    render: (t, r, i) => {
      return (
        <EllipsisTooltip title={t}>{t}</EllipsisTooltip>
      )
    },
  }, {
    title: '用户名',
    dataIndex: 'username',
    width: 286,
    onCell: () => ({
      style: {
        whiteSpace: 'nowrap',
        maxWidth: 286,
        minWidth: 128,
      }
    }),
    render: (t, r, i) => {
      return (
        <EllipsisTooltip title={t}>{t}</EllipsisTooltip>
      )
    },
  }, {
    title: '创建时间',
    dataIndex: 'created_at',
    width: 136,
    onCell: () => ({
      style: {
        whiteSpace: 'nowrap',
        minWidth: 78,
        maxWidth: 136,
      }
    }),
    render: (t, r, i) => <Time value={new Date(t)} format="YYYY-MM-DD  HH:mm" />,
  }];
  render() {
    const { loading, data, children, ...props } = this.props;
    return (
      <Table<IPrivate>
        {...props}
        actionText="删除"
        actionType="button"
        loading={loading}
        columns={this.columns}
        dataSource={data!.map((v: IPrivate) => ({ key: v.domain, ...v }))}
      >
        {children}
      </Table>
    )
  }
}

export default Project;
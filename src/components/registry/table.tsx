import * as React from 'react';
import { PureComponent } from 'react';
import { Icon } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { Table, EllipsisTooltip } from 'library';

interface IRepository {
  key: number;
  domain: string;
  project_public: boolean;
  pull_count: number;
  repository_id: number;
  repository_name: string;
  tags: string[];
  tags_count: number;
}

interface RepositoryTableData {
  total: number;
  list?: IRepository[];
}

export type RepositoryProps = {
  users: any[];
  data: RepositoryTableData;
  loading: boolean;
  openTags: (params: any) => void;
}

class Repositories extends PureComponent<RepositoryProps, any> {
  columns: ColumnProps<IRepository>[] = [{
    title: '镜像名称',
    dataIndex: 'repository_name',
    onCell: () => ({
      style: {
        whiteSpace: 'nowrap',
        maxWidth: 156,
        minWidth: 82,
        cursor: 'pointer',
      }
    }),
    onCellClick: (r) => this.props.openTags(r),
    render: (t, r) => <EllipsisTooltip title={t}>
      <a href="#" onClick={(e) => {
        e.preventDefault();
        this.props.openTags(r);
      }}>{t}</a>
    </EllipsisTooltip>,
  }, {
    title: '类型',
    dataIndex: 'project_public',
    onCell: () => ({
      style: {
        whiteSpace: 'nowrap',
        maxWidth: 186,
        minWidth: 116,
      }
    }),
    render: (t) => {
      const text = t === 1 ? <span><Icon type="share-alt" />公共仓库</span> : <span><Icon type="lock" />私有仓库</span>;
      return (
        <EllipsisTooltip title={t}>{text}</EllipsisTooltip>
      )
    },
  }, {
    title: 'Pull 次数',
    dataIndex: 'pull_count',
    width: 116,
    onCell: () => ({
      style: {
        whiteSpace: 'nowrap',
        maxWidth: 186,
        minWidth: 116,
      }
    }),
  }, {
    title: '标签个数',
    dataIndex: 'tags_count',
    width: 116,
    onCell: () => ({
      style: {
        whiteSpace: 'nowrap',
        maxWidth: 186,
        minWidth: 116,
      }
    }),
  }];
  render() {
    const { loading, data, children, ...props } = this.props;
    const { list, total } = data;
    return (
      <Table<IRepository>
        {...props}
        pagination={{ total: Number(total) }}
        loading={loading}
        columns={this.columns}
        dataSource={list!.map((v: IRepository) => ({ key: v.repository_id, ...v }))}
      >
        {children}
      </Table>
    )
  }
}

export default Repositories;
import * as React from 'react';
import { PureComponent } from 'react';
import { Icon } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { PaginationConfig } from 'antd/lib/pagination';
import { Table, EllipsisTooltip } from 'library';
import { IImage } from '@/models/registry/images'

interface ImagesTableData {
  total: number;
  items: IImage[];
}

export type ImagesProps = {
  data: ImagesTableData;
  loading: boolean;
  tagsRender: (record: IImage, index: number, indent: number, expanded: boolean) => React.ReactNode;
  actions: React.ReactNode | (() => React.ReactNode);
  pagination?: PaginationConfig | false;
}

class Repositories extends PureComponent<ImagesProps, any> {
  columns: ColumnProps<IImage>[] = [{
    title: '镜像名称',
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
    dataIndex: 'tag_count',
    width: 116,
    onCell: () => ({
      style: {
        whiteSpace: 'nowrap',
        maxWidth: 186,
        minWidth: 116,
      }
    }),
  }, {
    title: '类型',
    dataIndex: 'is_public',
    onCell: () => ({
      style: {
        whiteSpace: 'nowrap',
        maxWidth: 186,
        minWidth: 116,
      }
    }),
    render: (t) => {
      const text = t ? <span><Icon type="team" />公开</span> : <span><Icon type="user" />私有</span>;
      return (
        <EllipsisTooltip title={t}>{text}</EllipsisTooltip>
      )
    },
  }, {
    title: '锁定状态',
    dataIndex: 'locked',
    onCell: () => ({
      style: {
        whiteSpace: 'nowrap',
        maxWidth: 186,
        minWidth: 116,
      }
    }),
    render: (t) => {
      const text = t ? <span><Icon type="lock" />锁定</span> : <span><Icon type="unlock" />未锁定</span>;
      return (
        <EllipsisTooltip title={t}>{text}</EllipsisTooltip>
      )
    },
  }];
  render() {
    const { loading, data, tagsRender, pagination, children, ...props } = this.props;
    const { items, total } = data;
    return (
      <Table<IImage>
        {...props}
        actionFixed={false}
        pagination={{
          ...pagination,
          total: Number(total),
        }}
        loading={loading}
        columns={this.columns}
        dataSource={items.map(v => ({ key: v.name, ...v }))}
        expandedRowRender={tagsRender}
      >
        {children}
      </Table>
    )
  }
}

export default Repositories;
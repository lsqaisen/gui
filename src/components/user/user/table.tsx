import * as React from 'react';
import { PureComponent } from 'react';
import Time from 'react-time-format';
import { ColumnProps } from 'antd/lib/table';
import { Table, EllipsisTooltip } from 'library';
import { IUser } from '@/models/uesr/user';
import { Tag } from 'antd';

export type UserProps = {
  current: string;
  data: IUser[];
  loading: boolean;
  actions: React.ReactNode | (() => React.ReactNode);
}

class User extends PureComponent<UserProps, any> {
  columns: ColumnProps<IUser>[] = [
    {
      title: '帐号',
      dataIndex: 'username',
      width: 228,
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 228,
          minWidth: 128,
        }
      }),
      render: (t, r, i) => {
        return (
          <EllipsisTooltip title={t}>{t} {r.username === this.props.current && <Tag color="blue">当前</Tag>}</EllipsisTooltip>
        )
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 186,
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 186,
          minWidth: 136,
        }
      }),
      render: (t, r, i) => {
        return (
          <EllipsisTooltip title={t}>{t}</EllipsisTooltip>
        )
      },
    },
    {
      title: '权限',
      dataIndex: 'privileges',
      width: 186,
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 186,
          minWidth: 136,
        }
      }),
      render: (t, r, i) => {
        return (
          <EllipsisTooltip title={t}>{t}</EllipsisTooltip>
        )
      },
    },
    {
      title: '过期时间',
      dataIndex: 'expired_at',
      width: 136,
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          minWidth: 78,
          maxWidth: 136,
        }
      }),
      render: (t, r, i) => t ? <Time value={new Date(t)} format="YYYY-MM-DD  HH:mm" /> : '未设置',
    },
    {
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
    },
    {
      title: '备注',
      dataIndex: 'remark',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 156,
          minWidth: 156,
        }
      }),
      render: (t, r, i) => <EllipsisTooltip title={t || '--'}>{t || '--'}</EllipsisTooltip>,
    }
  ];
  render() {
    const { loading, current, data, children, ...props } = this.props;
    return (
      <Table<IUser>
        {...props}
        loading={loading}
        columns={this.columns}
        dataSource={data!.map((v: IUser) => ({ key: v.id, ...v }))}
      >
        {children}
      </Table>
    )
  }
}

export default User;


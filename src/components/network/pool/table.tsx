import * as React from 'react';
import { PureComponent } from 'react';
import Time from 'react-time-format';
import { ColumnProps } from 'antd/lib/table';
import { Table, EllipsisTooltip } from 'library';
import { INetworkPool } from '@/models/network/pool';

export type IPPoolsProps = {
	data: INetworkPool[];
	loading: boolean;
	actions?: React.ReactNode | (() => React.ReactNode);
}

class IPPools extends PureComponent<IPPoolsProps, any> {
	columns: ColumnProps<INetworkPool>[] = [{
		title: '网络名称',
		dataIndex: 'name',
		onCell: () => ({
			style: {
				whiteSpace: 'nowrap',
				minWidth: 178,
				maxWidth: 178,
			}
		}),
		render: (t, r, i) => {
			return (
				<EllipsisTooltip title={t}>{t}</EllipsisTooltip>
			)
		},
	}, {
		title: 'IP地址',
		dataIndex: 'cidr',
		onCell: () => ({
			style: {
				whiteSpace: 'nowrap',
				maxWidth: 116,
				minWidth: 116,
			}
		}),
		render: (t, r, i) => {
			return (
				<EllipsisTooltip title={t}>{t}</EllipsisTooltip>
			)
		},
	}, {
		title: '类型',
		dataIndex: 'builtin',
		onCell: () => ({
			style: {
				whiteSpace: 'nowrap',
				maxWidth: 116,
				minWidth: 116,
			}
		}),
		render: (t) => t ? '内置资源池' : '外部创建',
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
		render: (t, r, i) => t ? <Time value={new Date(t)} format="YYYY-MM-DD  HH:mm" /> : '未设置',
	}];
	render() {
		const { loading, data, actions, children, ...props } = this.props;
		return (
			<Table<INetworkPool>
				{...props}
				actionText="删除"
				actionType="button"
				loading={loading}
				columns={this.columns}
				dataSource={data.map(v => ({ key: v.name, ...v }))}
				actions={actions}
			>
				{children}
			</Table>
		)
	}
}

export default IPPools;
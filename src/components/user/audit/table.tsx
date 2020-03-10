import { PureComponent } from 'react';
import { ColumnProps, TableProps } from 'antd/lib/table';
import Time from 'react-time-format';
import { Table, EllipsisTooltip } from 'library';
import { IAudit, IAudits } from '@/models/uesr/user';


export interface AuditProps extends TableProps<IAudit> {
	type?: number,
	data: IAudits;
	loading: boolean;
	actions?: React.ReactNode | (() => React.ReactNode);
}

class Audit extends PureComponent<AuditProps, any> {
	state = {
		selectIndex: 0,
		visible: false,
	}
	columns: ColumnProps<IAudit>[] = [
		{
			title: '操作模块',
			dataIndex: 'repo_name',
			width: 126,
			onCell: () => ({
				style: {
					whiteSpace: 'nowrap',
					maxWidth: 96,
				}
			}),
			render: (t, r, i) => {
				return (
					<EllipsisTooltip title={t || '--'}>{t || '--'}</EllipsisTooltip>
				)
			},
		}, {
			title: '操作类型',
			dataIndex: 'operation',
			width: 246,
			onCell: () => ({
				style: {
					whiteSpace: 'nowrap',
					minWidth: 146,
					maxWidth: 246,
				}
			}),
			render: (t, r, i) => {
				return (
					<EllipsisTooltip title={t || '--'}>{t || '--'}</EllipsisTooltip>
				)
			},
		}, {
			title: '操作对象',
			dataIndex: 'resource',
			width: 116,
			onCell: () => ({
				style: {
					whiteSpace: 'nowrap',
					minWidth: 78,
					maxWidth: 116,
				}
			}),
			render: (t, r, i) => {
				return (
					<EllipsisTooltip title={t || '--'}>{t || '--'}</EllipsisTooltip>
				)
			},
		}, {
			title: '操作时间',
			dataIndex: 'op_time',
			width: 136,
			onCell: () => ({
				style: {
					whiteSpace: 'nowrap',
					minWidth: 78,
					maxWidth: 136,
				}
			}),
			render: (t, r, i) => <Time value={new Date(t)} format="YYYY-MM-DD  HH:mm" />,
		}, {
			title: '操作用户',
			dataIndex: 'username',
			width: 126,
			onCell: () => ({
				style: {
					whiteSpace: 'nowrap',
					minWidth: 78,
					maxWidth: 136,
				}
			}),
			render: (t, r, i) => {
				return (
					<EllipsisTooltip title={t || '--'}>{t || '--'}</EllipsisTooltip>
				)
			},
		}, {
			title: '状态码',
			dataIndex: 'status',
			width: 64,
			onCell: () => ({
				style: {
					whiteSpace: 'nowrap',
					minWidth: 64,
					maxWidth: 64,
				}
			}),
			render: (t, r, i) => {
				return (
					<span style={{
						color: String(t).startsWith('1') ||
							String(t).startsWith('2') ||
							String(t).startsWith('3') ? '#00cc00' : '#ff0000'
					}}>{t}</span>
				)
			},
		}, {
			title: '操作详情',
			dataIndex: 'keywords',
			onCell: () => ({
				style: {
					whiteSpace: 'nowrap',
					maxWidth: 96,
				}
			}),
			render: (t, r, i) => {
				return (
					<EllipsisTooltip title={t || '--'}>{t || '--'}</EllipsisTooltip>
				)
			},
		},
	];
	render() {
		const { loading, pagination, data, children, ...props } = this.props;
		const { items, total } = data;
		return (
			<Table<IAudit>
				{...props}
				actionText="详情"
				actionType="button"
				pagination={{
					...pagination,
					total: Number(total),
				}}
				loading={loading}
				columns={this.columns}
				dataSource={items!.map((v: IAudit) => ({ key: v.log_id, ...v }))}
			>
				{children}
			</Table>
		)
	}
}

export default Audit;


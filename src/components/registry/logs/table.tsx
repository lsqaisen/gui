import * as React from 'react';
import { PureComponent } from 'react';
import { ColumnProps } from 'antd/lib/table';
import Time from 'react-time-format';
import { Table, EllipsisTooltip } from 'library';
import { ILog, ILogs } from '@/models/registry/logs';
import { PaginationProps } from 'antd/lib/pagination';


export type LogsProps = {
	loading: boolean;
	data: ILogs;
	pagination?: PaginationProps | false;
}

class Logs extends PureComponent<LogsProps, any> {
	columns: ColumnProps<ILog>[] = [{
		title: '时间',
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
		title: '用户',
		dataIndex: 'username',
		width: 116,
		onCell: () => ({
			style: {
				whiteSpace: 'nowrap',
				maxWidth: 116,
				minWidth: 64,
			}
		}),
		render: (t, r, i) => {
			return (
				<EllipsisTooltip title={t}>{t}</EllipsisTooltip>
			)
		},
	}, {
		title: '操作内容',
		dataIndex: 'operation',
		onCell: () => ({
			style: {
				whiteSpace: 'nowrap',
				maxWidth: 186,
				minWidth: 116,
			}
		}),
		render: (t, r, i) => {
			return (
				<EllipsisTooltip title={t}>{t}</EllipsisTooltip>
			)
		},
	}, {
		title: '对象',
		dataIndex: 'repo_name',
		onCell: () => ({
			style: {
				whiteSpace: 'nowrap',
				maxWidth: 186,
				minWidth: 116,
			}
		}),
		render: (t, r) => {
			const text = `${t}${r.repo_tag ? `:${r.repo_tag}` : ""}`
			return (
				<EllipsisTooltip title={t}>{text}</EllipsisTooltip>
			)
		},
	}];
	render() {
		const { loading, pagination, data, children, ...props } = this.props;
		const { items, total } = data;
		return (
			<Table<ILog>
				{...props}
				pagination={{
					...pagination,
					total: Number(total),
				}}
				loading={loading}
				columns={this.columns}
				dataSource={items!.map((v: ILog) => ({ key: v.log_id, ...v }))}
			>
				{children}
			</Table>
		)
	}
}

export default Logs;
import * as React from 'react';
import { PureComponent } from 'react';
import Time from 'react-time-format';
import { ColumnProps } from 'antd/lib/table';
import { Table, EllipsisTooltip } from 'library';
import { ITag } from '@/models/registry/images';
import { Icon } from 'antd';

export type TableProps = {
	data: ITag[];
	loading: boolean;
	actions: React.ReactNode | (() => React.ReactNode);
}

class Tags extends PureComponent<TableProps, any> {
	columns: ColumnProps<ITag>[] = [{
		title: '镜像版本',
		dataIndex: 'tag',
		width: 136,
		onCell: () => ({
			style: {
				whiteSpace: 'nowrap',
				maxWidth: 136,
				minWidth: 136,
				cursor: 'pointer',
			}
		}),
		render: (t) => <EllipsisTooltip title={t}>{t}</EllipsisTooltip>,
	}, {
		title: '最近使用时间',
		dataIndex: 'updated_at',
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
		title: '镜像ID (SHA256)',
		dataIndex: 'digest',
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
		title: '大小',
		dataIndex: 'size',
		width: 86,
		onCell: () => ({
			style: {
				whiteSpace: 'nowrap',
				maxWidth: 86,
				minWidth: 86,
			}
		}),
		render: (t) => window.Number(t).flowCeil(2)
	},
		// {
		// 	title: '类型',
		// 	dataIndex: 'is_public',
		// 	width: 86,
		// 	onCell: () => ({
		// 		style: {
		// 			whiteSpace: 'nowrap',
		// 			maxWidth: 86,
		// 			minWidth: 86,
		// 		}
		// 	}),
		// 	render: (t) => {
		//     const text = t ? <span><Icon type="team" />公开</span> : <span><Icon type="user" />私有</span>;
		// 		return (
		// 			<EllipsisTooltip title={t}>{text}</EllipsisTooltip>
		// 		)
		// 	},
		// }, {
		// 	title: '锁定状态',
		// 	dataIndex: 'locked',
		// 	width: 86,
		// 	onCell: () => ({
		// 		style: {
		// 			whiteSpace: 'nowrap',
		// 			maxWidth: 86,
		// 			minWidth: 86,
		// 		}
		// 	}),
		// 	render: (t) => {
		//     const text = t ? <span><Icon type="lock" />锁定</span> : <span><Icon type="unlock" />未锁定</span>;
		// 		return (
		// 			<EllipsisTooltip title={t}>{text}</EllipsisTooltip>
		// 		)
		// 	},
		// }
	];
	render() {
		const { loading, data, children, ...props } = this.props;
		return (
			<Table<ITag>
				{...props}
				actionText="删除"
				actionType="button"
				actionFixed={false}
				style={{ marginBottom: 8, backgroundColor: 'transparent', transform: "scale(1)" }}
				pagination={false}
				loading={loading}
				columns={this.columns}
				dataSource={data!.map((v: ITag) => ({ key: v.tag, ...v }))}
			>
				{children}
			</Table>
		)
	}
}

export default Tags;
import * as React from 'react';
import { PureComponent } from 'react';
import { Icon } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import Link from 'umi/link';
import Time from 'react-time-format';
import { Table, EllipsisTooltip } from 'library';
import { INetworkVip } from '@/models/network/vip';


export type VipProps = {
	data: INetworkVip[];
	loading: boolean;
	actions: React.ReactNode | (() => React.ReactNode);
}

class Vip extends PureComponent<VipProps, any> {
	columns: ColumnProps<INetworkVip>[] = [{
		title: '名称',
		dataIndex: 'name',
		width: 186,
		onCell: () => ({
			style: {
				whiteSpace: 'nowrap',
				maxWidth: 156,
				minWidth: 82,
			}
		}),
		render: (t, r, i) => <EllipsisTooltip title={t}>{t}</EllipsisTooltip>,
	}, {
		title: '协议',
		dataIndex: 'protocol',
		width: 116,
		onCell: () => ({
			style: {
				whiteSpace: 'nowrap',
				maxWidth: 116,
				minWidth: 64,
			}
		}),
		render: (t, r, i) => <EllipsisTooltip title={t}>{t || "--"}</EllipsisTooltip>,
	}, {
		title: 'IP地址',
		dataIndex: 'addresses',
		onCell: () => ({
			style: {
				whiteSpace: 'nowrap',
				maxWidth: 116,
				minWidth: 64,
			}
		}),
		render: (t, r, i) => {
			const text = (t || []).join(';');
			return <EllipsisTooltip title={text}>{text || "--"}</EllipsisTooltip>
		},
	}];
	render() {
		const { loading, data, actions, children, ...props } = this.props;
		let dataSource: any[] = [];
		data.forEach(v => {
			dataSource = dataSource.concat(v.addresses.map((a, key) => ({ key, ...v, addresses: [a] })))
		})
		return (
			<Table<INetworkVip>
				{...props}
				actionText="删除"
				actionType="button"
				actions={actions}
				loading={loading}
				columns={this.columns}
				dataSource={dataSource}
			>
				{children}
			</Table >
		)
	}
}

export default Vip;
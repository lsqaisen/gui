import { PureComponent } from 'react';
import { ColumnProps } from 'antd/lib/table';
import { Table, EllipsisTooltip } from 'library';
import { IIngress } from '@/models/apps/ingress';
import { IngressRuleType } from 'api/type/app';
import { Typography } from 'antd';
import Link from 'umi/link';

export type IIngressProps = {
	data: IIngress[];
	loading: boolean;
	actions?: React.ReactNode | (() => React.ReactNode);
}

class Ingress extends PureComponent<IIngressProps, any> {
	columns: ColumnProps<IIngress>[] = [{
		title: '负载均衡',
		dataIndex: 'name',
		width: 186,
		onCell: () => ({
			style: {
				whiteSpace: 'nowrap',
				minWidth: 186,
				maxWidth: 186,
			}
		}),
		render: (t, r, i) => {
			return (
				<Typography.Text copyable={{ text: t }}>
					<EllipsisTooltip title={t} width="calc(100% - 22px)">
						<Link to={`/apps/ingress/${t}?ns=${r.namespace}`}>{t}</Link>
					</EllipsisTooltip>
				</Typography.Text>
			)
		},
	}, {
		title: '访问IP',
		dataIndex: 'ip',
		width: 116,
		onCell: () => ({
			style: {
				whiteSpace: 'nowrap',
				maxWidth: 116,
				minWidth: 116,
			}
		}),
		render: (t, r) => <EllipsisTooltip title={r.ip}>{r.ip}</EllipsisTooltip>,
	}, {
		title: '转发规则',
		dataIndex: 'rules',
		onCell: () => ({
			style: {
				whiteSpace: 'nowrap',
				maxWidth: 286,
				minWidth: 286,
			}
		}),
		render: (t, r, i) => {
			const text = r.rules.map((rule: IngressRuleType) => `${rule.protocol.toLocaleLowerCase()}://${rule.host || '#VIP'}:${rule.protocol.toLocaleUpperCase() === 'HTTP' ? '80' : '443'}${rule.path}->${rule.service}:${rule.port}`).join("、");
			return (
				<EllipsisTooltip title={text}>{text}</EllipsisTooltip>
			)
		},
	}, {
		title: '网络类型',
		dataIndex: 'network_type',
		width: 96,
		onCell: () => ({
			style: {
				whiteSpace: 'nowrap',
				minWidth: 78,
				maxWidth: 96,
			}
		}),
		render: (t, r, i) => `${({ public: '公网', internal: '内网' } as any)[t] || '未知'}`,
	}, {
		title: '后端服务证书',
		dataIndex: 'secret',
		onCell: () => ({
			style: {
				whiteSpace: 'nowrap',
				maxWidth: 116,
				minWidth: 116,
			}
		}),
		render: (t, r) => <EllipsisTooltip title={t}>{t || '无'}</EllipsisTooltip>
	}];
	render() {
		const { loading, data, actions, children, ...props } = this.props;
		return (
			<Table<IIngress>
				{...props}
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

export default Ingress;
import { PureComponent, cloneElement, Fragment } from 'react';
import { Icon, Button, Drawer } from 'antd';
import ModifyPasswordForm, { ModifyPasswordFormProps } from './form/modify-password-form';

export interface ModifyPasswordProps extends ModifyPasswordFormProps {
	btn?: React.ReactNode;
	submit?: (value: any) => void;
}

class ModifyPassword extends PureComponent<ModifyPasswordProps, any> {
	static readonly defaultProps = {
		submit: () => null
	};

	state = {
		loading: false,
		visible: false,
	}

	render() {
		const { username, btn, submit, ...props } = this.props;
		const { loading, visible } = this.state;
		return (
			<Fragment>
				{btn ? cloneElement(btn as any, {
					...props,
					onClick: () => { this.setState({ visible: true }) }
				}) : <Button type="primary" onClick={() => { this.setState({ visible: true }) }}>
						添加镜像仓库 <Icon type="plus" />
					</Button>}
				<Drawer
					destroyOnClose
					maskClosable={false}
					title="修改密码"
					width={482}
					placement="left"
					onClose={() => { this.setState({ visible: false }) }}
					visible={visible}
				>
					<ModifyPasswordForm ref="resetpassword" username={username} />
					<div className={"drawer-bottom-actions"} >
						<Button onClick={() => { this.setState({ visible: false }) }} style={{ marginRight: 8 }}> 取消 </Button>
						<Button loading={loading} onClick={() => {
							(this.refs.resetpassword as any).validateFields(async (error: any, values: any) => {
								if (!error) {
									this.setState({ loading: true })
									if ((await submit!(values)) as any) {
										this.setState({ loading: false })
									} else {
										this.setState({ visible: false, loading: false })
									}
								}
							})
						}} type="primary"> 提交 </Button>
					</div>
				</Drawer>
			</Fragment>
		)
	}
}

export default ModifyPassword;
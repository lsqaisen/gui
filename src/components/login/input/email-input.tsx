import { PureComponent } from 'react';
import { Input, Icon, Button } from 'antd';
import { InputProps } from 'antd/lib/input';
import { polyfill } from 'react-lifecycles-compat';
import styles from './style/index.less';

export interface EmailInputProps extends InputProps {
  sending?: boolean;
  sendCode?: (value: string | undefined) => any;
}

class EmailInput extends PureComponent<EmailInputProps, any> {
  state = {
    sending: false,
    time: 0,
  }
  waitCode = () => {
    setTimeout(() => {
      let { time } = this.state;
      time--;
      this.setState({ time });
      if (time > 0) this.waitCode();
    }, 1000)
  }

  sendCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    const { value, sendCode } = this.props;
    let error = await sendCode!(value as string);
    if (!!error) {
      this.setState({ time: 3 })
    } else {
      this.setState({ time: 60 })
    }
    this.waitCode();
  }

  render() {
    const { value, sending, ...props } = this.props;
    const { time } = this.state;
    const disabled = !value || !!time;
    return (
      <Input
        {...props}
        className={styles.email_input}
        value={value}
        prefix={<Icon type="mail" />}
        placeholder="请输入邮箱"
        addonAfter={
          <Button
            style={{ width: '102px' }}
            ghost
            type="primary"
            loading={sending}
            disabled={disabled}
            onClick={this.sendCode}
          >{sending ? '发送中' : !time ? `发送验证码` : `${time}秒`}</Button>
        }
      />
    )
  }
}

polyfill(EmailInput);

export default EmailInput;
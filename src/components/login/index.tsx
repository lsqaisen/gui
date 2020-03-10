import {PureComponent} from 'react';
import QueueAnim from 'rc-queue-anim';

export interface LoginProps {
  loginLoading?: boolean;
  resetLoading?: boolean;
  // loginProps?: LoginFormProps;
  // resetProps?: ResetPasswordProps;
}

export default class extends PureComponent<LoginProps, any> {
  state = {
    type: '',
    style: {},
    firstLogin: false,
  };
  changeIsFirstLogin = (isFirstLogin?: boolean) => {
    this.setState({
      style: !isFirstLogin
        ? {height: '328px', transition: 'height .4s'}
        : {height: '368px', transition: 'height .4s'},
    });
  };
  changeIsResetPassword = (isResetPassword?: boolean) => {
    const {type} = this.state;
    this.setState({
      style: !isResetPassword
        ? {height: '328px', transition: 'height .4s'}
        : {height: '418px', transition: 'height .4s'},
      type: type === 'reset' ? 'login' : 'reset',
    });
  };
  render() {
    return (
      <div>
        <QueueAnim
          duration={1200}
          type="scale"
          ease="easeInOutQuart"
          animConfig={[
            {
              opacity: [1, 0],
              padding: ['24px', 0],
              backgroundColor: ['#fff', '#2D225A'],
              width: ['300px', 0],
              height: ['328px', 0],
              borderRadius: ['24px', '100%'],
            },
            {
              opacity: [1, 0],
              padding: ['24px', 0],
              backgroundColor: ['#fff', '#2D225A'],
              width: ['300px', 0],
              height: ['328px', 0],
              borderRadius: ['24px', '100%'],
            },
          ]}
        >
          <div>
            {/* {type === "" || type === "login" ? (
              <Login {...loginProps} />
            ) : (
                <ResetPassword {...resetProps} />
              )
            } */}
            xxx
          </div>
        </QueueAnim>
      </div>
    );
  }
}

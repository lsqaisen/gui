import {connect} from 'dva';
import {ConfigProvider} from 'antd';
import withRouter from 'umi/withRouter';
import Context, {ContextProps} from './context';
import {Layout, Loading} from 'library';
import {AuthModelState} from '@/models/auth';
import {UserListModelState} from '@/models/uesr/user';
import {MenusModelState} from '@/models/menus';
import {ChangePasswordRequestType} from 'api/type/user';
import Sider from './sider';

const LayoutG: React.FC<any> = ({
  init,
  profile,
  menus,
  pathname = '',
  children,
  dispatch,
}) => {
  if (!!profile) {
    const loader = document.getElementById('loader');
    if (loader) loader.remove();
  }
  return children;
  const logout = () => dispatch({type: 'auth/logout'});
  const modifyPassword = (payload: ChangePasswordRequestType) =>
    dispatch({type: 'users/changePassword', payload});
  if (!init) {
    return null;
  } else {
    if (!!profile) {
      const loader = document.getElementById('loader');
      if (loader) loader.remove();
    }
    return (
      <>
        {/\/login.*/.test(pathname) ||
        /\/terminal\/.*/.test(pathname) ||
        /\/log\/.*/.test(pathname) ? (
          <div
            style={{width: '100%', height: '100%', backgroundColor: '#ecf0f6'}}
          >
            {/\/dashboard.*/.test(pathname) ? <Loading /> : children}
          </div>
        ) : (
          <Context.Provider
            value={{menus, profile, pathname, logout, modifyPassword}}
          >
            <Layout
              level={0}
              width={246}
              completed={!!profile}
              sider={<Sider />}
            >
              {children}
            </Layout>
          </Context.Provider>
        )}
      </>
    );
  }
};

export type ConnectState = {
  auth: AuthModelState;
  users: UserListModelState;
  menus: MenusModelState;
};

export default withRouter(
  connect(
    ({auth, users, menus}: ConnectState, {location: {pathname}}: any) => ({
      pathname,
      islogin: auth.success,
      init: users.init,
      profile: users.profile,
      menus: menus.data,
    })
  )((props: any) => (
    <ConfigProvider>
      <LayoutG {...props} />
    </ConfigProvider>
  ))
);

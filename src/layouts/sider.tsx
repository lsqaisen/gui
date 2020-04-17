import Context from './context';
import {Logo, Menu, User} from 'library';
import {Divider} from 'antd';
import Link from 'umi/link';
import {IUser} from '@/models/uesr/user';
import Time from 'react-time-format';

export type SiderProps = {
  onEnd?: (e: {key: string; type: string; target: HTMLElement}) => void;
};

export default ({onEnd}: SiderProps) => (
  <Context.Consumer>
    {({
      profile = {} as IUser,
      pathname,
      menus,
      logout = () => null,
      modifyPassword = () => null,
    }) => (
      <div style={{height: '100%', width: '100%'}}>
        <section style={{height: 64, padding: 8}}>
          <Logo
            iconSrc={`/dist/oem${
              process.env.NODE_ENV === 'development' ? process.env.OEM_NAME : ''
            }/icon.png`}
            logoSrc={`/dist/oem${
              process.env.NODE_ENV === 'development' ? process.env.OEM_NAME : ''
            }/logo.png`}
          />
        </section>
        <User {...{name: profile.username, logout, modifyPassword}} />
        <Divider style={{margin: 0, marginBottom: 0}} />
        <div style={{height: `calc(100% - 164px)`}}>
          <Menu
            onEnd={onEnd}
            defaultOpenKeys={pathname.split('/').map((path: any) => `/${path}`)}
            selectedKeys={pathname as any}
            data={menus.map((child: any) => {
              if (Array.isArray(child.childs) && child.childs.length > 0) {
                return {
                  type: 'subitem',
                  key: child.path,
                  component: (
                    <>
                      <i className={`icon iconfont icon-${child.key}`} />
                      <span className="name">{child.name}</span>
                    </>
                  ),
                  childs: child.childs.map((_child: any) => ({
                    type: 'item',
                    key: `${child.path}${_child.path}`,
                    component: (
                      <Link to={`${child.path}${_child.path}`}>
                        <span className="name">{_child.name}</span>
                      </Link>
                    ),
                  })),
                };
              } else {
                return {
                  type: 'item',
                  key: child.path,
                  component: (
                    <Link to={child.path}>
                      <i className={`icon iconfont icon-${child.key}`} />
                      <span className="name">{child.name}</span>
                    </Link>
                  ),
                };
              }
            })}
          />
        </div>
        <div
          style={{
            lineHeight: '32px',
            textAlign: 'center',
            borderTop: '1px solid #f8f8f8',
          }}
        >
          build
          <Time
            format="YYYY-MM-DD  HH:mm"
            value={new Date(Number(process.env.VERSION))}
          />
        </div>
      </div>
    )}
  </Context.Consumer>
);

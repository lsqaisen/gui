import * as React from 'react';
import {PageHeader} from 'antd';
import {PageHeaderProps} from 'antd/lib/page-header';
import Header from './header';
import styles from './style/index.less';

export interface PageProps extends PageHeaderProps {
  link?: React.ReactNode;
  routes?: any[];
}

class Page extends React.PureComponent<PageProps, any> {
  static Header: typeof Header;
  static readonly defaultProps = {
    routes: [
      {
        path: '/dashboard',
        breadcrumbName: '总览'
      }
    ]
  };

  render() {
    const {link, className, routes, children, ...props} = this.props;
    const Link = ({route}: any) => {
      return link ? (
        React.cloneElement(link as any, {
          href: route.path,
          to: route.path,
          children: route.breadcrumbName
        })
      ) : (
        <span>{route.breadcrumbName}</span>
      );
    };
    return (
      <PageHeader
        {...props}
        className={`${className || ''} ${styles.page || ''}`}
        breadcrumb={{
          routes,
          itemRender(route, _, routes) {
            const last = routes.indexOf(route) === routes.length - 1;
            return last ? (
              <span>{route.breadcrumbName}</span>
            ) : (
              <Link route={route} />
            );
          }
        }}
      >
        {children}
      </PageHeader>
    );
  }
}

Page.Header = Header;

export default Page;

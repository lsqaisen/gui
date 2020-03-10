import { useState, cloneElement } from 'react';
import { Layout } from 'antd';
import Media from 'react-media';
import Loading from '../loading/';
import Sider from './sider';
import styles from './style/index.less';

const backgroundColors = ["#ecf0f6", "#f2f7fb"];
export interface LayoutProps {
  level: number;
  completed: boolean;
  width: number | string;
  sider?: React.ReactNode;
}

const LibLayout: React.SFC<LayoutProps> = ({ completed, level, width = "210px", sider, children }) => {
  const [init, setInit] = useState(false);
  const [show, setShow] = useState(false);
  if (completed) { setTimeout(() => setInit(true), 600) };
  return (
    <Media
      queries={{
        mobile: "(max-width: 768px)",
        pc: "(min-width: 769px)"
      }}
    >
      {matches => (
        <>
          {matches.pc && (
            <Layout className={styles.layout}>
              <Layout.Sider style={{ backgroundColor: backgroundColors[level] }} width={!init ? '100%' : width} >
                <Loading loading={!init}>
                  {sider ? cloneElement(sider as any, { onEnd: () => setShow(true) }) : null}
                </Loading>
              </Layout.Sider>
              <Layout.Content style={{ position: 'relative', minHeight: "100%" }}>
                <Loading loading={!show}>
                  {children}
                </Loading>
              </Layout.Content>
            </Layout>
          )}
          {matches.mobile && (
            <>
              <Sider>{sider ? cloneElement(sider as any, { onEnd: () => setShow(true) }) : null}</Sider>
              <Loading loading={!show}>
                {children}
              </Loading>
            </>
          )}
        </>
      )}
    </Media>
  )
}

export default LibLayout;
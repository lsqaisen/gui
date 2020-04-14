import {useState, useEffect} from 'react';
import {Drawer, Button, Tooltip} from 'antd';
import {SyncOutlined} from '@ant-design/icons';
import {Terminal, Loading} from 'library';
import styles from './style/index.less';
import {DrawerProps} from 'antd/lib/drawer';

const ishttps = 'https:' == document.location.protocol ? true : false;

export interface InstallProps extends DrawerProps {
  onFullScreen: (fullscreen: boolean, term: Terminal) => void;
}

const Install = ({onFullScreen, ...props}: InstallProps) => {
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [fullscreen, setFullScreen] = useState(false);
  const [term, setTerm] = useState();
  useEffect(() => {
    visible && onFullScreen(fullscreen, term!);
  }, [fullscreen]);
  return (
    <>
      <Button
        style={{cursor: 'pointer', padding: 0}}
        type="link"
        onClick={() => setVisible(true)}
      >
        <SyncOutlined style={{margin: 0}} spin />
        正在安装
      </Button>
      <Drawer
        {...props}
        className={`${styles.logs} ${fullscreen && styles.fullscreen}`}
        destroyOnClose
        visible={visible}
        placement="bottom"
        title={
          <>
            <Button
              type="link"
              icon={!fullscreen ? 'fullscreen' : 'fullscreen-exit'}
              onClick={() => {
                setFullScreen!(!fullscreen);
              }}
            />
            <Tooltip title="在新标签中显示">
              <Button
                type="link"
                icon="block"
                onClick={() => {
                  window.open('/#/log/install');
                  setVisible(false);
                }}
              />
            </Tooltip>
            安装详情
          </>
        }
        height={503}
        onClose={() => setVisible(false)}
        bodyStyle={{padding: 0, position: 'relative', height: 480}}
        afterVisibleChange={setShow}
      >
        <Loading loading={!show}>
          <Terminal
            ref={ref => !!ref && setTerm(ref as any)}
            splitWrite={true}
            bidirectional={false}
            buffered={true}
            beforeSendData={['hello word']}
            url={`${ishttps ? 'wss' : 'ws'}://${
              window.location.host.includes('localhost')
                ? `localhost:${ishttps ? '6600' : '6601'}`
                : window.location.host
            }/api/cluster/logs/install`}
          />
        </Loading>
      </Drawer>
    </>
  );
};

export default Install;

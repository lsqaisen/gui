import { useState } from 'react';
import { Menu, Select, Drawer, Icon, Modal, Button, Typography, Tooltip } from 'antd';
import QueueAnim from 'rc-queue-anim';
import ScrollBar from 'react-perfect-scrollbar';
import AddNamespace from './add-namespace';
import styles from './style/index.less';
import Media from 'react-media';

const { ItemGroup } = Menu;

export type NamespacesProps = {
  loading: boolean;
  nslist: any[];
  current?: string;
  getNSs?: () => void;
  addNS?: (value: any) => void;
  deleteNS?: (ns: string) => void;
  onChange?: (ns: string) => void;
}

const Namespaces = ({ loading, current, nslist, getNSs, deleteNS, addNS, onChange }: NamespacesProps) => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Media
        queries={{
          mobile: "(max-width: 599px)",
          pc: "(min-width: 599px)"
        }}
      >
        {({ mobile }) => (
          <div style={{ display: 'inline-block', marginBottom: mobile ? 8 : 0, width: mobile ? '100%' : "none" }}>
            <Select className="fl" style={{ width: mobile ? 'calc(100% - 72px)' : 180, height: 32, marginRight: 8 }} value={current} onChange={onChange}>
              {nslist.map(ns => (<Select.Option key={ns.metadata.name} value={ns.metadata.name}>{ns.metadata.name}</Select.Option>))}
            </Select>
            <Button.Group>
              <Button className="fl" icon="setting" onClick={() => setVisible(true)} />
              <Button className="fl" icon="reload" loading={loading} onClick={getNSs} />
            </Button.Group>
          </div>
        )}
      </Media>
      <Drawer
        bodyStyle={{ padding: 0, height: 'calc(100% - 66px)', overflow: 'auto' }}
        title={<AddNamespace onSubmit={addNS!} />}
        destroyOnClose
        width={256}
        maskStyle={{ backgroundColor: 'transparent' }}
        placement="right"
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <div className={styles.menu_box}>
          {/* <div className={styles.add_stack}>
            <AddNamespace onSubmit={addNS!} />
          </div> */}
          <Menu>
            <ItemGroup title="命名空间列表" />
          </Menu>
          <div style={{ height: 'calc(100% - 38px)', overflow: 'auto' }}>
            <ScrollBar
              style={{ height: '100%' }}
              options={{
                suppressScrollX: true,
              }}
            >
              <QueueAnim
                component={Menu}
                componentProps={{
                  mode: "inline",
                  style: { height: '100%' },
                  selectedKeys: [current],
                  onClick: (e: any) => onChange!(e.key)
                }}
                animConfig={[
                  { opacity: [1, 0], translateX: [0, -250] },
                  { opacity: [1, 0], translateX: [0, 250] },
                ]}
              >
                {nslist.map((v: any) => (
                  <Menu.Item key={v.metadata.name}>
                    <Typography.Text copyable>{v.metadata.name}</Typography.Text>
                    <Tooltip title="删除">
                      <a
                        href="#"
                        style={{ position: 'absolute', top: 0, right: 0 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          Modal.confirm({
                            title: `确认是否需要删除命名空间${v.metadata.name}?`,
                            content: v.desc,
                            okText: '确认',
                            okType: 'danger',
                            cancelText: '取消',
                            onOk() {
                              return new Promise(async (resolve, reject) => {
                                const error: any = await deleteNS!(v.metadata.name);
                                if (!error) {
                                  resolve()
                                } else {
                                  reject(error)
                                }
                              })
                            },
                          })
                        }}>
                        <Icon type="close" />
                      </a>
                    </Tooltip>
                  </Menu.Item>
                ))}
              </QueueAnim>
            </ScrollBar>
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default Namespaces;
import {Modal, Select, Divider, Tooltip} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import Media from 'react-media';

export type NamespaceProps<INS = any> = {
  data: INS[];
  current?: string;
  actions?: React.ReactNode[];
  onLoad?: () => void;
  onChange?: (ns: string) => void;
  onDelete?: (ns: string) => void;
  children?: React.ReactNode;
};

const Namespace = <INS extends any>({
  current,
  data,
  actions = [],
  children,
  onChange,
  onDelete,
}: NamespaceProps<INS>) => {
  return (
    <Media
      queries={{
        mobile: '(max-width: 599px)',
        pc: '(min-width: 599px)',
      }}
    >
      {({mobile}) => (
        <div
          style={{
            display: 'inline-block',
            marginBottom: mobile ? 8 : 0,
            width: mobile ? '100%' : 'none',
          }}
        >
          <Select
            className="fl"
            style={{
              width: mobile ? 'calc(100% - 72px)' : 180,
              height: 32,
              marginRight: 8,
            }}
            value={current}
            onChange={onChange}
            optionLabelProp="value"
            dropdownRender={(menu) => (
              <div>
                <div style={{padding: '4px 8px'}}>{children}</div>
                <Divider style={{margin: '4px 0'}} />
                {menu}
              </div>
            )}
          >
            {data.map((ns) => (
              <Select.Option
                key={ns.metadata.name}
                title={ns.metadata.name}
                value={ns.metadata.name}
              >
                <div style={{position: 'relative'}}>
                  {ns.metadata.name}
                  <Tooltip title="删除">
                    <a
                      href="#"
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        cursor: 'pointer',
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        Modal.confirm({
                          title: `确认是否需要删除命名空间${ns.metadata.name}?`,
                          content: ns.desc,
                          okText: '确认',
                          okType: 'danger',
                          cancelText: '取消',
                          onOk() {
                            return new Promise(async (resolve, reject) => {
                              const error: any = await onDelete!(
                                ns.metadata.name
                              );
                              if (!error) {
                                resolve();
                              } else {
                                reject(error);
                              }
                            });
                          },
                        });
                      }}
                    >
                      <DeleteOutlined />
                    </a>
                  </Tooltip>
                </div>
              </Select.Option>
            ))}
          </Select>
          <section className="fl">{actions}</section>
        </div>
      )}
    </Media>
  );
};

export default Namespace;

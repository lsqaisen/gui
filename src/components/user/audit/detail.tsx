import { PureComponent } from 'react';
import { Drawer, Descriptions } from 'antd';
import ReactJson from 'react-json-view';
import Time from 'react-time-format';

enum types {
  操作模块 = "module",
  操作类型 = "type",
  操作对象 = "object",
  操作时间 = "createTime",
  操作者 = "userName",
  操作空间 = "namespace",
  状态码 = "httpCode",
  操作详情 = "desc",
  请求路径 = "reqURL",
  请求体 = "reqBody",
  响应体 = "respBody",
}

export interface DetailProps {
  audit?: any;
  visible?: boolean;
  onClose?: () => void;
}

class Detail extends PureComponent<DetailProps, any> {
  static readonly defaultProps = {
    audit: new Object(null),
  };

  render() {
    const { visible, audit, onClose } = this.props;
    return (
      <Drawer
        title="操作详情"
        width={482}
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <Descriptions>
          {Object.entries(types).map(([key, value]) => {
            if (value !== 'reqBody' && value !== 'respBody' && value !== 'createTime') {
              return <Descriptions.Item key={value} span={24} label={key}>{audit![value]}</Descriptions.Item>
            } else if (value === 'createTime') {
              return <Descriptions.Item key={value} span={24} label={key}>
                <Time value={audit![value]} format="YYYY-MM-DD  HH:mm" />
              </Descriptions.Item>
            } else {
              return (
                <Descriptions.Item key={value} span={24} label={key}>
                  <div>
                    <ReactJson
                      name={false}
                      src={!!audit![value] && JSON.parse(audit![value])}
                      theme="google"
                      iconStyle="square"
                      collapsed={2}
                      displayDataTypes={false}
                      enableClipboard={false}
                    />
                  </div>
                </Descriptions.Item>
              )
            }
          })}
        </Descriptions>
      </Drawer>
    )
  }
}

export default Detail;
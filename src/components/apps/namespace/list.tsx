import * as React from 'react';
import {Modal, List, Typography, Tooltip, Skeleton} from 'antd';
import {CloseOutlined} from '@ant-design/icons';

export interface INsList<INS = any> {
  loading: boolean;
  data: INS[];
  onDelete?: (ns: string) => void;
}

const NsList = <INS extends any>({loading, data, onDelete}: INsList<INS>) => {
  return (
    <List
      loading={loading}
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item
          key={item.metadata.name}
          style={{padding: '12px 0 12px 24px'}}
        >
          <Typography style={{position: 'relative'}}>
            <Typography.Text copyable>{item.metadata.name}</Typography.Text>
            <Tooltip title="删除">
              <a
                href="#"
                style={{position: 'absolute', top: 0, right: -20}}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  Modal.confirm({
                    title: `确认是否需要删除命名空间${item.metadata.name}?`,
                    content: item.desc,
                    okText: '确认',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk() {
                      return new Promise(async (resolve, reject) => {
                        const error: any = await onDelete!(item.metadata.name);
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
                <CloseOutlined />
              </a>
            </Tooltip>
          </Typography>
        </List.Item>
      )}
    />
  );
};

export default NsList;

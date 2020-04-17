import {Tabs, Badge, Icon} from 'antd';
import {IApp} from '@/models/apps/apps';
import Instances from './instances';
import Versions from './versions';
import Events from './events';
import Yaml from './yaml';
import Metric from './metric';
import {useState, useEffect} from 'react';

export interface ContentProps {
  loading: boolean;
  app: IApp;
}

const Content = ({loading, app}: ContentProps) => {
  const [key, setKey] = useState('instances');
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (key === 'events') setCount(0);
  }, [key]);
  return (
    <Tabs defaultActiveKey={key} onChange={setKey}>
      <Tabs.TabPane key="instances" tab="实例列表">
        <Instances
          loading={loading!}
          ns={app.namespace}
          type={app.type}
          name={app.name}
          data={app.instances || []}
          actions={<a>重建</a>}
        />
      </Tabs.TabPane>
      <Tabs.TabPane key="versions" tab="版本信息">
        <Versions type={app.type} name={app.name} namespace={app.namespace} />
      </Tabs.TabPane>
      <Tabs.TabPane
        key="events"
        tab={
          <Badge count={count} dot>
            <Icon type="notification" />
            事件列表
          </Badge>
        }
      >
        <Events
          current={key === 'events'}
          type={app.type}
          name={app.name}
          namespace={app.namespace}
          onError={(count: number) => {
            console.log(count);
            if (key !== 'events') setCount(count);
          }}
        />
      </Tabs.TabPane>
      <Tabs.TabPane key="yaml" tab="YAML信息">
        <Yaml type={app.type} name={app.name} namespace={app.namespace} />
      </Tabs.TabPane>
      <Tabs.TabPane key="3" tab="监控信息">
        <Metric type={app.type} name={app.name} namespace={app.namespace} />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default Content;

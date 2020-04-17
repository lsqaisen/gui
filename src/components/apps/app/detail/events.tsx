import {Typography, List, Badge} from 'antd';
import Time from 'react-time-format';
import {IEvent} from '@/models/apps/apps';

export interface EventsProps {
  data: IEvent[];
}

const Events = ({data}: EventsProps) => {
  return (
    <List
      dataSource={data
        .sort(
          (a, b) =>
            new Date(b.lastTimestamp).getTime() -
            new Date(a.lastTimestamp).getTime()
        )
        .map((v) => ({key: v.metadata.name, ...v}))}
      renderItem={(v) => {
        return (
          <List.Item
            actions={[
              <Time
                format="YYYY-MM-DD  HH:mm"
                value={new Date(v.lastTimestamp)}
              />,
              <Badge
                overflowCount={999}
                count={v.count}
                style={{backgroundColor: v.type === 'Normal' ? '#286cff' : ''}}
              />,
            ]}
          >
            <Typography.Text type={v.type.toLocaleLowerCase() as any}>
              [{v.type}]
            </Typography.Text>
            {v.message}
          </List.Item>
        );
      }}
    />
  );
};

export default Events;

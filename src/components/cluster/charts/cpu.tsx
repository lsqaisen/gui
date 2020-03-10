import { useState } from 'react';
import { Row, Col, Statistic, PageHeader } from 'antd';
import { Charts } from 'library';
import { SimpleProps } from 'library/type/charts/simple';
import { useInterval } from '@/utils';

const Chart = Charts.Simple;

export interface CPUProps extends SimpleProps {
  extra?: boolean;
  step?: number;
  delay?: number;
  total: number;
  used: number;
}

const CPU = ({ step = 60, delay = 1000, total, used, extra }: CPUProps) => {
  const [data, updateData] = useState(() => {
    const time = new Date().getTime();
    return [...new Array(step)].map((_, i) => ({ title: 'CPU', value: undefined, time: time - ((step - i) * 1000) }))
  });
  useInterval(() => {
    let _data: any[] = [...data];
    _data.push({
      title: 'CPU',
      value: used / total * 100,
      time: new Date(),
    })
    if (_data.length >= step) {
      _data.shift();
    }
    updateData(_data);
  }, delay)
  return (
    <PageHeader style={{ padding: 0 }} title="CPU" subTitle="使用量/总核数" extra={extra ? <Statistic suffix={` / ${total}核`} value={used} /> : null}>
      <Row gutter={24}>
        {!extra && <Col span={24} style={{ paddingBottom: 16 }}>
          <Statistic suffix={` / ${total}核`} value={used} />
        </Col>}
        <Col span={24}>
          <Chart line type="area" max={100} height={248} data={data} timeMask='HH:mm:ss' />
        </Col>
      </Row>
    </PageHeader>
  )
}


export default CPU;
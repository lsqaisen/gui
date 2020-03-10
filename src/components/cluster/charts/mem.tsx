import { useState } from 'react';
import { Row, Col, Statistic, PageHeader } from 'antd';
import { Charts } from 'library';
import { SimpleProps } from 'library/type/charts/simple';
import { useInterval } from '@/utils';

const Chart = Charts.Simple;

export interface MemoryProps extends SimpleProps {
  extra?: boolean;
  step?: number;
  delay?: number;
  total: number;
  used: number;
}

const Memory = ({ step = 60, delay = 1000, total, used, extra }: MemoryProps) => {
  const [data, updateData] = useState(() => {
    const time = new Date().getTime();
    return [...new Array(step)].map((_, i) => ({ title: '内存', value: undefined, time: time - ((step - i) * 1000) }))
  });
  useInterval(() => {
    let _data: any[] = [...data];
    _data.push({
      title: '内存',
      value: used / total * 100,
      time: new Date().getTime(),
    })
    if (_data.length >= step) {
      _data.shift();
    }
    updateData(_data);
  }, delay)
  return (
    <PageHeader style={{ padding: 0 }} title="内存" subTitle="使用量/总内存" extra={extra ? <Statistic suffix={` / ${window.Number(total).flowCeil(0)}`} value={window.Number(used).flowCeil(4)} /> : null}>
      <Row gutter={24}>
        {!extra && <Col span={24} style={{ paddingBottom: 16 }}>
          <Statistic suffix={` / ${window.Number(total).flowCeil(0)}`} value={window.Number(used).flowCeil(4)} />
        </Col>}
        <Col span={24}>
          <Chart line type="area" max={100} height={248} data={data} timeMask='HH:mm:ss' />
        </Col>
      </Row>
    </PageHeader>
  )
}


export default Memory;
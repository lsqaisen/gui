import {Skeleton, Col, Row, Select, PageHeader} from 'antd';
import {ConnectLoading, Dispatch} from '@/models/connect';
import {connect} from 'dva';
import {useEffect, useState} from 'react';
import * as G2 from '@antv/g2';
import {Charts} from 'library';
import {AppsModelState, IApp, IService} from '@/models/apps/apps';
import {NamespaceModelState, INs} from '@/models/apps/namespace';

const Chart = Charts.Basic;

export interface NamespacesProps {
  loading: boolean;
  nslist: INs[];
  apps: {[key: string]: IApp[]};
  services: {[key: string]: IService[]};
  dispatch: Dispatch<any>;
}

export interface AppsMetricsProps extends NamespacesProps {
  names: string[];
}

const AppsMetrics = ({data}: any) => {
  let chart: G2.Chart;
  useEffect(() => {
    chart && chart.changeData(data);
  }, [JSON.stringify(data)]);
  return (
    <Chart
      height={240}
      ref={(ref: any) => ref && (chart = ref.chart)}
      onDraw={(chart: G2.Chart) => {
        chart.source(data);

        chart
          .interval()
          .position('namespace*total')
          .color('type')
          .adjust([
            {
              type: 'dodge',
              marginRatio: 1 / 32
            }
          ]);
      }}
    />
  );
};

const Namespaces = ({
  loading,
  apps,
  services,
  nslist,
  dispatch
}: NamespacesProps) => {
  const [names, setNs] = useState([]);
  const getNSs = () =>
    dispatch({type: 'namespace/get'}).then((data: any) => {
      names.length <= 0 &&
        data.items.length > 0 &&
        setNs(data.items.map((v: INs) => v.metadata.name));
    });
  const getServices = (ns: string) =>
    dispatch({type: 'apps/services', payload: ns});
  const getApps = (ns: string) => dispatch({type: 'apps/get', payload: ns});
  useEffect(() => {
    getNSs();
  }, []);
  useEffect(() => {
    names.forEach(ns => {
      getServices(ns);
      getApps(ns);
    });
  }, [names]);
  let data: any[] = [] as any[];
  names.forEach(namespace => {
    data.push({
      namespace,
      type: '应用',
      total: (apps[namespace] || []).length
    });
    data.push({
      namespace,
      type: '服务',
      total: (services[namespace] || []).length
    });
  });
  return (
    <section className="box" style={{marginBottom: '24px'}}>
      <Skeleton loading={loading}>
        <PageHeader title="工作空间资源" style={{padding: 16}}>
          <Row>
            <Col span={24}>
              <Select
                mode="multiple"
                style={{width: '100%'}}
                value={names}
                onChange={setNs}
              >
                {nslist.map(v => (
                  <Select.Option key={v.metadata.name} value={v.metadata.name}>
                    {v.metadata.name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={24}>
              <AppsMetrics data={data} />
            </Col>
          </Row>
        </PageHeader>
      </Skeleton>
    </section>
  );
};

export type ConnectState = {
  apps: AppsModelState;
  namespace: NamespaceModelState;
  loading: ConnectLoading;
};
export default connect(({apps, namespace, loading}: ConnectState) => ({
  nslist: namespace.nslist.items,
  apps: apps.data,
  services: apps.services,
  loading: loading.effects['namespace/get']
}))(Namespaces);

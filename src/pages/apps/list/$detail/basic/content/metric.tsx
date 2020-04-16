import {useEffect, useState} from 'react';
import Table, {
  MetricsProps as Props
} from '@/components/apps/app/detail/metric';
import {Dispatch} from '@/models/connect';
import {Loading} from 'library';
import Wapper, {WapperProps} from './wapper';
import {useInterval} from '@/utils';
import {Empty} from 'antd';

export interface MetricsProps extends Props, WapperProps {
  current: boolean;
  onError: (count: number) => void;
  dispatch: Dispatch<any>;
}

const Metrics = Wapper((namespace, name, apps) => ({
  data: apps.metrics[`${name}${namespace}`]
}))<MetricsProps>(
  ({
    current,
    type,
    name,
    namespace,
    data,
    dispatch,
    onError,
    ...props
  }: MetricsProps) => {
    const getMetrics = () =>
      dispatch({type: 'apps/metrics', payload: {name, namespace, type}});
    useEffect(() => {
      getMetrics();
    }, [type, name, namespace]);
    console.log(data);
    return (
      <section style={{height: !data ? 160 : 'auto', padding: '24px 0'}}>
        <Loading loading={!data}>
          <Empty description="开发中....." />
        </Loading>
      </section>
    );
  }
);

export default Metrics;

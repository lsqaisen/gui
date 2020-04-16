import {useEffect, useState} from 'react';
import Table, {EventsProps as Props} from '@/components/apps/app/detail/events';
import {Dispatch} from '@/models/connect';
import {Loading} from 'library';
import Wapper, {WapperProps} from './wapper';
import {useInterval} from '@/utils';

export interface EventsProps extends Props, WapperProps {
  current: boolean;
  onError: (count: number) => void;
  dispatch: Dispatch<any>;
}

const Events = Wapper((namespace, name, apps) => ({
  data: apps.events[`${name}${namespace}`]
}))<EventsProps>(
  ({
    current,
    type,
    name,
    namespace,
    data,
    dispatch,
    onError,
    ...props
  }: EventsProps) => {
    const getEvents = () =>
      dispatch({type: 'apps/events', payload: {name, namespace, type}});
    useEffect(() => {
      getEvents();
    }, [type, name, namespace]);
    useInterval(getEvents, 5000);
    return (
      <section style={{height: !data ? 160 : 'auto', padding: '24px 0'}}>
        <Loading loading={!data}>
          <Table {...props} data={data} />
        </Loading>
      </section>
    );
  }
);

export default Events;

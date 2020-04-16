import {useEffect} from 'react';
import Table, {
  VersionsProps as Props
} from '@/components/apps/app/detail/versions';
import {Dispatch} from '@/models/connect';
import {Loading} from 'library';
import Wapper, {WapperProps} from './wapper';

export interface VersionsProps extends Props, WapperProps {
  dispatch: Dispatch<any>;
}

const Versions = Wapper((namespace, name, apps) => ({
  data: apps.versions[`${name}${namespace}`]
}))<VersionsProps>(({type, name, namespace, data, dispatch, ...props}) => {
  const getVersions = () =>
    dispatch({type: 'apps/versions', payload: {name, namespace, type}});
  useEffect(() => {
    getVersions();
  }, [type, name, namespace]);
  return (
    <section style={{height: !data ? 160 : 'auto', padding: '24px 0'}}>
      <Loading loading={!data}>
        <Table {...props} data={data} />
      </Loading>
    </section>
  );
});

export default Versions;

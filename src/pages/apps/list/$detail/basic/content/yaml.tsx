import {useEffect} from 'react';
import YAML, {YamlProps as Props} from '@/components/apps/app/detail/yaml';
import {Dispatch} from '@/models/connect';
import {Loading} from 'library';
import Wapper, {WapperProps} from './wapper';

export interface YamlProps extends Props, WapperProps {
  dispatch: Dispatch<any>;
}

const Yaml = Wapper((namespace, name, apps) => ({
  yaml: apps.yamls[`${name}${namespace}`]
}))<YamlProps>(
  ({type, name, namespace, yaml, dispatch, ...props}: YamlProps) => {
    const getYaml = () =>
      dispatch({type: 'apps/export', payload: {name, namespace, type}});
    useEffect(() => {
      getYaml();
    }, [type, namespace]);
    return (
      <section
        style={{height: yaml === undefined ? 160 : 'auto', padding: '24px 0'}}
      >
        <Loading loading={yaml === undefined}>
          <YAML {...props} yaml={yaml} />
        </Loading>
      </section>
    );
  }
);

export default Yaml;

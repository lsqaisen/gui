import {connect} from 'dva';
import {PageProps} from 'library/type/page';
import {Dispatch, ConnectLoading} from '@/models/connect';
import Detail from '@/components/apps/nlb/detail';
import {NlbModelState, INlb} from '@/models/apps/nlb';
import {Loading} from 'library';
import {useEffect} from 'react';

interface AppDetailProps extends PageProps {
  loading: boolean;
  name: string;
  namespace: string;
  nlb: INlb;
  dispatch: Dispatch<any>;
}

const AppDetail = ({
  loading,
  name,
  namespace,
  nlb,
  dispatch
}: AppDetailProps) => {
  const getIngresses = () => dispatch({type: 'nlb/get', payload: namespace});
  useEffect(() => {
    getIngresses();
  }, [namespace, name]);
  return (
    <Loading loading={!nlb}>
      <div style={{padding: 24}}>
        <Detail loading={loading} nlb={nlb} getDetail={getIngresses} />
      </div>
    </Loading>
  );
};

export type ConnectState = {
  nlb: NlbModelState;
  loading: ConnectLoading;
};

export default connect(
  (
    {nlb, loading}: ConnectState,
    {
      location: {
        query: {ns}
      },
      match: {
        params: {detail}
      }
    }: any
  ) => {
    return {
      name: detail,
      namespace: ns,
      nlb: (nlb.data[ns] || []).find(v => v.name === detail),
      loading: loading.effects['nlb/get']
    };
  }
)(AppDetail);

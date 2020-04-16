import {useEffect} from 'react';
import {connect} from 'dva';
import {Dispatch} from '@/models/connect';
import Context from '@/components/apps/nlb/context';
import {NlbRequest} from 'api/type/app';

export interface LayoutProps {
  ns: string;
  dispatch: Dispatch<any>;
}

const Layout: React.FC<LayoutProps> = ({ns, dispatch, children}) => {
  const getNlbList = () => dispatch({type: 'nlb/get', payload: ns});
  const getApps = () => dispatch({type: 'apps/get', payload: ns});
  const getServices = () => dispatch({type: 'apps/services', payload: ns});
  const createNlb = (payload: NlbRequest) =>
    dispatch({type: 'nlb/create', payload});
  useEffect(() => {
    !!ns && getNlbList();
  }, [ns]);
  return (
    <Context.Provider value={{namespace: ns, createNlb, getApps, getServices}}>
      {children}
    </Context.Provider>
  );
};

export default connect((_: any, {location: {query: {ns}}}: any) => ({ns}))(
  Layout
);

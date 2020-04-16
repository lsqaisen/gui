import {useEffect} from 'react';
import {connect} from 'dva';
import {Dispatch} from '@/models/connect';
import Context from '@/components/apps/ingress/context';
import {IngressRequest, ModifyIngressRulesType} from 'api/type/app';

export interface LayoutProps {
  ns: string;
  dispatch: Dispatch<any>;
}

const Layout: React.FC<LayoutProps> = ({ns, dispatch, children}) => {
  const getIngresss = () => dispatch({type: 'ingress/get', payload: ns});
  const getSecrets = () => dispatch({type: 'secret/get', payload: ns});
  const getServices = () => dispatch({type: 'apps/services', payload: ns});
  const createIngress = (payload: IngressRequest) =>
    dispatch({type: 'ingress/create', payload});
  const editIngressRules = (payload: ModifyIngressRulesType) =>
    dispatch({type: 'ingress/modify', payload});
  useEffect(() => {
    !!ns && getIngresss();
  }, [ns]);
  return (
    <Context.Provider
      value={{
        namespace: ns,
        createIngress,
        getSecrets,
        getServices,
        editIngressRules
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default connect((_: any, {location: {query: {ns}}}: any) => ({ns}))(
  Layout
);

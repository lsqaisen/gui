import {connect} from 'dva';
import {ContainersInput} from '@/components/apps/app/inputs/';

const EnvsInput = ({ns, dispatch, ...props}: any) => {
  const getConfigMaps = () => dispatch({type: 'configmap/get', payload: ns});
  const getSecrets = () => dispatch({type: 'secret/get', payload: ns});
  return (
    <ContainersInput.EnvKeyRef
      {...props}
      getConfigMaps={getConfigMaps}
      getSecrets={getSecrets}
    />
  );
};

export default connect(() => ({}))(EnvsInput);

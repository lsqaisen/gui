import {connect} from 'dva';
import {VolumesInput} from '@/components/apps/app/inputs/';
import {VolumesInputProps} from '@/components/apps/app/inputs/volumes-input/volumes';
import {Dispatch} from '@/models/connect';
import AddConfigMap from '@/pages/apps/configmap/basic/actions/create';

interface VolumesProps extends VolumesInputProps {
  ns: string;
  dispatch: Dispatch<any>;
}

const Volumes = ({ns, dispatch, ...props}: VolumesProps) => {
  const getConfigMaps = () => dispatch({type: 'configmap/get', payload: ns});
  const getSecrets = () => dispatch({type: 'secret/get', payload: ns});
  return (
    <VolumesInput {...props}>
      {(type) => {
        switch (type) {
          case 'secret':
            return (
              <VolumesInput.Secret getSecrets={getSecrets}>
                <AddConfigMap btnText="添加" />
              </VolumesInput.Secret>
            );
          case 'conf':
            return (
              <VolumesInput.ConfigMap getConfigMaps={getConfigMaps}>
                <AddConfigMap btnText="添加" />
              </VolumesInput.ConfigMap>
            );
          case 'host':
          default:
            return <VolumesInput.HostPath />;
        }
      }}
    </VolumesInput>
  );
};

export default connect(() => ({}))(Volumes);

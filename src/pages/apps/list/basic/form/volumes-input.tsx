import {connect} from 'dva';
import {VolumesInput} from '@/components/apps/app/actions/app-form/';
import {VolumesInputProps} from '@/components/apps/app/actions/app-form/volumes-input/volumes-input';
import {Dispatch} from '@/models/connect';
import AddConfigMap from '@/pages/apps/configmap/basic/actions/create';

interface VolumesProps extends VolumesInputProps {
  ns: string;
  dispatch: Dispatch<any>;
}

const Volumes = ({ns, dispatch, ...props}: VolumesProps) => {
  const getConfigMaps = () => dispatch({type: 'configmap/get', payload: ns});
  return (
    <VolumesInput {...props}>
      {(type) => {
        switch (type) {
          case 'secret':
          case 'conf':
            return (
              <VolumesInput.ConfigMapInput getConfigMaps={getConfigMaps}>
                <AddConfigMap btnText="添加" />
              </VolumesInput.ConfigMapInput>
            );
          case 'host':
          default:
            return <VolumesInput.HostPathInput />;
        }
      }}
    </VolumesInput>
  );
};

export default connect(() => ({}))(Volumes);

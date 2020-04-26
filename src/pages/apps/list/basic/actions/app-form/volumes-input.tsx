import {connect} from 'dva';
import {
  VolumesInput,
  VolumesInputProps,
} from '@/components/apps/app/actions/app-form/';
import {Dispatch} from '@/models/connect';

interface VolumesProps extends VolumesInputProps {
  dispatch: Dispatch<any>;
}

const Volumes = ({dispatch, ...props}: VolumesProps) => {
  return (
    <VolumesInput {...props}>
      {(type) => {
        switch (type) {
          case 'conf':
            return <VolumesInput.ConfigMapInput />;
          case 'host':
          default:
            return <VolumesInput.HostPathInput />;
        }
      }}
    </VolumesInput>
  );
};

export default connect(() => null)(Volumes);

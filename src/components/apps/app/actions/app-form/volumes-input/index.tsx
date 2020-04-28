import * as React from 'react';
import VolumesInput, {VolumesInputProps} from './volumes-input';
import HostPathInput from './host-path-input';
import ItemsInput from './items-input';
import ConfigMapInput from './config-map-input';
import SecretInput from './secret-input';

class Volumes extends React.PureComponent<VolumesInputProps> {
  static HostPath: typeof HostPathInput;
  static Items: typeof ItemsInput;
  static ConfigMap: typeof ConfigMapInput;
  static Secret: typeof SecretInput;
  render() {
    return <VolumesInput {...this.props} />;
  }
}

Volumes.HostPath = HostPathInput;
Volumes.Items = ItemsInput;
Volumes.ConfigMap = ConfigMapInput;
Volumes.Secret = SecretInput;

export default Volumes;

import * as React from 'react';
import VolumesInput, {VolumesInputProps} from './volumes';
import HostPathInput from './host-path';
import ItemsInput from './items';
import ConfigMapInput from './config-map';
import SecretInput from './secret';

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

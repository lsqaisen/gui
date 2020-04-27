import * as React from 'react';
import VolumesInput, {VolumesInputProps} from './volumes-input';
import HostPathInput from './host-path-input';
import ItemsInput from './items-input';
import ConfigMapInput from './config-map-input';

class Volumes extends React.PureComponent<VolumesInputProps> {
  static HostPathInput: typeof HostPathInput;
  static ItemsInput: typeof ItemsInput;
  static ConfigMapInput: typeof ConfigMapInput;
  render() {
    return <VolumesInput {...this.props} />;
  }
}

Volumes.HostPathInput = HostPathInput;
Volumes.ItemsInput = ItemsInput;
Volumes.ConfigMapInput = ConfigMapInput;

export default Volumes;

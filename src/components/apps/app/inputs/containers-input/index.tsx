import * as React from 'react';
import ContainersInput, {ContainersInputProps} from './containers';
import ContainerInput from './container';
import ImageInput from './image';
import MountsInput from './mounts';
import EnvsInput from './envs/';
import EnvKeyRefInput from './envs/key-ref-input';

class Containers extends React.PureComponent<ContainersInputProps> {
  static Container: typeof ContainerInput;
  static Image: typeof ImageInput;
  static Mounts: typeof MountsInput;
  static Envs: typeof EnvsInput;
  static EnvKeyRef: typeof EnvKeyRefInput;
  render() {
    return <ContainersInput {...this.props} />;
  }
}

Containers.Container = ContainerInput;
Containers.Image = ImageInput;
Containers.Mounts = MountsInput;
Containers.Envs = EnvsInput;
Containers.EnvKeyRef = EnvKeyRefInput;

export default Containers;

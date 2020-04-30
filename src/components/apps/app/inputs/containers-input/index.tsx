import * as React from 'react';
import ContainersInput, {ContainersInputProps} from './containers';
import ContainerInput from './container';
import ImageInput from './image';
import MountsInput from './mounts';

class Containers extends React.PureComponent<ContainersInputProps> {
  static Container: typeof ContainerInput;
  static Image: typeof ImageInput;
  static Mounts: typeof MountsInput;
  render() {
    return <ContainersInput {...this.props} />;
  }
}

Containers.Container = ContainerInput;
Containers.Image = ImageInput;
Containers.Mounts = MountsInput;

export default Containers;

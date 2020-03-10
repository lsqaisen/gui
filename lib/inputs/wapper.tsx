import { PureComponent } from "react"

interface InputWapperrProps {
  load?: (value: any) => any;
  dump?: (value: any) => any;
}

const InputWapper = ({ load = (value: any) => value, dump = (value: any) => value }: InputWapperrProps) => <P extends any>(
  Component: React.ComponentType<P>
) => class extends PureComponent<P, any> {
    render() {
      const { value, onChange = () => null, ...props } = this.props;
      return (
        <Component
          {...props as P}
          value={load(value)}
          onChange={(value: any) => onChange(dump(value))}
        />
      )
    }
  }

export default InputWapper;
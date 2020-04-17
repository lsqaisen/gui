import * as React from 'react';
import {Input} from 'antd';
import {InputProps} from 'antd/lib/input';

const NameInput = React.forwardRef(
  ({value, onChange, ...props}: InputProps, ref: any) => {
    const [_, ..._value] = ((value || '') as any).split('-');
    return (
      <Input
        ref={ref}
        className="nameinput"
        value={_value.join('-')}
        {...props}
        onChange={(e) => onChange!(`app-${e.target.value}` as any)}
        prefix={<span>app-</span>}
      />
    );
  }
);

export default NameInput;

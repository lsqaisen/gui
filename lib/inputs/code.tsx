import {useEffect, useState} from 'react';
import {Controlled as CodeMirror, ICodeMirror} from 'react-codemirror2';
import styles from './style/index.less';
import 'codemirror/lib/codemirror.css';

export interface CodeInputProps extends ICodeMirror {
  mode: string;
  border?: boolean;
  autosize?: boolean;
  value?: string;
  style?: React.CSSProperties;
  onChange?: (value: string) => void;
}

const Code = ({
  value = '',
  border = true,
  autosize,
  mode,
  options = {lineNumbers: true},
  style,
  onChange,
  className,
  ...props
}: CodeInputProps) => {
  useEffect(() => {
    require(`codemirror/mode/${mode}/${mode}`);
  }, []);
  return (
    <div
      className={`${styles[`code-input`]} ${
        autosize ? styles[`autosize`] : ''
      } ${border ? styles[`border`] : ''} ${className || ''}`}
      style={style}
    >
      <CodeMirror
        autoCursor
        value={value}
        options={{...options, mode}}
        onBeforeChange={(e, d, v) => {
          onChange!(v);
        }}
        {...props}
      />
    </div>
  );
};

export default Code;

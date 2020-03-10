
import { Input } from 'antd';
import { TextAreaProps } from 'antd/lib/input';
import { useRef, useLayoutEffect, forwardRef } from 'react';

export interface FileInputProps extends TextAreaProps {
}

const FileInput = forwardRef(({ style, onChange = () => null, ...props }: FileInputProps, ref: any) => {
  const inputRef: any = useRef(null);
  useLayoutEffect(() => {
    inputRef.current.onchange = () => {
      const files = inputRef.current.files[0];
      if (files) {
        const reader = new FileReader();
        reader.onload = (e: any) => onChange(e.target.result);
        reader.readAsText(files);
      }
    }
  })

  return (
    <>
      <Input.TextArea style={{ color: "rgba(0, 0, 0, 0.85)", ...style }} ref={ref}  {...props} readOnly onFocus={() => {
        inputRef.current.click()
      }} onChange={onChange} />
      <input ref={inputRef} type="file" style={{ display: 'none' }} />
    </>
  )
})

export default FileInput;
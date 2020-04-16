import {Input, InputNumber, Button} from 'antd';
import {useState} from 'react';

export interface EditInputProps {
  type?: 'number' | 'text' | 'textarea';
  value: any;
  onChange?: (value: any) => void;
}

const EditInput: React.FC<EditInputProps> = ({
  type = 'text',
  value,
  children,
  onChange = () => null
}) => {
  const [edit, setEdit] = useState(false);
  const onPressEnter = (e: React.ChangeEvent<any>) => {
    onChange(e.target.value);
    setEdit(false);
  };
  let edit_input = (
    <Input
      defaultValue={value}
      onPressEnter={onPressEnter}
      onBlur={onPressEnter}
    />
  );
  switch (type) {
    case 'textarea':
      edit_input = (
        <Input.TextArea
          defaultValue={value}
          onPressEnter={onPressEnter}
          onBlur={onPressEnter}
        />
      );
      break;
    case 'number':
      edit_input = (
        <InputNumber
          defaultValue={value}
          onPressEnter={onPressEnter}
          onBlur={onPressEnter}
        />
      );
      break;
    case 'text':
    default:
      edit_input = <Input defaultValue={value} onPressEnter={onPressEnter} />;
      break;
  }
  return edit ? (
    edit_input
  ) : (
    <>
      {children || value}
      <Button type="link" icon="edit" onClick={() => setEdit(true)} />
    </>
  );
};

export default EditInput;

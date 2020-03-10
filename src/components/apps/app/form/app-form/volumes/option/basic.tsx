import { useState } from 'react';
import { Form, Radio } from 'antd';
import { FormInput } from 'library';
import Items from './items';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ColProps } from 'antd/lib/col';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

export interface SearchSelectProps {
  initialValue?: any,
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  setVolumeItemsData: (data: string[]) => void,
  form: WrappedFormUtils,
}

export interface OptionProps<T> {
  value?: T;
  form: WrappedFormUtils;
  onChange: (value: T) => void;
}

const option = (Component: React.ComponentType<SearchSelectProps>) => function <T extends any>({ value, form, ...props }: OptionProps<T>) {
  const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
  const { items, optional } = value!;
  const labelCol = { xs: 24, md: 5 };
  const wrapperCol = { xs: 24, md: 19 };
  const [itemsData, setVolumeItemsData] = useState([] as string[]);
  return (
    <>
      <Component
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        initialValue={value}
        form={form}
        setVolumeItemsData={(data: any) => setVolumeItemsData(data)}
      />
      <FormItem
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        label="选项"
        required>
        {getFieldDecorator('optional', {
          initialValue: !!optional,
          rules: [],
        })(
          <RadioGroup onChange={(value) => value && setFieldsValue({ items: undefined })}>
            <Radio value={false}>全部</Radio>
            <Radio value={true} disabled={!(getFieldValue('name') || getFieldValue('secretName'))}>指定部分Key</Radio>
          </RadioGroup>
        )}
      </FormItem>
      {getFieldValue('optional') && <FormInput
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        label="Items"
        required>
        {getFieldDecorator('items', {
          initialValue: items,
          rules: [],
        })(
          <Items itemsData={itemsData} />
        )}
      </FormInput>}
    </>
  )
}

export default option;
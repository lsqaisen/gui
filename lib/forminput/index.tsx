import * as React from 'react';
import { PureComponent } from 'react';
import { Form } from 'antd';
import { FormItemProps, FormComponentProps, FormCreateOption } from 'antd/lib/form';

export interface FormInputItemProps extends FormItemProps {
  children: React.ReactNode,
}

export interface FormInputProps<T = any> extends FormComponentProps {
  ref?: any;
  value?: T;
  onChange?: (v: T) => void;
}

export default class FormInput extends React.PureComponent<FormInputItemProps, any> {
  static create: (options?: FormCreateOption<any>) => <T extends Object = {}>(WrappedComponent: React.ComponentClass<T, any> | React.ElementType) => React.ReactNode;
  render() {
    return (
      <Form.Item
        {...this.props}
        style={{ marginBottom: 0 }}
        validateStatus=""
        help=""
      >{this.props.children}</Form.Item>
    )
  }
}

FormInput.create = (options?: FormCreateOption<any>) => <T extends Object = {}>(WrappedComponent: React.ComponentClass<any, any> | React.ElementType) => {
  class FormInput extends PureComponent<FormInputProps<T>, any> {
    changeValidator = (rules: any[]) => {
      rules.push({
        validator: (rule: any, value: any, callback: any) => {
          !!this.props.form.validateFieldsAndScroll && this.props.form.validateFieldsAndScroll((error: any, _: any) => {
            if (error) {
              let errors = Object.values(error).
                map(({ errors }: any) => {
                  return errors
                    .map((error: any) => error.message)[0]
                  // .join(';')
                });
              callback(Array.from(new Set(errors)))
            }
            callback()
          })
        }
      })
    }
    UNSAFE_componentWillReceiveProps(nextProps: any) {
      if (!(nextProps as any)['data-__meta'].rules) {
        (nextProps as any)['data-__meta'].rules = [];
      }
      this.changeValidator((nextProps as any)['data-__meta'].rules);
    }
    componentDidMount() {
      if (!(this.props as any)['data-__meta'].rules) (this.props as any)['data-__meta'].rules = [];
      this.changeValidator((this.props as any)['data-__meta'].rules);
    }
    render() {
      return React.createElement(WrappedComponent, this.props);
    }
  }

  return Form.create<FormInputProps<T>>({
    onValuesChange: ({ onChange }, _, allValues) => {
      onChange && onChange(allValues as T);
    },
    ...(options || {}),
  })(FormInput as any);
};
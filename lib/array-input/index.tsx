import * as React from 'react';
import {Button, List, Row, Col} from 'antd';
import {ButtonType} from 'antd/lib/button';
import FormInput, {FormInputProps} from '../forminput/';
import styles from './style/index.less';

export interface ArrayInputProps<T> extends FormInputProps<T> {
  disabledRemoveLastOne?: boolean;
  btnType?: ButtonType;
  others?: T;
  input?:
    | React.ElementType
    | React.ComponentClass<any, any>
    | React.FunctionComponentElement<any>
    | (() => React.ReactElement);
  load?:
    | React.ComponentClass<any, any>
    | React.FunctionComponentElement<any>
    | (() => React.ReactElement);
  header?: React.ReactNode;
  btn?: any;
  btnText: string;
  inputProps?: {[key: string]: any};
  loadProps?: {[key: string]: any};
  actionTypes: ('load' | 'add')[];
  actions?: React.ReactNode[];
  itemWapper?: React.ReactNode;
}

let uuid = 0;

@(FormInput.create({
  onValuesChange: ({value: __value, onChange}: any, changeValues: any) => {
    const {type, value}: any = changeValues.action || {};
    switch (type) {
      case 'add':
        onChange(__value.concat(value));
        break;
      case 'modify':
        onChange(value);
        break;
      case 'remove':
        let _value = [].concat(__value);
        _value.splice(value, 1);
        onChange(_value);
        break;
      default:
        break;
    }
  },
}) as any)
export default class<T> extends React.PureComponent<ArrayInputProps<T[]>, any> {
  static readonly defaultProps = {
    btnType: 'link',
    value: [],
    form: {},
    inputProps: {},
    loadProps: {},
    others: [],
    actionTypes: ['add'],
    onChange: () => null,
  };

  state = {
    keys: [],
  };

  remove = (k: any) => {
    const {
      form: {getFieldValue, setFieldsValue},
    } = this.props;
    const keys = getFieldValue('keys');
    if (keys.length === 0) {
      return;
    }
    setFieldsValue({
      keys: keys.filter((key: any) => key !== k),
      action: {
        type: 'remove',
        value: keys.findIndex((key: any) => key === k),
      },
    });
  };

  add = () => {
    uuid++;
    const {
      form: {getFieldValue, setFieldsValue},
    } = this.props;
    const keys = getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    setFieldsValue({
      keys: nextKeys,
      action: {
        type: 'add',
        value: [new Object({} as T)],
      },
    });
  };

  change = (index: any, v: T) => {
    const {
      value: _value,
      form: {setFieldsValue},
    } = this.props;
    let value: T[] = [].concat(_value as any);
    value[index] = v;
    setFieldsValue({
      action: {
        type: 'modify',
        value,
      },
    });
  };

  load = (data: any[]) => {
    const {
      form: {getFieldValue, setFieldsValue},
    } = this.props;
    let keys = getFieldValue('keys');
    let load = data.forEach(() => (keys = keys.concat(++uuid)));
    setFieldsValue({
      keys,
      action: {
        type: 'add',
        value: load,
      },
    });
  };

  getValues = () => {
    const {
      form: {getFieldsValue},
    } = this.props;
    let value = getFieldsValue() || {};
    delete value.keys;
    delete value.action;
    return value;
  };

  componentDidMount() {
    const {value} = this.props;
    this.setState({
      keys: Object.keys(value!).map(key => parseInt(key, 10)),
    });
  }

  render() {
    const {
      disabledRemoveLastOne,
      btnType,
      actionTypes,
      input,
      load,
      inputProps,
      loadProps,
      btn,
      btnText,
      header,
      others,
      value,
      actions,
      itemWapper,
      form: {getFieldDecorator, getFieldValue},
    } = this.props;
    const {keys: initialValue} = this.state;
    getFieldDecorator('keys', {initialValue});
    getFieldDecorator('action', {initialValue: {type: '', value: null}});
    const keys = getFieldValue('keys');
    return (
      <List
        bordered={false}
        className={`${styles[`array-input`]} ${keys.length <= 0 &&
          styles[`array-inpu-empty`]}`}
        header={header}
        footer={
          btn ? (
            React.cloneElement(btn as any, {
              onClick: this.add,
            })
          ) : (
            <Row gutter={8} style={{display: 'flex'}}>
              {actionTypes.includes('add') && (
                <Col style={{flex: 1}}>
                  <Button
                    type={btnType}
                    onClick={this.add}
                    style={{
                      width: btnType === 'link' ? 'auto' : '100%',
                      ...(btnType === 'link' ? {padding: 0} : {}),
                    }}
                  >
                    {btnText}
                  </Button>
                </Col>
              )}
              {actionTypes.includes('load') && load && (
                <Col style={{flex: 1}}>
                  {React.createElement(load as any, {
                    ...loadProps,
                    type: btnType,
                    onChange: this.load,
                  })}
                </Col>
              )}
            </Row>
          )
        }
        dataSource={keys}
        renderItem={(key: any, index: number) => (
          <List.Item
            actions={
              itemWapper
                ? undefined
                : actions
                ? actions!.map((action: any) =>
                    React.cloneElement(action, {
                      onClick: (e: any) => {
                        e.stopPropagation();
                        this.remove(key);
                      },
                    })
                  )
                : [
                    <Button
                      disabled={
                        disabledRemoveLastOne && keys.length <= 1 ? true : false
                      }
                      size="small"
                      onClick={() => this.remove(key)}
                      style={{marginBottom: 24}}
                      shape="circle"
                      type="ghost"
                      icon="minus"
                    />,
                  ]
            }
          >
            {itemWapper ? (
              React.cloneElement(itemWapper as any, {
                actions: actions
                  ? actions!.map((action: any) =>
                      React.cloneElement(action, {
                        onClick: e => {
                          e.stopPropagation();
                          this.remove(key);
                        },
                      })
                    )
                  : undefined,
                children: (
                  <FormInput key={key}>
                    {getFieldDecorator(`index_${key}`, {
                      initialValue: value![index],
                      rules: [],
                    })(
                      React.createElement(input as any, {
                        ...inputProps,
                        others: others!.filter((v, i) => i !== index),
                        onChange: (v: T) => this.change(index, v),
                      })
                    )}
                  </FormInput>
                ),
              })
            ) : (
              <div style={{width: 'calc(100% - 32px)'}}>
                <FormInput key={key}>
                  {getFieldDecorator(`index_${key}`, {
                    initialValue: value![index],
                    rules: [],
                  })(
                    React.createElement(input as any, {
                      ...inputProps,
                      others: others!.filter((v, i) => i !== index),
                      onChange: (v: T) => this.change(index, v),
                    })
                  )}
                </FormInput>
              </div>
            )}
          </List.Item>
        )}
      />
    );
  }
}

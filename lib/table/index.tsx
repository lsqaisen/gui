import * as React from 'react';
import { PureComponent, Fragment } from 'react';
import { Icon } from 'antd';
import { TableProps } from 'antd/lib/table';
import Table from './table';
import Actions from './actions';
import { generateUUID } from '../utils/'

export interface ActionTableProps<T> extends TableProps<T> {
  actionFixed?: boolean | ('left' | 'right');
  loading?: boolean;
  actionType?: 'button' | 'dropdown';
  actionText?: string;
  actions?: React.ReactNode | (() => React.ReactNode);
}

class ActionTable<T = any> extends PureComponent<ActionTableProps<T>, any> {
  static Actions: any = null;
  static readonly defaultProps: ActionTableProps<any> = {
    loading: false,
    actionType: 'dropdown',
    actionText: '操作',
    actionFixed: 'right',
  }
  state = {
    selectIndex: -1,
    visibles: {} as { [key: string]: boolean },
  }
  actionDataIndex = generateUUID()

  render() {
    const { loading, dataSource, actionFixed, actionText, actionType, actions, columns, children, ...props } = this.props;
    const { selectIndex, visibles } = this.state;
    return (
      <Fragment>
        <Table<T>
          {...props}
          loading={loading}
          columns={columns!.concat(actions ? [{
            title: '操作',
            dataIndex: this.actionDataIndex,
            fixed: actionFixed,
            width: 72,
            className: "tc",
            onCell: () => {
              return {
                style: {
                  minWidth: 72,
                }
              }
            },
            render: (_, r, i) => actionType === "dropdown" ? (
              <Actions
                disabled={(r as any).actionDisabled}
                actions={this.props.actions}
                data={r}
                onClick={(key: string) => {
                  const visibles = this.state.visibles;
                  this.setState({ visibles: Object.assign({}, visibles, { [key]: true }), selectIndex: i })
                }}
              >
                <a className="ant-dropdown-link" href="#" onClick={(e) => e.preventDefault()}>
                  {actionText} <Icon type="down" />
                </a>
              </Actions>
            ) : (
                <span className="ant-dropdown-link" onClick={() => {
                  const visibles = this.state.visibles;
                  this.setState({ visibles: Object.assign({}, visibles, { ['button']: true }), selectIndex: i })
                }}>
                  {React.cloneElement(this.props.actions as any, {
                    data: r,
                  })}
                </span>
              ),
          }] : [])}
          dataSource={dataSource}
        />
        {children && React.Children.map(children, (action: any) => {
          return action && React.cloneElement(action, {
            visible: visibles[action.key],
            data: dataSource![selectIndex],
            onClose: () => {
              const visibles = this.state.visibles;
              this.setState({ visibles: Object.assign({}, visibles, { [action.key]: false }), selectIndex: -1 })
            },
          })
        })}
      </Fragment >
    )
  }
}

ActionTable.Actions = Actions;

export default ActionTable;
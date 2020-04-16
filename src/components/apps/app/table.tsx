import * as React from 'react';
import {PureComponent} from 'react';
import {Typography} from 'antd';
import Time from 'react-time-format';
import {ColumnProps} from 'antd/lib/table';
import Link from 'umi/link';
import {Table, EllipsisTooltip, Inputs} from 'library';
import {ActionTableProps} from 'library/type/table/';
import {IApp} from '@/models/apps/apps';
import Context from './context';

export interface AppProps extends ActionTableProps<IApp> {
  data: IApp[];
  loading: boolean;
}

class App extends PureComponent<AppProps, any> {
  columns: ColumnProps<IApp>[] = [
    {
      title: '服务名称',
      dataIndex: 'name',
      width: 186,
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 186,
          minWidth: 126
        }
      }),
      render: (t, r, i) => {
        return (
          <Typography.Text copyable={{text: t}}>
            <EllipsisTooltip title={t} width="calc(100% - 22px)">
              <Link to={`/apps/list/${t}?ns=${r.namespace}&type=${r.type}`}>
                {t}
              </Link>
            </EllipsisTooltip>
          </Typography.Text>
        );
      }
    },
    {
      title: '使用镜像',
      dataIndex: 'images',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 258,
          minWidth: 158
        }
      }),
      render: (t, r, i) => {
        let text = (r.containers || []).map(v => v.image).join(';') || '未知';
        return (
          <Typography.Text copyable={{text}}>
            <EllipsisTooltip title={text} width="calc(100% - 22px)">
              {text}
            </EllipsisTooltip>
          </Typography.Text>
        );
      }
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 128,
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 128,
          minWidth: 128
        }
      }),
      render: (t, r) => t
    },
    {
      title: '实例数(运行/总数)',
      dataIndex: 'replicas',
      width: 156,
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 156,
          minWidth: 156
        }
      }),
      render: (t, r) => {
        return (
          <Context.Consumer>
            {({modifyReplicas}) => (
              <Inputs.Edit
                type="number"
                value={t}
                onChange={replicas =>
                  modifyReplicas!({
                    ...r,
                    app_type: r.type,
                    replicas: Number(replicas)
                  })
                }
              >
                {`${r.ready} / ${r.replicas}`}
              </Inputs.Edit>
            )}
          </Context.Consumer>
        );
      }
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      width: 136,
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          maxWidth: 136,
          minWidth: 136
        }
      }),
      render: (t, r, i) => (
        <Time format="YYYY-MM-DD  HH:mm" value={new Date(t)} />
      )
    }
  ];
  render() {
    const {loading, data, children, ...props} = this.props;
    return (
      <Table<IApp>
        {...props}
        loading={loading}
        columns={this.columns}
        dataSource={(data || []).map(_ => ({key: _.name, ..._}))}
      >
        {children}
      </Table>
    );
  }
}

export default App;

import { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { Page } from 'library';
import { getLogsRequest } from 'api/type/registry';
import { ConnectLoading, Dispatch } from '@/models/connect';
import { ILogs, LogsModelState } from '@/models/registry/logs';
import Table from '@/components/registry/logs/table';

export type LogsListProps = {
  data: ILogs;
  loading: boolean;
  dispatch: Dispatch<any>;
}

const LogsList = ({ loading, data, dispatch }: LogsListProps) => {
  const [{ page, size, query }, setState] = useState({ page: 1, size: 10, query: "" } as any)
  const getLogs = () => dispatch({ type: 'logs/get', payload: { page, size, query } });
  useEffect(() => {
    getLogs();
  }, [page, size, query])
  return (
    <Page
      className="node-body"
      style={{ minHeight: '100%' }}
      title=""
      routes={[{
        path: '/dashboard',
        breadcrumbName: '总览',
      }, {
        path: `/registry/logs`,
        breadcrumbName: '操作日志',
      }]}
    >
      <section className="box">
        <header style={{ overflow: 'hidden', marginBottom: 16 }}>
          <div className="fr">
            <Button style={{ marginLeft: 16 }} type="ghost" loading={loading} onClick={getLogs} >刷新</Button>
          </div>
        </header>
        <Table
          loading={loading}
          data={data}
          pagination={{
            current: page,
            pageSize: size,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, size) => setState({ page, size, query }),
            onShowSizeChange: (page, size) => setState({ page, size, query }),
            showTotal: total => `共 ${total} 条`,
          }}
        />
      </section>
    </Page>
  )
}

export type ConnectState = {
  logs: LogsModelState
  loading: ConnectLoading
}
export default connect(({ logs, loading }: ConnectState) => ({ data: logs.data, loading: loading.effects['logs/get'] }))(LogsList)
import { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'dva';
import { Button, Input, Row, Col } from 'antd';
import Table from '@/components/user/audit/table';
import { Dispatch, ConnectLoading } from '@/models/connect';
import { UserListModelState, IAudits } from '@/models/uesr/user';
import { Page } from 'library';
import lodash from 'lodash';
import { getAuditsRequest } from 'api/type/user';

const InputGroup = Input.Group;
const SearchInput = Input.Search;

export type AuditListProps = {
  data: IAudits;
  loading: boolean;
  dispatch: Dispatch<any>;
}

const AuditList = ({ loading, data, dispatch }: AuditListProps) => {
  const [{ page, size, query }, setState] = useState({ page: 1, size: 10, query: "" } as any)
  const getAudits = (payload: getAuditsRequest) => dispatch({ type: 'users/audits', payload });
  const delayedQuery = useCallback(lodash.debounce(getAudits, 500), []);
  useEffect(() => { delayedQuery({ page, size, query }) }, [page, size, query]);
  return (
    <Page
      className="node-body"
      style={{ minHeight: '100%' }}
      title=""
      routes={[{
        path: '/dashboard',
        breadcrumbName: '总览',
      }, {
        path: '/auth/config',
        breadcrumbName: '审计日志',
      }]}
    >
      <section className="box">
        <header style={{ overflow: 'hidden' }}>
          <Row>
            <Col xs={24} md={16} lg={16} style={{ overflow: 'auto', marginBottom: 12 }}>
              <SearchInput
                placeholder="关键字"
                style={{ width: 240, maxWidth: '65%' }}
                value={query}
                onChange={(e) => setState({ page, size, query: `${e.target.value}` })}
                onSearch={(value) => setState({ page, size, query: `${value}` })}
              />
            </Col>
            <Col xs={24} md={8} lg={8} style={{ overflow: 'auto', marginBottom: 12 }}>
              <div className="fr">
                <Button
                  ghost
                  type="primary"
                  style={{ marginTop: 1, float: 'left' }}
                  loading={loading}
                  onClick={() => getAudits({ page, size, query })}
                >刷新</Button>
              </div>
            </Col>
          </Row>
        </header>

        <Table
          pagination={{
            current: page,
            pageSize: size,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, _size) => setState({ page, size, query }),
            onShowSizeChange: (page, size) => setState({ page, size, query }),
            showTotal: total => `共 ${total} 条`,
          }}
          loading={loading}
          data={data}
        // actions={<Actions />}
        />
      </section>
    </Page>
  )
}

export type ConnectState = {
  users: UserListModelState;
  loading: ConnectLoading;
}

export default connect(({ users, loading }: ConnectState) => ({ data: users.audits, loading: loading.effects['users/audits'] }))(AuditList);
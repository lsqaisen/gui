import {Skeleton, Statistic, List, Typography, PageHeader} from 'antd';
import {ConnectLoading, Dispatch} from '@/models/connect';
import {connect} from 'dva';
import {useEffect} from 'react';
import {UserListModelState, IAudits} from '@/models/uesr/user';
import Link from 'umi/link';

export type UsersProps = {
  loading: boolean;
  total: number;
  audits: IAudits;
  dispatch: Dispatch<any>;
};

const Users = ({loading, total = 0, audits, dispatch}: UsersProps) => {
  const getUsers = () => dispatch({type: 'users/get'});
  const getAudits = () =>
    dispatch({type: 'users/audits', payload: {page: 1, size: 10, query: ''}});
  useEffect(() => {
    getUsers();
    getAudits();
  }, []);
  return (
    <>
      <section className="box" style={{marginBottom: '24px'}}>
        <Skeleton loading={loading}>
          <Statistic title="平台用户数" value={total} />
        </Skeleton>
      </section>
      <section className="box" style={{marginBottom: '24px'}}>
        <Skeleton loading={loading}>
          <PageHeader
            title="审计日志"
            subTitle={`最近10条(总共${audits.total}条)`}
            style={{padding: 0}}
            extra={<Link to="/user/audits">详情</Link>}
          >
            <List
              dataSource={audits.items}
              locale={{emptyText: '暂无审计日志'}}
              renderItem={(audit) => (
                <Typography.Paragraph
                  style={{
                    wordBreak: 'break-all',
                    color: audit.status !== 200 ? '#ff5242' : '',
                  }}
                  ellipsis={{rows: 2, expandable: true}}
                >
                  对象：
                  <Typography.Text mark>{audit.repo_name}</Typography.Text> ->
                  <Typography.Text mark>{audit.resource}</Typography.Text>,
                  记录：{audit.operation}
                </Typography.Paragraph>
              )}
            />
          </PageHeader>
        </Skeleton>
      </section>
    </>
  );
};

export type ConnectState = {
  users: UserListModelState;
  loading: ConnectLoading;
};
export default connect(({users, loading}: ConnectState) => ({
  total: users.list.length,
  audits: users.audits,
  loading: loading.effects['users/get'] || loading.effects['users/audits'],
}))(Users);

import { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import router from 'umi/router';
import { Page } from 'library';
import Table from '@/components/apps/secret/table';
import CreateSecret from '@/components/apps/secret/create';
import { ISecret, SecretModelState } from '@/models/apps/secret';
import { Dispatch, ConnectLoading } from '@/models/connect';
import Context from '@/components/apps/secret/context';
import { SecretRequest } from 'api/type/app';
import Namespace, { Layout as NamespaceLayout } from '../../basic/namespace';
import Delete from './basic/actions/';

export type SecretListProps = {
  loading: boolean;
  ns: string;
  secrets: ISecret[];
  dispatch: Dispatch<any>;
}

const SecretList = ({ loading, secrets, ns, dispatch }: SecretListProps) => {
  const goto = (ns: string) => router.push(`/apps/secret?ns=${ns}`);
  const getSecrets = () => dispatch({ type: 'secret/get', payload: ns });
  const createSecret = (payload: SecretRequest) => dispatch({ type: 'secret/create', payload });
  useEffect(() => { !!ns && getSecrets() }, [ns]);
  return (
    <NamespaceLayout ns={ns} goto={goto}>
      <Context.Provider value={{ namespace: ns, createSecret }}>
        <Page
          style={{ minHeight: '100%' }}
          title=""
          routes={[{
            path: '/dashboard',
            breadcrumbName: '总览',
          }, {
            path: `/apps/secret`,
            breadcrumbName: '证书管理',
          }]}
        >
          <section className="box">
            <header style={{ overflow: 'hidden', marginBottom: 16 }}>
              <Namespace ns={ns} goto={goto} />
              <div className="fl" style={{ marginRight: 16 }}>
                <CreateSecret />
              </div>
              <div className="fr">
                <Button style={{ marginLeft: 16 }} loading={loading} onClick={getSecrets}>刷新</Button>
              </div>
            </header>
            <Table
              loading={loading}
              dataSource={secrets.map(v => ({ key: v.metadata.name, ...v }))}
              actions={<Delete dispatch={dispatch} />}
            />
          </section>
        </Page>
      </Context.Provider>
    </NamespaceLayout>
  )
}

export type ConnectState = {
  secret: SecretModelState
  loading: ConnectLoading
}

export default connect(({ secret, loading }: ConnectState, { location: { query: { ns } } }: any) => ({ ns, secrets: secret.data[ns] || [], loading: loading.effects['secret/get'] }))(SecretList);
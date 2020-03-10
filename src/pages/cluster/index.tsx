import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import { connect } from 'dva';
import { Button } from 'antd';
import { Page } from 'library'
import Node from '@/components/cluster/';
import Actions from './basic/actions';
import AddNode from '@/components/cluster/add-node';
import Install from '@/components/cluster/install';
import { INode, ClusterModelState } from '@/models/cluster/cluster';
import { ConnectLoading, Dispatch } from '@/models/connect';
import { InstallModelState } from '@/models/cluster/install';

export interface NodesProps {
  loading: boolean;
  runningstatus: boolean;
  nodes: INode[];
  getNodes: () => void;
  dispatch: Dispatch<any>;
}

const Nodes: React.FC<NodesProps> = ({ loading, runningstatus, nodes, dispatch }) => {
  const getNodes = () => dispatch({ type: 'cluster/get' });
  const addNodes = (payload: any) => dispatch({ type: 'cluster/add', payload });
  const getRunningStatus = () => dispatch({ type: 'install/get' });
  const [container, setContainer] = useState(undefined);
  const [fullscreen, setFullScreen] = useState(false);
  useEffect(() => { getNodes(); getRunningStatus() }, []);
  return (
    <Page
      ref={ref => setContainer(ReactDOM.findDOMNode(ref))}
      style={{ minHeight: '100%', transform: fullscreen ? "" : "scale(1)" }}
      title=""
      routes={[{
        path: '/dashboard',
        breadcrumbName: '总览',
      }, {
        path: `/cluster`,
        breadcrumbName: '节点列表',
      }]}
    >
      <section className="box">
        <header style={{ overflow: 'hidden', marginBottom: 16 }}>
          <div className="fl" style={{ lineHeight: '40px' }} >
            {runningstatus ? (
              <Install
                getContainer={container}
                onFullScreen={(fullscreen, term) => {
                  setFullScreen(fullscreen);
                  term.resize();
                }}
              />
            ) : <AddNode onSubmit={addNodes} />}
          </div>
          <div className="fr">
            <Button style={{ marginLeft: 16 }} loading={loading} onClick={() => { getNodes(); getRunningStatus() }}>刷新</Button>
          </div>
        </header>
        <Node
          loading={loading}
          nodes={nodes}
          actions={<Actions dispatch={dispatch} />}
        />
      </section>
    </Page>
  );
}

export type ConnectState = {
  cluster: ClusterModelState;
  install: InstallModelState;
  loading: ConnectLoading;
}

export default connect(({ cluster, install, loading }: ConnectState) => ({ runningstatus: install.runningstatus, nodes: cluster.nodes, loading: loading.effects['cluster/get'] }))(Nodes)
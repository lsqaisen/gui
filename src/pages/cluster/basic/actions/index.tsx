import * as React from 'react';
import {Menu, Typography} from 'antd';
import NodeAction from '@/components/cluster/node-action';
import {INode} from '@/models/cluster/cluster';
import {Dispatch} from '@/models/connect';

export interface ActionsProps {
  data?: INode;
  update?: () => void;
  dispatch: Dispatch<any>;
}

const Actions: React.FC<ActionsProps> = ({
  data,
  update = () => {},
  dispatch,
  ...props
}) => {
  const {
    unschedulable = false,
    metadata: {name}
  } = data || ({} as INode);
  const cordonTitle = unschedulable ? '解锁' : '封锁';
  const nodeAction = (payload: any) =>
      dispatch({type: 'cluster/action', payload}),
    deleteNode = (payload: any) => dispatch({type: 'cluster/delete', payload});
  return (
    <>
      {unschedulable ? (
        <NodeAction
          key="cordon"
          title={`解锁节点${name}`}
          content={`是否解锁节点${name}？解锁后Pod将会调度到该节点上。`}
          okText="是"
          cancelText="否"
          btn={<Menu.Item {...props} />}
          deleteCallback={update}
          onAction={() => nodeAction({node: name, action: 'uncordon'})}
        >
          {cordonTitle}
        </NodeAction>
      ) : (
        [
          <NodeAction
            key="cordon"
            title={`封锁节点${name}`}
            content={
              <Typography>
                是否封锁节点${name}?封锁后Pod将
                <Typography.Text mark>不会调度</Typography.Text>
                到该节点上，并且已存在该节点上的Pod将
                <Typography.Text mark>不会被驱逐</Typography.Text>。
              </Typography>
            }
            okText="是"
            cancelText="否"
            btn={<Menu.Item {...props} />}
            deleteCallback={update}
            onAction={() =>
              nodeAction({
                node: name,
                action: !unschedulable ? 'cordon' : 'uncordon'
              })
            }
          >
            {cordonTitle}
          </NodeAction>,
          <NodeAction
            key="drain"
            title={`驱逐节点${name}`}
            content={
              <Typography>
                是否驱逐节点${name}?驱逐后Pod将
                <Typography.Text mark>不会调度</Typography.Text>
                到该节点上，并且已存在该节点上的Pod将
                <Typography.Text mark>会被驱逐</Typography.Text>。
              </Typography>
            }
            okText="是"
            cancelText="否"
            btn={<Menu.Item disabled={unschedulable} {...props} />}
            deleteCallback={update!}
            onAction={() => nodeAction({node: name, action: 'drain'})}
          >
            驱逐
          </NodeAction>
        ]
      )}
      <Menu.Divider {...props} />
      <NodeAction
        key="delete"
        title="移除"
        content={`是否移除节点${name}?`}
        okText="是"
        okType="danger"
        cancelText="否"
        btn={<Menu.Item {...props} style={{color: '#ff5242'}} />}
        deleteCallback={update}
        onAction={() => deleteNode(name)}
      >
        移除
      </NodeAction>
    </>
  );
};

export default Actions;

import Table, {
  InstancesProps as Props
} from '@/components/apps/app/detail/instances';
import {IInstance} from '@/models/apps/apps';
import {Modal} from 'antd';
import {Dispatch} from '@/models/connect';
import {connect} from 'dva';

export interface InstancesProps extends Props {
  name: string;
  type: string;
}

interface ActionsProps {
  type: string;
  appname: string;
  namespace: string;
  data?: IInstance;
  dispatch: Dispatch<any>;
}

const Delete = connect(() => ({}))(
  ({type, appname, namespace, data, dispatch}: ActionsProps) => {
    return (
      <a
        onClick={e => {
          e.preventDefault();
          Modal.confirm({
            title: `Pod${data!.name}`,
            content: `是否重建Pod${data!.name}?`,
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk: () =>
              new Promise(async (resolve, reject) => {
                dispatch({
                  type: 'apps/deletePod',
                  payload: {name: data!.name, namespace}
                }).then((error: any) => {
                  if (!error) {
                    dispatch({
                      type: 'apps/detail',
                      payload: {name: appname, namespace, type}
                    });
                    resolve();
                  } else {
                    reject(error);
                  }
                });
              })
          });
        }}
      >
        重建
      </a>
    );
  }
);

const Instances = (props: InstancesProps) => {
  return (
    <section style={{height: !props.data ? 160 : 'auto', padding: '24px 0'}}>
      <Table
        {...props}
        actions={
          <Delete
            {...{namespace: props.ns, appname: props.name, type: props.type}}
          />
        }
      />
    </section>
  );
};

export default Instances;



import { connect } from "dva";
import { AppsModelState } from "@/models/apps/apps";
import { ConnectLoading, Dispatch } from "@/models/connect";

export interface WapperProps {
  name: string;
  type: string;
  namespace: string;
  dispatch: Dispatch<any>;
}

export interface ConnectState {
  apps: AppsModelState;
  loading: ConnectLoading;
}

export default (toProps?: (namespace: string, name: string, apps: AppsModelState) => { [key: string]: any }) => <P extends WapperProps>(Component: React.ComponentType<P>) => {
  return connect(
    (
      { apps, loading }: ConnectState,
      { namespace, type, name }: any
    ) => {
      return ({
        namespace, type, name,
        loading: loading.effects['apps/detail'],
        ...(toProps || (() => { }))(namespace, name, apps)
      })
    }
  )(Component)
}
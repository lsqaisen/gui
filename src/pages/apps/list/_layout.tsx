import { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Dispatch } from '@/models/connect';
import Context from '@/components/apps/app/context';
import { getImagesRequest } from 'api/type/registry';
import { App, ConfigMapRequest, SecretRequest, ModifyReplicasRequest, ImportAppType, ModifyServiceType } from 'api/type/app';
import { Add as AddConfigMap } from '@/components/apps/configmap/create';
import { Add as AddSecret } from '@/components/apps/secret/create';
import { Icon } from 'antd';

export interface LayoutProps {
  ns: string;
  dispatch: Dispatch<any>
}

const Layout: React.FC<LayoutProps> = ({ ns, dispatch, children }) => {
  const createApp = (app: App) => dispatch({ type: 'apps/create', payload: app });
  const modifyApp = (app: App) => dispatch({ type: 'apps/modify', payload: app });
  const deletePod = (app: App) => dispatch({ type: 'apps/deletePod', payload: app });
  const modifyService = (app: ModifyServiceType) => dispatch({ type: 'apps/modifyService', payload: app });
  const importApp = (data: ImportAppType) => dispatch({ type: 'apps/import', payload: data });
  const getImages = (payload: getImagesRequest) => dispatch({ type: 'registry/getImages', payload });
  const getTags = (name: string) => dispatch({ type: 'registry/getTags', payload: name });
  const getConfigMaps = () => dispatch({ type: 'configmap/get', payload: ns });
  const getSecrets = () => dispatch({ type: 'secret/get', payload: ns });
  const getIPPools = () => dispatch({ type: 'nwpool/get' });
  const createConfigMap = (payload: ConfigMapRequest) => dispatch({ type: 'configmap/create', payload });
  const createSecret = (payload: SecretRequest) => dispatch({ type: 'secret/create', payload });
  const modifyReplicas = (payload: ModifyReplicasRequest) => dispatch({ type: 'apps/modifyReplicas', payload });
  return (
    <Context.Provider value={{
      getImages, getTags, getConfigMaps, getSecrets, createApp, modifyReplicas, importApp, modifyApp, getIPPools, modifyService,
      namespace: ns,
      CreateConfigMapComp: ({ onCreate }) => <AddConfigMap
        canFullScreen
        submit={createConfigMap}
        value={{ namespace: ns }}
        onCreate={onCreate}
      />,
      CreateSecretComp: ({ onCreate }) => <AddSecret
        canFullScreen
        submit={createSecret}
        value={{ namespace: ns }}
        onCreate={onCreate}
      />
    }}>
      {children}
    </Context.Provider>
  )
}

export default connect((_: any, { location: { query: { ns } } }: any) => ({ ns }))(Layout)
import {createContext} from 'react';
import {getImagesRequest} from 'api/type/registry';
import {
  App,
  ModifyReplicasRequest,
  ImportAppType,
  ModifyServiceType
} from 'api/type/app';

export interface CreateProps {
  onCreate?: (data: any) => void;
}

export interface ContextProps {
  namespace?: string;
  createApp?: (value: App) => Promise<any>;
  modifyApp?: (value: App) => Promise<any>;
  modifyService?: (value: ModifyServiceType) => Promise<any>;
  getImages?: (value: getImagesRequest) => Promise<any>;
  getTags?: (image_name: string) => Promise<any>;
  getConfigMaps?: () => Promise<any>;
  getSecrets?: () => Promise<any>;
  getIPPools?: () => Promise<any>;
  modifyReplicas?: (paylad: ModifyReplicasRequest) => Promise<any>;
  importApp?: (paylad: ImportAppType) => Promise<any>;
  CreateConfigMapComp?: React.ComponentType<CreateProps>;
  CreateSecretComp?: React.ComponentType<CreateProps>;
}

const Context: React.Context<ContextProps> = createContext({});

export default Context;

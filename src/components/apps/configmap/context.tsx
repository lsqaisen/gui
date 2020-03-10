import { createContext } from 'react';
import { ConfigMapRequest } from 'api/type/app';

export interface ContextProps {
  namespace?: string;
  createConfigMap?: (value: ConfigMapRequest) => Promise<any>;
}

const Context: React.Context<ContextProps> = createContext({});

export default Context;

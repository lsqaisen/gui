import {createContext} from 'react';
import {NlbRequest} from 'api/type/app';

export interface ContextProps {
  namespace?: string;
  createNlb?: (value: NlbRequest) => Promise<any>;
  getApps?: () => Promise<any>;
  getServices?: () => Promise<any>;
}

const Context: React.Context<ContextProps> = createContext({});

export default Context;

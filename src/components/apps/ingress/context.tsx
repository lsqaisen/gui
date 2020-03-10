import { createContext } from 'react';
import { IngressRequest, ModifyIngressRulesType } from 'api/type/app';

export interface ContextProps {
  namespace?: string;
  createIngress?: (value: IngressRequest) => Promise<any>;
  editIngressRules?: (value: ModifyIngressRulesType) => Promise<any>;
  getSecrets?: () => Promise<any>;
  getServices?: () => Promise<any>;
}

const Context: React.Context<ContextProps> = createContext({});

export default Context;

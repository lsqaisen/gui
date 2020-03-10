import { createContext } from 'react';
import { SecretRequest } from 'api/type/app';

export interface ContextProps {
  namespace?: string;
  createSecret?: (value: SecretRequest) => Promise<any>;
}

const Context: React.Context<ContextProps> = createContext({});

export default Context;

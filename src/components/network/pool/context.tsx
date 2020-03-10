import { createContext } from 'react';
import { addPoolRequest } from 'api/type/network';

export interface ContextProps {
  createPool?: (value: addPoolRequest) => Promise<any>;
}

const Context: React.Context<ContextProps> = createContext({});

export default Context;

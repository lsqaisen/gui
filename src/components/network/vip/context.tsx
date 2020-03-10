import { createContext } from 'react';
import { addVipRequest } from 'api/type/network';

export interface ContextProps {
  getVips?: () => Promise<any>;
  createVip?: (value: addVipRequest) => Promise<any>;
}

const Context: React.Context<ContextProps> = createContext({});

export default Context;

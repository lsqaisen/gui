import {createContext} from 'react';
import {IMenu} from '@/models/menus';
import {IUser} from '@/models/uesr/user';
import {ChangePasswordRequestType} from 'api/type/user';

export interface ContextProps {
  profile?: IUser;
  menus: IMenu[];
  pathname: string;
  logout?: () => Promise<any>;
  modifyPassword?: (data: ChangePasswordRequestType) => Promise<any>;
}

const Context: React.Context<ContextProps> = createContext({
  menus: [] as IMenu[],
  pathname: ''
});

export default Context;

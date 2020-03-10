import { AnyAction } from "redux";

export type ConnectLoading = {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: { [key: string]: boolean };
}

export interface Dispatch<S> {
  <A extends AnyAction>(action: A): Promise<S>;
}
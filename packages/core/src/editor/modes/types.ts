import { Position } from "../behaviors/types";

export interface Mode<T> {
  state: T;
  context: ModeContext;
  finish: (payload: any) => Promise<void>;
  enter: (payload: any) => Promise<void>;
  exit: () => Promise<void>;
}

export interface ModeContext {
  dispatch: (action: string, payload: any) => Promise<void>;
}

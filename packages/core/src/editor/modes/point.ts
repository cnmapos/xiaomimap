import { ModeBase, ModeContext } from "./types";

export type State = {};

export class PointMode implements ModeBase<State> {
  state: T;
  context: ModeContext;
  finish: (payload: any) => Promise<void>;
  enter: (payload: any) => Promise<void>;
  exit: () => Promise<void>;
}

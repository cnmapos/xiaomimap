import { Behavior, Position } from "../behaviors/types";
import { Mode, ModeContext } from "./types";

export abstract class Base<T extends any> implements Mode<T> {
  state: T;
  context: ModeContext;

  constructor(params: {
    state: T;
    context: ModeContext;
    behaviors: Behavior[];
  }) {
    this.state = params.state;
    this.context = params.context;
  }

  async finish(payload: any) {
    return payload;
  }
  async enter(payload: any) {}
  async exit() {}
}

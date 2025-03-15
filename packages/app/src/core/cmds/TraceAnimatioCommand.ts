import { Arg } from "../types";
import {
  CommandIds,
  CommandResponse,
  CommandStatus,
  ICommand,
} from "./ICommand";

export class TraceAnimationGenerateCommand implements ICommand {
  id: string;

  constructor() {
    this.id = CommandIds.TRACE_ANIMATION_GENERATION;
  }

  execute(...args: Arg[]) {
    // TODO: 实现轨迹动画的生成
    return new Promise<CommandResponse>((resolve) => {
      const response: CommandResponse = {
        status: CommandStatus.SUCCESS,
        data: null,
      };
      resolve(response);
    });
  }
}

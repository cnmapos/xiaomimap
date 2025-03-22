// 轨迹动画的命令模块、所有和轨迹动画相关的操作都通过该模块实现
import { Arg, TraceAnimationCommandArg } from "../types";
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

  // 接受的是一个数组、每个数组里头是一个标准的geojson对象、例如 linestring，point，featurecollection
  // 对应的唯一id和其他属性、都放在 properties 里
  execute(...args: TraceAnimationCommandArg[]) {
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

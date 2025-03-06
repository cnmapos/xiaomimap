import { Position } from "../behaviors/types";
import { Mode } from "./types";

export default () => {
  return {
    // 记录数据状态
    state: {
      position: null,
    },
    addPoint: (mode: Mode, position: Position) => {},
    finish: (mode: Mode, payload: any) => {},
  };
};

import { ClickEvent, Dispatch } from "./types";

export default (params: { dispatch: Dispatch }) => {
  const { dispatch } = params;

  return {
    click: (e: ClickEvent) => {
      // 通过e获取经纬度信息
      dispatch("addPoint", e.position);
    },
  };
};

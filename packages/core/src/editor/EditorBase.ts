import { Cartesian3, Cartographic, Math } from 'cesium';
import { IViewer } from '../types';

export abstract class EditorBase {
  protected viewer: IViewer & { _viewer?: any };
  protected defaultStyle: any;
  public onEndCreate: (coordinates: number[] | number[][]) => void = () => {};

  constructor(viewer: IViewer, defaultStyle?: any) {
    this.viewer = viewer;
    this.defaultStyle = defaultStyle || {};
  }

  // 开始创建
  abstract startCreate(customStyle?: any): void;

  // 合并样式
  protected mergeStyles(defaultStyle: any, customStyle: any): any {
    return { ...defaultStyle, ...(customStyle || {}) };
  }

  // 将Cartesian3转换为经纬度
  protected cartesianToDegrees(cartesian: Cartesian3): number[] {
    const cartographic = Cartographic.fromCartesian(cartesian);
    return [
      Math.toDegrees(cartographic.longitude),
      Math.toDegrees(cartographic.latitude),
    ];
  }
}

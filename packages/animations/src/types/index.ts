
import { BillboardEntity, Coordinate, IEntity, IViewer, LineEntity, ModelEntity, PointEntity, PolygonEntity } from '@hztx/core';

export enum AnimationStatus {
  PENDING = 0,
  RUNNING = 1,
  FINISHED = 2,
}

// export interface AnimationTarget {
//   status: AnimationStatus;
//   applyValue(value: any): void;
//   reset(): void;
// }

export enum AnimationCategory {
  ENTER = 'enter',
  EXIT = 'exit',
  REPEAT = 'repeat',
  NEUTER = 'neuter', // 中性的动画、入场、出场、循环动画外的动画、比如相机从A->B没有入场出场一说，轨迹动画也没有这一说
}

export type AnimationTargetConstructorOptions = {
  onBefore?: () => void;
  heading?: number;
};



// 管理所有图层、以及动画的播放暂停
export interface IAnimationController {
  tracks: IAnimationTrack[];
  addTrack(track: IAnimationTrack): void;
  removeTrack(track: IAnimationTrack): void;
  play(): void;
  pause(): void;
  seek(time: number): void;
  reset(): void;
}

// 管理动画要素
export interface IAnimationTrack {
  viewer: IViewer;
  targets: AnimationTarget[];
  run(currentTime: number): void; // 根据时间、判断是否需要调用 target 的getValue
  add(target: AnimationTarget): void;
  remove(target: AnimationTarget): void;
  reset(): void;
  show(): void;
  hide(): void;
}


export type InterpolateFunction = (start: any, end: any, t: number) => any;

export type AnimationTargetConfig = {
  start: number;
  end: number;
  startDelay?: number;
  endDelay?: number;
  style?: {
    [key: string]: any;
  };
  interpolate: InterpolateFunction
}

export type PathAnimationTargetConfig = {
  // 必填项：基础要素、生命周期时间、开始值和结束值
  baseEntity: LineEntity;
  isShowBaseEntity: boolean; // 是否展示基础的 Entity
  start: number;
  end: number;
  startValue: any; // 动画开始值
  endValue: any; // 动画结束时的值

  startDelay?: number;
  endStay?: number;

  onBefore?: () => void;
  onAfter?: () => void;

  model?: {
    uri: string;
    scale?: number;
    positions: Coordinate;
  },
  billboard?: {
    image: string;
    width?: number;
    height?: number,
    positions: Coordinate;
  }
}

export interface AnimationTarget {
  baseEntity: IEntity;
  // interpolate function
  interpolationFn: InterpolateFunction;
  isInKeyframes: (time: number) => boolean; // 传入的时间节点、是否属于动画对象的生命周期内
  // hooks
  onBefore: (e: { viewer: IViewer }) => void;
  onAfter: (e: { viewer: IViewer }) => void;

  // 初始化函数、创建实体等都在这里做
  init(): void;
  // 返回实现动画效果需要的实体数组
  getAnimationEntities(): IEntity[];

  // animation
  status: AnimationStatus;
  startValue: any; // 动画开始值
  endValue: any; // 动画结束时的值
  getValue(time: number): any; // 根据传入的时间、计算value值
  applyValue(value: any): void;
  reset(): void;

  // lifecycle
  start: number;
  end: number;
  startDelay: number;
  endStay: number;
  duration: number;
  category: AnimationCategory;
  setStart(start: number): void;
  setEnd(start: number): void;
  setStartDelay(start: number): void;
  setEndStay(stay: number): void;

  // config, style是比较通用的、所以放在类型定义里，一些特殊的配置、则对应animationTarget自行定义修改方法
  style: any;
  setStyle(style: any): void;

  // common control
  show(): void;
  hide(): void;
  
  // track会控制动画是否开始的状态
  setStatus(status: AnimationStatus): void;
}

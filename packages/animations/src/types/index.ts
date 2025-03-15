
import { Coordinate, IEntity, IViewer } from '@hztx/core';

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
  targets: AnimationTarget[];
  add(target: AnimationTarget): void;
  remove(target: AnimationTarget): void;
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

export type PathAnimationTargetConfig = AnimationTarget & {
  model: {
    uri: string;
    scale?: number;
    positions: Coordinate;
  },
  billboard: {
    image: string;
    width?: number;
    height?: number,
    positions: Coordinate;
  }
}

export interface AnimationTarget {
  baseEntity: IEntity;
  // interpolate function
  interpolate: InterpolateFunction;
  isInKeyframes: (time: number) => boolean; // 传入的时间节点、是否属于动画对象的生命周期内

  // 初始化函数、创建实体等都在这里做
  init(): void;
  getAnimationEntities(): IEntity[];

  // animation
  status: AnimationStatus;
  startValue: any; // 动画开始值
  endValue: any; // 动画结束时的值
  getValue(time: number): any; // 根据传入的时间、计算value值
  applyValue(value: any): void;
  reset(): void;

  // hooks
  onBefore(): void;
  onAfter(): void;

  // lifecycle
  start: number;
  end: number;
  startDelay: number;
  duration: number;
  setStart(start: number): void;
  setEnd(start: number): void;
  setStartDelay(start: number): void;
  setDuration(duration: number): void;

  // config, style是比较通用的、所以放在类型定义里，一些特殊的配置、则对应animationTarget自行定义修改方法
  style: any;
  setStyle(style: any): void;

  // common control
  show(): void;
  hide(): void;
}

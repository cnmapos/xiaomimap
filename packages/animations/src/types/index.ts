
import { IEntity } from '@hztx/core';

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
interface AnimationController {
  tracks: AnimationTrack[];
  addTrack(track: AnimationTrack): void;
  play(): void;
  pause(): void;
  seek(time: number): void;
  reset(): void;
}

// 管理动画要素
interface AnimationTrack {
  targets: AnimationTarget[];
  add(target: AnimationTarget): void;
  show(): void;
  hide(): void;
}

interface AnimationTarget {
  baseEntity: IEntity;

  // interpolate function
  interpolate(start: any, end: any, t: number): any;

  // animation
  status: AnimationStatus;
  applyValue(value: any): void;
  reset(): void;

  // hooks
  onBefore(instance: AnimationTarget): void;
  onAfter(instance: AnimationTarget): void;

  // lifecycle
  start: number;
  end: number;
  startDelay: number;
  endDelay: number;
  setStart(start: number): void;
  setEnd(start: number): void;
  setStartDelay(start: number): void;
  setEndDelay(start: number): void;

  // config, style是比较通用的、所以放在类型定义里，一些特殊的配置、则对应animationTarget自行定义修改方法
  setStyle(style: any): void;
}

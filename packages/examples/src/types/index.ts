export interface IPlayer {
  play: () => void;
  pause: () => void;
  replay: () => void;
  destroy: () => void;

  playIn?: () => void;
  playOut?: () => void;
}

// 动画函数
export enum TimeFunction {
  EASE = 'ease',
}

export type IAnimation = {
  animation_duration: number; // 动画持续时长：秒
  animation_timing_function: TimeFunction; // 动画函数
  animation_delay: number; // 几秒后开始动画
  animation_count: number; // 动画播放次数 Infinity 为无限次
};

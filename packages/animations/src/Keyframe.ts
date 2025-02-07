export type KeyframeOptions = {
  repeat?: true;
  duration?: number;
};

export class Keyframe {
  time: number;
  value: any;
  repeat: boolean;
  duration: number;

  constructor(time: number, value: any, options?: KeyframeOptions) {
    this.time = time; // 时间戳（毫秒）
    this.value = value; // 属性值
    this.repeat = options?.repeat ?? false; // 是否重复
    this.duration = options?.duration ?? 1000; // 动画周期（毫秒）
  }
}

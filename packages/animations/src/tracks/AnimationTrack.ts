import { Keyframe, KeyframeOptions } from '../Keyframe';
import { AnimationTarget } from '../types';

type AniTrackOptions = {
  interpolationFn?: (start: any, end: any, t: number) => any;
};

const TIME_ERROR = 50; // 时间误差，防止时间精度问题导致的误差

export class AnimationTrack {
  private keyframes: Keyframe[];
  targets: AnimationTarget[];

  interpolationFn: (start: any, end: any, t: any) => any;
  constructor(
    target: AnimationTarget | AnimationTarget[],
    options?: AniTrackOptions
  ) {
    this.targets = Array.isArray(target) ? target : [target];
    this.keyframes = []; // 关键帧列表
    this.interpolationFn = options?.interpolationFn || AnimationTrack.lerp; // 插值函数
  }

  isInKeyframes(time: number) {
    if (this.keyframes.length < 2) {
      return false;
    }
    const start = this.keyframes[0],
      end = this.keyframes[this.keyframes.length - 1];
    // 这里加了50毫秒的误差，是为了防止时间精度问题导致的误差
    return time >= start.time && time <= end.time + TIME_ERROR;
  }

  // 添加关键帧
  addKeyframe(time: number, value: any, options?: KeyframeOptions) {
    const keyframe = new Keyframe(time, value, options);
    this.keyframes.push(keyframe);
    this.keyframes.sort((a, b) => a.time - b.time); // 按时间排序
  }

  applyValue(value: any) {
    this.targets.forEach((t) => t.applyValue(value));
  }

  // 获取当前时间的属性值
  getValue(time: number) {
    if (this.keyframes.length === 0) return null;
    if (time <= this.keyframes[0].time) return this.keyframes[0].value;
    if (time >= this.keyframes[this.keyframes.length - 1].time)
      return this.keyframes[this.keyframes.length - 1].value;

    // 找到当前时间所在的关键帧区间
    for (let i = 0; i < this.keyframes.length - 1; i++) {
      const start = this.keyframes[i];
      const end = this.keyframes[i + 1];
      if (time >= start.time && time <= end.time) {
        let t = Math.min((time - start.time) / (end.time - start.time), 1); // 非重复性执行动画
        if (start.repeat) {
          t = Math.min(
            ((time - start.time) % start.duration) / start.duration,
            1
          ); // 重复执行动画
        }
        return this.interpolationFn(start.value, end.value, t); // 插值计算
      }
    }
  }

  reset() {
    this.targets.forEach((t) => t.reset());
  }

  // 线性插值函数
  static lerp(start: any, end: any, t: number) {
    if (typeof start === 'number' && typeof end === 'number') {
      return start + (end - start) * t;
    } else if (Array.isArray(start) && Array.isArray(end)) {
      return start.map((s, i) => s + (end[i] - s) * t);
    } else if (typeof start === 'object' && typeof end === 'object') {
      const result: any = {};
      for (const key in start) {
        result[key] = AnimationTrack.lerp(start[key], end[key], t);
      }
      return result;
    }
    return start;
  }
}

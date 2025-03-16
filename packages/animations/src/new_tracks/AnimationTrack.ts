
// 图层、只负责管理所有 animationTarget，加到数组里面、统一控制 show、hide
import { AnimationTarget, IAnimationTrack } from '../types';

export class AnimationTrack2 implements IAnimationTrack {
  targets: AnimationTarget[] = [];
  constructor(targets: AnimationTarget[]) {
    this.targets = targets;
  }
  add(target: AnimationTarget): void {
    this.targets.push(target);
  }
  remove(target: AnimationTarget): void {
    this.targets = this.targets.filter((item) => {
      return item !== target;
    });
  }
  show(): void {
    this.targets.forEach((target) => {
      target.show();
    })
  }
  hide(): void {
    this.targets.forEach((target) => {
      target.hide();
    })
  }
}

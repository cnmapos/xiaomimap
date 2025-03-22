
// 图层、只负责管理所有 animationTarget，加到数组里面、统一控制 show、hide
import { IViewer } from '@hztx/core';
import { AnimationStatus, AnimationTarget, IAnimationTrack } from '../types';

export class AnimationTrack2 implements IAnimationTrack {
  targets: AnimationTarget[] = [];
  viewer: IViewer;
  constructor(viewer: IViewer, targets: AnimationTarget[]) {
    this.viewer = viewer;
    this.targets = targets;
  }

  run(currentTime: number) {
    this.targets.forEach((animationTarget) => {
      // 如果符合动画时间、则开始动画
      if (animationTarget.isInKeyframes(currentTime)) {
        if (animationTarget.status === AnimationStatus.PENDING) {
          // 调用animationTarget的钩子函数、并修改他的状态
          animationTarget.onBefore({ viewer: this.viewer});
          animationTarget.setStatus(AnimationStatus.RUNNING);
        }
        // 计算animationTarget的新value，并apply
        const value = animationTarget.getValue(currentTime);
        animationTarget.applyValue(value);
      } else if (currentTime > animationTarget.end && animationTarget.status === AnimationStatus.RUNNING) {
        animationTarget.onAfter({ viewer: this.viewer })
        animationTarget.setStatus(AnimationStatus.FINISHED);
      }
    })
  }

  reset() {
    this.targets.forEach((animationTarget) => {
      animationTarget.reset();
    })
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

import { IViewer } from '@hztx/core';
import { IAnimationController, IAnimationTrack } from './types';

// 负责计时、触发动画对象的 applyValue
export class AnimationController implements IAnimationController {
  private animationFrameId?: number;
  // 上一次计时
  private prevTime: number = Date.now();
  currentTime: number = 0;
  isPlaying: boolean = false;
  viewer: IViewer;

  tracks: IAnimationTrack[] = [];

  constructor(viewer: IViewer, tracks: IAnimationTrack[]) {
    this.viewer = viewer; // 这个是core代码中的容器，我们所有动画要素最终都要加到这个容器里面去
    this.tracks = tracks;
  }

  addTrack(track: IAnimationTrack): void {
    this.tracks.push(track);
  }
  removeTrack(track: IAnimationTrack): void {
    this.tracks = this.tracks.filter((item) => {
      return item !== track;
    });
  }

  // 更新动画
  update(deltaTime: number) {
    if (!this.isPlaying) return;

    this.currentTime += deltaTime;
    this.tracks.forEach((track) => {

      track.targets.forEach((animationTarget) => {

        // 如果符合动画时间、则开始动画
        if (animationTarget.isInKeyframes(this.currentTime)) {

          if (this.viewer) {
            // 拿到动画要素提供的需要加入到 viewer 中的实体、然后加入
            const entities = animationTarget.getAnimationEntities();
            entities.forEach((entity) => {
              // 避免重复添加
              if (!this.viewer.entities.contains(entity)) {
                this.viewer.addEntity(entity);
              }
            })
          }

          // 计算animationTarget的新value，并apply
          const value = animationTarget.getValue(this.currentTime);
          animationTarget.applyValue(value);
        }

      })
    });
  }

  // 开始执行动画、开始计时
  private run() {
    if (!this.isPlaying) return;
    this.prevTime = Date.now();
    const updateAnimation = () => {
      const diff = Date.now() - this.prevTime;
      this.update(diff);
      this.animationFrameId = requestAnimationFrame(updateAnimation);
      this.prevTime = Date.now();
    };
    updateAnimation();
  }

  // 重置动画
  reset(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.currentTime = 0;
    this.isPlaying = false;
    this.tracks.forEach((track) => {
      track.targets.forEach((animationTarget) => {
        animationTarget.reset();
      })
    });
  }

  play(): void {
    this.isPlaying = true;
    this.run();
  }
  pause(): void {
    this.isPlaying = false;
  }
  seek(time: number): void {
    this.currentTime = time;
  }
}
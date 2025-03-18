import { IViewer } from '@hztx/core';
import { IAnimationController, IAnimationTrack } from './types';

// 负责计时、触发动画对象的 applyValue
export class AnimationController2 implements IAnimationController {
  private animationFrameId?: number;
  // 上一次计时
  private prevTime: number = Date.now();
  currentTime: number = 0;
  isPlaying: boolean = false;

  tracks: IAnimationTrack[] = [];

  constructor(tracks: IAnimationTrack[]) {
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
      track.run(this.currentTime);
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
      track.reset();
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
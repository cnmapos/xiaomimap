import { AnimationTrack } from './t racks/AnimationTrack';

export class AnimationController {
  private animationFrameId?: number;
  // 上一次计时
  private prevTime: number = Date.now();

  tracks: AnimationTrack[];
  currentTime: number;
  isPlaying: boolean;
  constructor() {
    this.tracks = []; // 动画轨道列表
    this.currentTime = 0; // 当前时间
    this.isPlaying = false; // 是否正在播放
  }

  // 添加动画轨道
  addTrack(track: AnimationTrack) {
    this.tracks.push(track);
  }

  // 更新动画
  update(deltaTime: number) {
    if (!this.isPlaying) return;

    this.currentTime += deltaTime;
    this.tracks.forEach((track) => {
      if (track.isInKeyframes(this.currentTime)) {
        const value = track.getValue(this.currentTime);
        track.applyValue(value);
      }
    });
  }
  // 播放动画
  play() {
    this.isPlaying = true;
    this.run();
  }

  // 暂停动画
  pause() {
    this.isPlaying = false;
  }

  // 跳转到指定时间
  seek(time: number) {
    this.currentTime = time;
  }

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

  reset() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.currentTime = 0;
    this.isPlaying = false;
    this.tracks.forEach((track) => track.reset());
    // this.tracks.length = 0;
  }
}

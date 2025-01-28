export interface Animation {
  duration: number; // 动画持续时间
  update: (progress: number) => void; // 更新动画状态的函数
  start: () => void; // 开始动画的函数
  end: () => void; // 结束动画的函数
}

export interface AnimationSequence {
  animations: Animation[]; // 并发执行的动画
  totalDuration: number; // 该序列的总执行时间
}

export class Animator {
  private sequences: AnimationSequence[] = [];
  private currentSequenceIndex: number = 0;
  private isPaused: boolean = false;
  private startTime: number = 0;
  private pauseTime: number = 0;

  constructor(sequences: AnimationSequence[]) {
    this.sequences = sequences;
  }

  public play() {
    if (this.isPaused) {
      this.isPaused = false;
      this.startTime += performance.now() - this.pauseTime;
      this.run();
    } else {
      this.startTime = performance.now();
      this.run();
    }
  }

  public pause() {
    this.isPaused = true;
    this.pauseTime = performance.now();
  }

  private run() {
    if (this.isPaused) return;

    const currentSequence = this.sequences[this.currentSequenceIndex];
    if (!currentSequence) return;

    const elapsedTime = performance.now() - this.startTime;
    const progress = Math.min(elapsedTime / currentSequence.totalDuration, 1);
    currentSequence.animations.forEach((animation) => {
      const animationProgress = Math.min(elapsedTime / animation.duration, 1);
      if (!animation._started) {
        animation.start();
        animation._started = true;
      }
      animation.update(animationProgress);
    });

    if (progress < 1) {
      requestAnimationFrame(() => this.run());
    } else {
      currentSequence.animations.forEach((animation) => {
        if (animation._started) animation.end();
      });
      this.currentSequenceIndex++;
      if (this.currentSequenceIndex < this.sequences.length) {
        this.startTime = performance.now();
        this.run();
      }
    }
  }
}

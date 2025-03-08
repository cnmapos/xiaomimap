export enum AnimationStatus {
  PENDING = 0,
  RUNNING = 1,
  FINISHED = 2,
}

export interface AnimationTarget {
  status: AnimationStatus;
  applyValue(value: any): void;
  reset(): void;
}

export type AnimationTargetConstructorOptions = {
  onBefore?: () => void;
  heading?: number;
};

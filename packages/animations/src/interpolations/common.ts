// 线性插值函数
export function linearInterpolate(
  start: number,
  end: number,
  t: number
): number {
  return start + (end - start) * t;
}

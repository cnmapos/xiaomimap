// 线性插值函数
export function linearInterpolate(
  start: number,
  end: number,
  t: number
): number {
  return start + (end - start) * t;
}

export function parabolaInterpolate(options?: { height?: number }) {
  return (
    start: [number, number, number?],
    end: [number, number, number?],
    t: number
  ) => {
    const height = options?.height || 0;
    const startX = start[0];
    const startY = start[1];
    const startZ = start[2] || 0;
    const endX = end[0];
    const endY = end[1];
    const endZ = end[2] || 0;
    // 计算插值坐标点
    const x = startX + (endX - startX) * t;
    const y = startY + (endY - startY) * t;
    const z = (1 - t) * startZ + t * endZ;

    // 计算抛物线的中间高度
    const midX = (start[0] + end[0]) / 2;
    const midY = (start[1] + end[1]) / 2;
    const midZ =
      height -
      (Math.pow(x - midX, 2) / Math.pow((end[0] - start[0]) / 2, 2)) * height;
    console.log('parabolaInterpolate', x, y, midZ);

    return [x, y, midZ];
  };
}

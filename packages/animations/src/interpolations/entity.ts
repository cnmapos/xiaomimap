type SlerpFunc = (
  start: [number, number, number], // 经纬度起始坐标 [经度, 纬度]
  end: [number, number, number], // 经纬度结束坐标 [经度, 纬度]
  t: number // 插值因子，范围在 0 到 1 之间
) => [number, number, number];

export function createPointRoamingSlerp(
  wayPoints?: [number, number, number?][],
  options?: {
    toEast?: boolean;
    toNorth?: boolean;
  }
): SlerpFunc {
  wayPoints = wayPoints || [];
  const toEast = options?.toEast || false;
  const toNorth = options?.toNorth || false;

  const slerp = (
    start: [number, number, number],
    end: [number, number, number],
    t: number
  ) => {
    const points = [start, ...wayPoints, end];
    const formatHeight = (height?: number) => {
      return height === undefined ? 0 : height;
    };
    const totalLength = points.reduce((length, point, index) => {
      if (index === 0) return length;
      const prevPoint = points[index - 1];
      const segmentLength = Math.sqrt(
        Math.pow(point[0] - prevPoint[0], 2) +
          Math.pow(point[1] - prevPoint[1], 2) +
          Math.pow(formatHeight(point[2]) - formatHeight(prevPoint[2]), 2)
      );
      return length + segmentLength;
    }, 0);

    const distances: number[] = [0];
    points.forEach((point, index) => {
      if (index === 0) return;
      const prevPoint = points[index - 1];
      const segmentLength = Math.sqrt(
        Math.pow(point[0] - prevPoint[0], 2) +
          Math.pow(point[1] - prevPoint[1], 2) +
          Math.pow(formatHeight(point[2]) - formatHeight(prevPoint[2]), 2)
      );
      distances.push(distances[index - 1] + segmentLength);
    });

    const targetLength = t * totalLength;
    let accumulatedLength = 0;
    let segmentIndex = 0;

    while (
      segmentIndex < distances.length - 1 &&
      distances[segmentIndex + 1] < targetLength
    ) {
      segmentIndex++;
    }

    const segmentStart = points[segmentIndex];
    let segmentEnd = points[segmentIndex + 1];
    const segmentLength = distances[segmentIndex + 1] - distances[segmentIndex];
    const segmentT = (targetLength - distances[segmentIndex]) / segmentLength;

    const endLng =
      segmentEnd[0] < segmentStart[0] && toEast
        ? segmentEnd[0] + 360
        : segmentEnd[0];
    const endLat =
      segmentEnd[1] < segmentStart[1] && toNorth
        ? segmentEnd[1] + 180
        : segmentEnd[1];

    const destLng = segmentStart[0] + (endLng - segmentStart[0]) * segmentT;
    const destLat = segmentStart[1] + (endLat - segmentStart[1]) * segmentT;
    const height =
      formatHeight(segmentStart[2]) +
      (formatHeight(segmentEnd[2]) - formatHeight(segmentStart[2])) * segmentT;
    console.log('createPointRoamingSlerp', height);
    return [
      toEast ? (destLng > 180 ? destLng - 360 : destLng) : destLng,
      toNorth ? (destLat > 90 ? destLat - 180 : destLat) : destLat,
      height,
    ] as [number, number, number];
  };
  return (
    start: [number, number, number], // 经纬度起始坐标 [经度, 纬度]
    end: [number, number, number], // 经纬度结束坐标 [经度, 纬度]
    t: number // 插值因子，范围在 0 到 1 之间
  ) => slerp(start, end, t);
}

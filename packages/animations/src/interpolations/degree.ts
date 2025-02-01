import {
  Cartesian3,
  Cartographic,
  Matrix3,
  Quaternion,
  Math as CMath,
} from 'cesium';
import { linearInterpolate } from './common';

// 球面线性插值函数
export function coordinateSlerp(
  start: [number, number, number], // 经纬度起始坐标 [经度, 纬度]
  end: [number, number, number], // 经纬度结束坐标 [经度, 纬度]
  t: number // 插值因子，范围在 0 到 1 之间
): [number, number, number] {
  // 将经纬度转换为笛卡尔坐标
  const [startLon, startLat, startHeight = 0] = start;
  const [endLon, endLat, endHeight = 0] = end;

  const lon = CMath.lerp(startLon, endLon, t);
  const lat = CMath.lerp(startLat, endLat, t);
  const height = linearInterpolate(startHeight, endHeight, t);

  return [lon, lat, height];
}

// 综合插值函数
export function coordinatesInterpolate(
  start: [number, number, number],
  end: [number, number, number],
  t: number
): [number, number, number] {
  const lonlat = coordinateSlerp(start, end, t);
  const height = linearInterpolate(start[2], end[2], t);
  return [lonlat[0], lonlat[1], height];
}

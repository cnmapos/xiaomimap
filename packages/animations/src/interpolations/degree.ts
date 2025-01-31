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

  const startCartesian = Cartesian3.fromDegrees(
    startLon,
    startLat,
    startHeight
  );
  // 计算经度差异并调整以确保最短路径
  const deltaLon = endLon - startLon;
  const adjustedEndLon = startLon + (((deltaLon + 180) % 360) - 180); // 确保最短路径
  const deltaLat = endLat - startLat;
  const adjustedEndLat = startLat + (((deltaLat + 90) % 180) - 90); // 确保最短路径
  const endCartesian = Cartesian3.fromDegrees(
    adjustedEndLon,
    adjustedEndLat,
    endHeight
  );

  // 使用球面线性插值（Slerp）计算中间点
  const interpolatedCartesian = Cartesian3.lerp(
    startCartesian,
    endCartesian,
    t,
    new Cartesian3()
  );
  // 将笛卡尔坐标转换回经纬度
  const cartographic = Cartographic.fromCartesian(interpolatedCartesian);
  const lon = CMath.toDegrees(cartographic.longitude);
  const lat = CMath.toDegrees(cartographic.latitude);
  const height = Cartesian3.magnitude(interpolatedCartesian) - 6378137.0; // 假设地球半径为 6378137.0

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

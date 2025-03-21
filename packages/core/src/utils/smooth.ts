import { CatmullRomSpline } from 'cesium';
import { Cartesian3, Cartographic, Coordinate } from '../types';
import { HzMath } from './math';

export function smoothLine(path: [number, number, number?][]) {
  const positions = path.map((l) => Cartesian3.fromDegrees(...l));
  const spline = new CatmullRomSpline({
    times: positions.map((_, i) => i),
    points: positions,
  });
  let smoothPoints: Coordinate[] = [];
  for (let i = 0; i <= positions.length * 10; i++) {
    const time = (i / (positions.length * 10)) * (positions.length - 1);
    smoothPoints.push(spline.evaluate(time) as any);
  }
  smoothPoints = smoothPoints.map((p) => {
    // 将Cartesian3对象转换为Degree经纬度
    const cartographic = Cartographic.fromCartesian(p);
    const longitude = HzMath.toDegrees(cartographic.longitude);
    const latitude = HzMath.toDegrees(cartographic.latitude);
    return [longitude, latitude, cartographic.height];
  });

  return smoothPoints;
}

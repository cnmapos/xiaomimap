import {
  Cartesian3,
  CircleGeometry,
  GeometryInstance,
  Material,
  MaterialAppearance,
  Primitive,
} from "cesium";

export function createCirclePrimitive(
  position: [number, number, number?],
  options: { radius?: number; color?: string }
) {
  const { radius = 1000, color = "#FF0" } = options;

  const center = Cartesian3.fromDegrees(...position);
  // 创建圆形几何
  const circleGeometry = new CircleGeometry({
    center: center,
    radius: radius,
    height: 1,
  });

  // 创建几何实例
  const circleInstance = new GeometryInstance({
    geometry: circleGeometry,
  });

  // 创建外观
  const appearance = new MaterialAppearance({
    material: Material.fromType("Color", { color: color }),
    flat: true,
  });

  // 创建Primitive并添加到场景中
  const circlePrimitive = new Primitive({
    geometryInstances: circleInstance,
    appearance: appearance,
    asynchronous: false,
  });

  return circlePrimitive;
}

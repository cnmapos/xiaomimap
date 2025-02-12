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

export const createCanvasText = (
  text: string,
  options?: {
    color?: string;
    position?: "top" | "bottom";
    height?: number;
    width?: number;
  }
) => {
  const { color = "#FFF", position = "top", height = 30 } = options || {};

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  const fontSize = 18;
  canvas.height = height;
  canvas.width = fontSize * text.length;
  context.fillStyle = color; // 设置文字颜色
  context.font = `${fontSize}px Sans-Serif`; // 设置字体和大小
  context.textBaseline = "middle";
  context.fillText(text, 0, height / 2);

  context.beginPath(); // 开始路径
  context.moveTo(0, position === "top" ? height : 0); // 移动到文字底部
  context.lineTo(canvas.width, position === "top" ? height : 0); // 绘制到画布宽度
  context.strokeStyle = color; // 设置线条颜色
  context.lineWidth = 5; // 设置线条宽度
  context.stroke(); // 绘制线条

  return canvas;
};

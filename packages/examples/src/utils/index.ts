import { Cartesian2, Cartographic, defined, Math as CMath } from 'cesium';

export const pixel2Coordinates = (viewer: any, x: number, y: number) => {
  const screenWidth = viewer.scene.canvas.clientWidth;
  const screenHeight = viewer.scene.canvas.clientHeight;
  const startPixel = new Cartesian2(screenWidth / 2, screenHeight / 2);
  const endPixel = new Cartesian2(startPixel.x + x, startPixel.y + y);

  // 将像素坐标转换为世界坐标
  const startWorldPos = viewer.scene.globe.pick(
    viewer.camera.getPickRay(startPixel)!,
    viewer.scene
  );
  const endWorldPos = viewer.scene.globe.pick(
    viewer.camera.getPickRay(endPixel)!,
    viewer.scene
  );

  if (defined(startWorldPos) && defined(endWorldPos)) {
    // 将世界坐标转换为经纬度
    const startCartographic = Cartographic.fromCartesian(startWorldPos);
    const endCartographic = Cartographic.fromCartesian(endWorldPos);

    // 计算经纬度差值（以弧度表示）
    const lonDiff = endCartographic.longitude - startCartographic.longitude;
    const latDiff = endCartographic.latitude - startCartographic.latitude;

    // 将弧度转换为度数
    const lng = CMath.toDegrees(lonDiff);
    const lat = CMath.toDegrees(latDiff);

    return { lng, lat };
  }
};

export const createCanvasImage = (
  imageUrl: string,
  options?: {
    width: number;
    height: number;
    color?: string;
    title?: string;
    fontColor?: string;
    fontPosition?: 'top' | 'bottom';
  }
) => {
  const {
    width = 150,
    height = 100,
    color = '#FFF',
    title = '',
    fontPosition = 'top',
  } = options || {};
  const headerHeight = title ? 30 : 0;
  const borderWidth = 3;
  const totalWidth = width + borderWidth,
    totalHeight = height + headerHeight + borderWidth * 2;
  const fontColor = options?.fontColor || color;
  const canvas = document.createElement('canvas');
  canvas.width = totalWidth;
  canvas.height = totalHeight;
  const context = canvas.getContext('2d')!;

  return new Promise((resolve) => {
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      // 绘制标题
      if (headerHeight) {
        context.fillStyle = fontColor; // 设置文字颜色
        context.font = '18px Sans-Serif'; // 设置字体和大小
        context.textBaseline = 'middle';
        const textWidth = context.measureText(title).width; // 计算文本宽度
        const height =
          fontPosition === 'top'
            ? headerHeight / 2
            : totalHeight - headerHeight / 2;
        context.fillText(title, (totalWidth - textWidth) / 2, height);
      }

      const offsetY = fontPosition === 'top' ? headerHeight : 0;
      context?.drawImage(image, 0, offsetY, width, height);
      // 在这里可以添加边框
      context.strokeStyle = color;
      context.lineWidth = borderWidth;
      context.strokeRect(0, offsetY, width, height);

      resolve(canvas);
    };
  });
};

export const createCanvasText = (
  text: string,
  options?: {
    color?: string;
    position?: 'top' | 'bottom';
    height?: number;
    width?: number;
  }
) => {
  const { color = '#FFF', position = 'top', height = 30 } = options || {};

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  const fontSize = 18;
  canvas.height = height;
  canvas.width = fontSize * text.length;
  context.fillStyle = color; // 设置文字颜色
  context.font = `${fontSize}px Sans-Serif`; // 设置字体和大小
  context.textBaseline = 'middle';
  context.fillText(text, 0, height / 2);

  context.beginPath(); // 开始路径
  context.moveTo(0, position === 'top' ? height : 0); // 移动到文字底部
  context.lineTo(canvas.width, position === 'top' ? height : 0); // 绘制到画布宽度
  context.strokeStyle = color; // 设置线条颜色
  context.lineWidth = 5; // 设置线条宽度
  context.stroke(); // 绘制线条

  return canvas;
};

import {
  CallbackProperty,
  Cartesian2,
  Cartesian3,
  Color,
  Entity,
  Viewer,
} from 'cesium';
import { FabricText, Shadow, StaticCanvas } from 'fabric';

export type textStyleOption = {
  fontFamily?: FabricText['fontFamily'];
  fontSize?: FabricText['fontSize'];
  fontWeight?: FabricText['fontWeight'];
  fontStyle?: FabricText['fontStyle'];
  color?: FabricText['fill'];
  opacity?: number;
  backgroundColor?: FabricText['backgroundColor'];
  borderColor?: FabricText['stroke'];
  borderWidth?: FabricText['strokeWidth'];
  textAlign?: FabricText['textAlign'];
  lineHeight?: FabricText['lineHeight'];
  underline?: FabricText['underline'];
  linethrough?: FabricText['linethrough'];
  pixelOffset: FabricText['offsets'];
  shadow?: { color: string; offsetX: number; offsetY: number; blur: number };
};

export enum TextAnimationType {
  FADE = 'fadeIn',
}

type TextOptions = {
  text: string;
  textStyle: textStyleOption;
  animationType: TextAnimationType;
};

type Position = number[];

export class TextEntity {
  text: string;
  textStyle: textStyleOption;
  position: Position;
  entity: Entity;

  constructor(position: Position, options: TextOptions) {
    this.position = position;
    const { text = '', textStyle } = options;
    const { offset = [0, 0], ...restStyle } = textStyle;

    this.text = text;
    this.textStyle = textStyle;

    const { width, height, dataUrl } = this.renderTextToImage(text, restStyle);
    const pos = Cartesian3.fromDegrees(...position);
    this.entity = new Entity({
      position: pos,
      billboard: {
        image: dataUrl,
        width,
        height,
        pixelOffset: new Cartesian2(...offset),
        color: new Color(
          1,
          1,
          1,
          textStyle.opacity !== undefined ? textStyle.opacity : 1
        ),
      },
    });
  }

  renderTextToImage(text: string, styleOptions: textStyleOption) {
    // 创建一个 Fabric canvas 实例
    const canvas = new StaticCanvas();
    canvas.backgroundColor = styleOptions.backgroundColor || 'rgba(0,0,0,0)';

    // 设置文本样式
    const textObject = new FabricText(text, {
      fontFamily: styleOptions.fontFamily || 'Arial',
      fontSize: styleOptions.fontSize || 30,
      fontWeight: styleOptions.fontWeight || 'normal',
      fontStyle: styleOptions.fontStyle || 'normal',
      fill: styleOptions.color || 'black',
      stroke: styleOptions.borderColor || 'black', // 使用 stroke 来模拟边框颜色
      strokeWidth: styleOptions.borderWidth || 0,
      textAlign: styleOptions.textAlign || 'left',
      lineHeight: styleOptions.lineHeight || 1.2,
      underline: styleOptions.underline || false,
      linethrough: styleOptions.linethrough || false,
      shadow: styleOptions.shadow ? new Shadow(styleOptions.shadow) : null,
    });

    // 计算文本对象的实际尺寸
    textObject.set({ left: 0, top: 0 }); // 先将文本放到画布的 (0,0) 位置以计算尺寸
    const { width, height } = textObject.getBoundingRect();

    // 根据文本的尺寸设置 canvas 的宽度和高度
    canvas.setWidth(width + 4); // 添加一些间距
    canvas.setHeight(height + 4); // 添加一些间距

    textObject.set({ left: 2, top: 2 });

    // 将文本对象添加到 canvas 中
    canvas.add(textObject);

    // 将 canvas 转为图像
    const dataUrl = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
    });

    return {
      dataUrl,
      width: canvas.width,
      height: canvas.height,
    };
  }
}

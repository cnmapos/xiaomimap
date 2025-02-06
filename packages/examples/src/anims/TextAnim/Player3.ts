import { Cartesian3, Viewer } from 'cesium';
import { IPlayer } from '../../types';
import { FabricText, Shadow, StaticCanvas } from 'fabric';

export type textStyleOption = {
  fontFamily?: FabricText['fontFamily'];
  fontSize?: FabricText['fontSize'];
  fontWeight?: FabricText['fontWeight'];
  fontStyle?: FabricText['fontStyle'];
  color?: FabricText['fill'];
  backgroundColor?: FabricText['backgroundColor'];
  borderColor?: FabricText['stroke'];
  borderWidth?: FabricText['strokeWidth'];
  textAlign?: FabricText['textAlign'];
  lineHeight?: FabricText['lineHeight'];
  underline?: FabricText['underline'];
  linethrough?: FabricText['linethrough'];
  shadow?: { color: string; offsetX: number; offsetY: number; blur: number };
};

enum TextAnimation {
  JUMP,
}

type TextOptions = {
  text: string;
  textStyle: textStyleOption;
  animationType?: TextAnimation;
};

export class TextAnimPlayer implements IPlayer {
  text: string;
  textStyle: textStyleOption;
  id: string;

  constructor(
    private viewer: Viewer,
    private coordinates: [number, number],
    options: TextOptions
  ) {
    const { text = '', textStyle } = options;

    this.id = new Date().getTime() + '' + Math.random();

    this.text = text;
    this.textStyle = textStyle;

    const { width, height, dataUrl } = this.renderTextToImage(text, textStyle);
    const position = Cartesian3.fromDegrees(...coordinates);
    viewer.entities.add({
        name: this.id,
        position: position,
        billboard: {
          image: dataUrl,
          width,
          height,
        },
      });
  }

  destroy() {
    this.viewer.entities.removeById(this.id);
  };
  playIn() {};
  playOut() {};

  play() {}
  pause() {}
  replay() {}

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
      stroke: styleOptions.borderColor || 'black',  // 使用 stroke 来模拟边框颜色
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
    canvas.setWidth(width); // 添加一些间距
    canvas.setHeight(height); // 添加一些间距
  
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

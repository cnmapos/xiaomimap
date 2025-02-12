import { CallbackProperty, Cartesian3, Color, Viewer } from 'cesium';
import { IPlayer } from '../../types';
import { FabricText, Shadow, StaticCanvas } from 'fabric';
import {Easing, Tween} from '@tweenjs/tween.js'


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

export enum TextAnimation {
  FADEIN = 'fadeIn',
  FADEOUT = 'fadeOut',
}

type TextOptions = {
  text: string;
  textStyle: textStyleOption;
  inType?: {
    from: any, // 不同的动画类型有不同的from和to，比如fadeIn和fadeOut就是透明度，是数字
    to: any,
    animationType: TextAnimation,
    duration: number,
  };
  outType?: {
    from: any, // 不同的动画类型有不同的from和to，比如fadeIn和fadeOut就是透明度，是数字
    to: any,
    animationType: TextAnimation,
    duration: number,
  };
};

export class TextAnimPlayer implements IPlayer {
  text: string;
  textStyle: textStyleOption;
  id: string;
  inType?: TextOptions['inType'];
  outType?: TextOptions['inType'];
  ety: any;

  constructor(
    private viewer: Viewer,
    private coordinates: [number, number],
    options: TextOptions
  ) {
    const { text = '', textStyle } = options;

    if (options.inType) {
      this.inType = options.inType;
    }
    if (options.outType) {
      this.outType = options.outType;
    }

    this.id = new Date().getTime() + '' + Math.random();

    this.text = text;
    this.textStyle = textStyle;

    const { width, height, dataUrl } = this.renderTextToImage(text, textStyle);
    const position = Cartesian3.fromDegrees(...coordinates);
    this.ety = viewer.entities.add({
      name: this.id,
      position: position,
      billboard: {
        image: dataUrl,
        width,
        height,
        color: options.inType ? new Color(1,1,1, options.inType.from) : new Color(1,1,1),
      },
    });
    if (options.inType) {
      this.playIn(); // 默认就执行一次入场动画
    }
  }

  destroy() {
    this.viewer.entities.removeById(this.id);
  }
  playIn() {
    // 入场动画
    if (this.inType?.animationType === TextAnimation.FADEIN) {
      this.fade(this.inType.from, this.inType.to, this.inType.duration, Easing.Quadratic.In);
    }
  }
  playOut() {
    // 出场动画
    if (this.outType?.animationType === TextAnimation.FADEOUT) {
      this.fade(this.outType.from, this.outType.to, this.outType.duration, Easing.Quadratic.Out);
    }
  }

  // 淡入淡出类动画，修改透明度
  fade(from: number, to: number, duration: number = 1000, easingFunction: ((amount: number) => number) | undefined) {
    // 动态更新文字的透明度、由0->1
    const coords = {x: from, y: 0} // Start at (0, 0)
    const tween = new Tween(coords) // Create a new tween that modifies 'coords'.
      .to({x: to}, duration) // Move to (300, 200) in 1 second.
      .easing(easingFunction) // Use an easing function to make the animation smooth.
      .onUpdate((object) => {
        this.ety.billboard.color = new Color(1,1,1, object.x)
      })
      .start() // Start the tween immediately.

    animate()
    function animate() {
      requestAnimationFrame(animate)
      tween.update()
    }
  }

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

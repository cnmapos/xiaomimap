import {
  Cartesian3,
  Color,
  Entity,
  HorizontalOrigin,
  VerticalOrigin,
} from 'cesium';
import { AnimationTarget } from '../types';

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
//   inType?: {
//     from: any, // 不同的动画类型有不同的from和to，比如fadeIn和fadeOut就是透明度，是数字
//     to: any,
//     animationType: TextAnimation,
//     duration: number,
//   };
//   outType?: {
//     from: any, // 不同的动画类型有不同的from和to，比如fadeIn和fadeOut就是透明度，是数字
//     to: any,
//     animationType: TextAnimation,
//     duration: number,
//   };
};


// 新增 AnimationTarget 类
export class TextAnimationTarget implements AnimationTarget {
  entity: Entity;

  constructor(entity: Entity) {
    this.entity = entity;
  }
  reset(): void {}

  // 更新实体的属性值, value就是改变的值
  applyValue(value: any) {
    if (this.entity.billboard?.color) {
        this.entity.billboard.color = new Color(1,1,1, value);
    }
  }
}

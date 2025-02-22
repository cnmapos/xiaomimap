import {
  Cartesian3,
  Color,
  Entity,
  HorizontalOrigin,
  VerticalOrigin,
} from 'cesium';
import { AnimationTarget } from '../types';
import { createCanvasText } from '@hztx/core';

type TextTagAnimationTargetOptions = {
  offset?: [number, number, number];
  align?: 'top' | 'bottom';
  color?: string;
  title: string;
  height?: number;
};

// 新增 AnimationTarget 类
export class TextTagAnimationTarget implements AnimationTarget {
  entity: Entity; // Cesium 实体
  lineEntity: Entity;
  billboardEntity: Entity;

  private color: string;

  constructor(entity: Entity, options: TextTagAnimationTargetOptions) {
    const {
      offset = [50, 50, 100],
      align = 'top',
      color = '#FFF',
      title,
      height = 30,
    } = options;
    this.entity = entity;
    this.color = color;

    this.entity.point.color?.setValue(
      Color.fromCssColorString(color).withAlpha(0)
    );
    const position = entity.position?.getValue() as any as Cartesian3;
    const offsetY = align === 'top' ? offset[1] : -offset[1];
    const imagePosition = Cartesian3.clone(position);
    // imagePosition.x += offset[0];
    // imagePosition.y += offsetY;
    imagePosition.z += offset[2];

    this.lineEntity = new Entity({
      polyline: {
        positions: [position, imagePosition],
        width: 2,
        material: Color.fromCssColorString(color).withAlpha(0),
      },
    });

    const canvasImage = createCanvasText(title, {
      color: color,
      position: align,
      height: 30,
    });
    this.billboardEntity = new Entity({
      position: imagePosition,
      billboard: {
        scale: 0,
        image: canvasImage.toDataURL(), // 使用canvas的dataURL作为图像
        verticalOrigin:
          align === 'top' ? VerticalOrigin.BOTTOM : VerticalOrigin.TOP,
        horizontalOrigin:
          offset[0] >= 0 ? HorizontalOrigin.LEFT : HorizontalOrigin.RIGHT,
        // pixelOffset: new Cartesian2(0, -40),
      },
    });
  }
  reset(): void {}

  // 更新实体的属性值
  applyValue(value: any) {
    if (value < 0.5) {
      this.entity.point?.color?.setValue(
        Color.fromCssColorString(this.color).withAlpha(value * 2)
      );
      this.lineEntity.polyline?.material?.color?.setValue(
        Color.fromCssColorString(this.color).withAlpha(value * 2)
      );
    } else {
      this.billboardEntity.billboard.scale = (value - 0.5) * 2;
    }
  }
}

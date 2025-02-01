import {
  CallbackProperty,
  Cartesian3,
  Entity,
  HeadingPitchRoll,
  Quaternion,
} from 'cesium';
import { AnimationTarget } from '../types';

export class PointRoamingAnimationTarget implements AnimationTarget {
  private entity: Entity; // 假设 Entity 类型
  private lineEntity: Entity;
  private positions: Cartesian3[] = [];

  constructor(entity: Entity, lineEntity: Entity) {
    this.entity = entity;
    this.lineEntity = lineEntity;

    this.lineEntity.polyline.positions = new CallbackProperty((e, result) => {
      if (this.positions.length < 2) {
        return this.positions; // 如果位置不足，返回当前的位置
      }

      // TODO: 通过billboard.alignedAxis来实时更新entity的朝向，让其始终沿着轨迹方向行驶。
      const direction = Cartesian3.subtract(
        this.positions.at(-1),
        this.positions.at(-2),
        new Cartesian3()
      );
      this.entity.billboard.alignedAxis = Cartesian3.normalize(
        direction,
        new Cartesian3()
      );

      return this.positions;
    }, false);
  }

  applyValue(value: [number, number, number]): void {
    const position = Cartesian3.fromDegrees(...value);
    const lastPosition = this.positions.at(-1);
    if (!lastPosition || !Cartesian3.equals(position, lastPosition)) {
      this.positions.push(position);
      this.entity.position = position;
    }
  }

  reset(): void {
    this.positions = [];
  }
}

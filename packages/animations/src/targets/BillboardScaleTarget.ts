import { Entity } from 'cesium';
import { AnimationStatus, AnimationTarget } from '../types';

export class BillboardScaleTarget implements AnimationTarget {
  entity: Entity;

  constructor(entity: Entity) {
    this.entity = entity;
    this.status = AnimationStatus.PENDING;
  }
  status: AnimationStatus;
  reset(): void {}

  // 更新实体的属性值, value就是改变的值
  applyValue(value: any) {
    if (this.entity.billboard) {
      this.entity.billboard.scale = value;
    }
  }
}

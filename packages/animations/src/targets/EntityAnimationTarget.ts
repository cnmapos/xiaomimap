import { AnimationTarget } from './types';

// 新增 AnimationTarget 类
export class EntityAnimationTarget implements AnimationTarget {
  entity: any; // Cesium 实体
  propertyName: string;

  constructor(entity: any, propertyName: string) {
    this.entity = entity;
    this.propertyName = propertyName;
  }

  // 更新实体的属性值
  applyValue(value: any) {
    console.log(`Apply ${this.propertyName}:`, value);
    // 这里可以根据 propertyName 更新 Cesium 实体的属性
    this.entity[this.propertyName] = value;
  }
}

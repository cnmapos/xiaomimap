import { AnimationTarget } from '../types';

// 新增 AnimationTarget 类
export class UniformAnimationTarget implements AnimationTarget {
  primitive: any; // Cesium 实体
  uniformNames: string[] = [];

  constructor(primitive: any, uniformNames: string[]) {
    this.primitive = primitive;
    this.uniformNames = uniformNames;
  }
  reset(): void {
    throw new Error('Method not implemented.');
  }

  // 更新实体的属性值
  applyValue(value: any) {
    const material = this.primitive.appearance.material;
    if (material?.uniforms) {
      this.uniformNames.forEach((name) => {
        material.uniforms[name] = value;
      });
    }
  }
}

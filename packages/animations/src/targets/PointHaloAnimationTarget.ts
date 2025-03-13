import {
  CircleGeometry,
  Color,
  GeometryInstance,
  Material,
  MaterialAppearance,
  Primitive,
} from 'cesium';
import {
  AnimationStatus,
  AnimationTarget,
  AnimationTargetConstructorOptions,
} from '../types';

export class PointHaloAnimationTarget implements AnimationTarget {
  innerPrimitive: Primitive;
  outPrimitive: Primitive;
  private onBefore?: () => void;

  constructor(
    primitive: Primitive,
    options?: AnimationTargetConstructorOptions
  ) {
    this.status = AnimationStatus.PENDING;
    this.onBefore = options?.onBefore;
    const [innerPrimitive, outPrimitive] = this.createHaloEffect(primitive);
    this.innerPrimitive = innerPrimitive;
    this.outPrimitive = outPrimitive;
  }
  status: AnimationStatus;
  applyValue(value: any): void {
    if (this.status === AnimationStatus.PENDING) {
      this.onBefore?.();
      this.status = AnimationStatus.RUNNING;
    }
    this.innerPrimitive.appearance.material.uniforms.radius = value;
    this.outPrimitive.appearance.material.uniforms.radius = (value + 0.4) % 1;
  }
  reset(): void {}

  private createHaloEffect(primitive: Primitive) {
    const originalMaterial = primitive.appearance.material;
    const color = originalMaterial.uniforms.color;

    primitive.appearance.material = this.createHaloShader({
      color,
      power: 1.0,
    });
    const geometryInstances = primitive.geometryInstances as GeometryInstance;
    const geometry = geometryInstances.geometry as CircleGeometry;

    const outPrimitive = new Primitive({
      geometryInstances: new GeometryInstance({
        geometry: CircleGeometry.createGeometry(geometry)!,
        attributes: {},
      }),
      appearance: new MaterialAppearance({
        material: this.createHaloShader({ color, power: 1.0 }),
        flat: true,
      }),
      asynchronous: false,
    });

    return [primitive, outPrimitive];
  }

  private createHaloShader(options?: { color?: string; power?: number }) {
    const color = Color.fromCssColorString(options?.color || '#F00');
    const glowPower = options?.power || 0.8;
    return new Material({
      fabric: {
        type: 'Glow',
        uniforms: {
          color: color,
          glowPower: glowPower,
          radius: 0.0, // 第一个圆环的半径
        },
        source: `
          uniform vec4 color;
          uniform float glowPower;
          uniform float radius; 
          
          czm_material czm_getMaterial(czm_materialInput materialInput) {
              czm_material material = czm_getDefaultMaterial(materialInput);
              vec2 st = materialInput.st;
              float dist = distance(st, vec2(0.5)); // 计算当前点到中心的距离
              
              // 计算第一个圆环的发光效果
              float glow1 = smoothstep(radius - 0.2, radius, dist);
              float glow2 = smoothstep(radius , radius + 0.2, dist);
              float glow = (glow1 - glow2); // 第一个圆环的淡入效果

              
              material.diffuse = color.rgb; // 根据距离调整颜色
              material.alpha = glow * glowPower; // 根据距离调整透明度
              return material;
          }
          `,
      },
    });
  }
}

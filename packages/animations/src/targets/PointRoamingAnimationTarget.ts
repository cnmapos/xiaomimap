import {
  CallbackProperty,
  Cartesian3,
  Cartographic,
  Entity,
  HeadingPitchRoll,
  Quaternion,
  Math as CMath,
  Transforms,
  Matrix4,
} from 'cesium';
import {
  AnimationStatus,
  AnimationTarget,
  AnimationTargetConstructorOptions,
} from '../types';

export class PointRoamingAnimationTarget implements AnimationTarget {
  private entity: Entity; // 假设 Entity 类型
  private lineEntity: Entity;
  private positions: Cartesian3[] = [];
  private onBefore?: () => void;

  status: AnimationStatus;

  constructor(
    entity: Entity,
    lineEntity: Entity,
    options?: AnimationTargetConstructorOptions
  ) {
    this.status = AnimationStatus.PENDING;
    this.entity = entity;
    this.lineEntity = lineEntity;
    this.onBefore = options?.onBefore;
    const originHeading = options?.heading || 0;

    this.lineEntity.polyline.positions = new CallbackProperty((e, result) => {
      if (this.positions.length < 2) {
        return this.positions; // 如果位置不足，返回当前的位置
      }

      const prev = this.positions.at(-2)!;
      const cur = this.positions.at(-1)!;

      // TODO: 通过billboard.alignedAxis来实时更新entity的朝向，让其始终沿着轨迹方向行驶。
      const direction = Cartesian3.subtract(cur, prev, new Cartesian3());

      if (this.entity.billboard) {
        this.entity.billboard.alignedAxis = Cartesian3.normalize(
          direction,
          new Cartesian3()
        );
      } else if (this.entity.model) {
        const ndirection = Cartesian3.normalize(direction, new Cartesian3());
        const enuMatrix = Transforms.eastNorthUpToFixedFrame(cur);
        const inverseMatrix = Matrix4.inverse(enuMatrix, new Matrix4());
        const directionENU = Matrix4.multiplyByPointAsVector(
          inverseMatrix,
          ndirection,
          new Cartesian3()
        );

        // 3. 计算航向角和俯仰角
        const x = directionENU.x; // 东分量
        const y = directionENU.y; // 北分量
        const z = directionENU.z; // 天分量

        // 航向角：从正东方向顺时针旋转到投影方向的角度（弧度）
        let heading = -Math.atan2(y, x);
        if (heading < 0) heading += 2 * Math.PI; // 确保角度在 0~2π 范围内

        // 俯仰角：方向向量与水平面的夹角（弧度）
        const pitch = Math.asin(z);

        // 4. 创建 HeadingPitchRoll 对象
        const hpr = new HeadingPitchRoll(heading, pitch, 0);
        console.log('heading', CMath.toDegrees(heading));

        // 将方向转换为四元数（基于起点的 ENU 坐标系）
        const orientation = Transforms.headingPitchRollQuaternion(cur, hpr);

        this.entity.orientation = new CallbackProperty(
          () => orientation,
          false
        );
      }

      return this.positions;
    }, false);
  }

  applyValue(value: [number, number, number]): void {
    if (this.status === AnimationStatus.PENDING) {
      this.onBefore?.();
      this.status = AnimationStatus.RUNNING;
    }
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

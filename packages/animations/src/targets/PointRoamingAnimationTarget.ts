import {
  CallbackProperty,
  Cartesian3,
  Cartographic,
  Entity,
  HeadingPitchRoll,
  Quaternion,
  Math as CMath,
  Transforms,
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
      // TODO: 通过billboard.alignedAxis来实时更新entity的朝向，让其始终沿着轨迹方向行驶。
      const direction = Cartesian3.subtract(
        this.positions.at(-1),
        this.positions.at(-2),
        new Cartesian3()
      );
      // console.log('direction', direction.x, direction.y, direction.z);

      const prev = this.positions.at(-2);
      const cur = this.positions.at(-1);
      const preVC = Cartographic.fromCartesian(prev);
      const curVC = Cartographic.fromCartesian(cur);
      // console.log(
      //   'preVC',
      //   CMath.toDegrees(preVC.longitude),
      //   CMath.toDegrees(preVC.latitude)
      // );
      // console.log(
      //   'curVC',
      //   CMath.toDegrees(curVC.longitude),
      //   CMath.toDegrees(curVC.latitude)
      // );

      if (this.entity.billboard) {
        this.entity.billboard.alignedAxis = Cartesian3.normalize(
          direction,
          new Cartesian3()
        );
      } else if (this.entity.model) {
        // console.log(
        //   'heading ps',
        //   -(Math.atan2(direction.y, direction.x) + CMath.PI)
        // );
        const heading =
          -(Math.atan2(direction.y, direction.x) + CMath.PI_OVER_TWO) +
          originHeading;
        console.log('heading: ', CMath.toDegrees(heading));

        const horizontalDistance = Math.sqrt(
          direction.x * direction.x + direction.y * direction.y
        );
        const pitch = Math.atan2(-direction.z, horizontalDistance);
        const hpr = new HeadingPitchRoll(heading, 0, 0);
        const orientation = Transforms.headingPitchRollQuaternion(
          this.positions.at(-1),
          hpr
        );
        this.entity.orientation = orientation;
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

import { IEntity, LineEntity, CallbackProperty, Cartesian3, Cartographic, Transforms, Math, HeadingPitchRoll } from '@hztx/core';
import { linearInterpolate } from '../interpolations/common';
import { AnimationStatus, AnimationTarget, AnimationTargetConfig, InterpolateFunction, PathAnimationTargetConfig } from '../types';

const TIME_ERROR = 50; // 时间误差，防止时间精度问题导致的误差

class PathAnimationTarget implements AnimationTarget {
  status: AnimationStatus = AnimationStatus.PENDING;

  // 基础线要素
  baseEntity: LineEntity; // 基础线要素、只是用来继承他的一些样式和属性、动画用到的实体另外实例化
  lineEntity: LineEntity | null = null; // 线要素
  modelEntity: IEntity | null = null; // 模型对象

  private positions: Cartesian3[] = [];

  start: number = 0;
  end: number = 0; 
  startDelay: number = 0;
  endDelay: number = 0;
  style: any = {};
  model: PathAnimationTargetConfig['model'] = {
    uri: '',
    scale: 100,
    position: [],
  }

  interpolate: InterpolateFunction = linearInterpolate; // 默认是xx插值函数

  isInLifecycle(time: number): boolean {
    // 这里加了50毫秒的误差，是为了防止时间精度问题导致的误差
    return time >= this.start + this.startDelay && time <= this.end - this.endDelay + TIME_ERROR;
  }

  isInKeyframes(time: number): boolean {
    // 这里加了50毫秒的误差，是为了防止时间精度问题导致的误差
    return time >= this.start && time <= this.end + TIME_ERROR;
  }

  constructor(path: any, config: PathAnimationTargetConfig) {
    this.baseEntity = path;
    Object.assign(this, config);
    this.init();
  }

  // 动画初始化
  init() {
    // 创建动画相关要素、比如线要素、和模型要素
    const baseStyle = this.baseEntity.getStyle();
    const positions = this.baseEntity.positions;

    // this.interpolate = createPointRoamingSlerp()

    // 创建线实体
    this.lineEntity = new LineEntity({
      positions: [...positions]
    });
    this.lineEntity.setStyle(baseStyle);

    // 创建跟随的模型
    this.modelEntity = new ModelEntity({
      ...this.model,
    })

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

      if (this.modelEntity.billboard) {
        this.modelEntity.billboard.alignedAxis = Cartesian3.normalize(
          direction,
          new Cartesian3()
        );
      } else if (this.modelEntity.model) {
        const heading =
          -(Math.atan2(direction.y, direction.x) + Math.PI_OVER_TWO) +
          originHeading;
        console.log('heading: ', Math.toDegrees(heading));

        const horizontalDistance = Math.sqrt(
          direction.x * direction.x + direction.y * direction.y
        );
        const pitch = Math.atan2(-direction.z, horizontalDistance);
        const hpr = new HeadingPitchRoll(heading, 0, 0);
        const orientation = Transforms.headingPitchRollQuaternion(
          this.positions.at(-1),
          hpr
        );
        this.modelEntity.orientation = orientation;
      }

      return this.positions;
    }, false);

  }

  // 根据传入的时间、计算新的value值
  getValue(time: number): any {
    
    return;
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
      this.modelEntity.position = position;
    }
  }

  onBefore(): void {
    
  }

  onAfter(): void {
    
  }

  reset(): void {
    this.positions = [];
  }

  setStart(start: number): void {
    this.start = start;
  }

  setEnd(end: number): void {
    this.end = end;
  }

  setStartDelay(delay: number): void {
    this.startDelay = delay;
  }

  setEndDelay(delay: number): void {
    this.endDelay = delay;
  }

  setStyle(style: any): void {
  }

  show(): void {
  }

  hide(): void {
  }
}
import { IEntity, LineEntity, CallbackProperty, Cartesian3, Cartographic, Transforms, Math as CMath, HeadingPitchRoll, IViewer, ModelEntity, BillboardEntity, Coordinate } from '@hztx/core';
import { linearInterpolate } from '../interpolations/common';
import { AnimationStatus, AnimationTarget, AnimationTargetConfig, InterpolateFunction, PathAnimationTargetConfig } from '../types';
import { createPointRoamingSlerp } from '../interpolations';

const TIME_ERROR = 50; // 时间误差，防止时间精度问题导致的误差

class PathAnimationTarget implements AnimationTarget {
  status: AnimationStatus = AnimationStatus.PENDING;

  // 基础线要素
  baseEntity: LineEntity; // 基础线要素、只是用来继承他的一些样式和属性、动画用到的实体另外实例化

  // 保存线路坐标
  private positions: Cartesian3[] = [];

  start: number = 0; // 时间点， 生命周期、新增动画要素时间
  end: number = 0; // 时间点，生命周期、要素删除时间
  startDelay: number = 0; // 动画开始等待时长，在生命周期内、动画需要等几秒后才开始
  duration: number = 0; // 动画持续时长
  startValue!: Coordinate;
  endValue!: Coordinate;

  style: any = {};
  model!: PathAnimationTargetConfig['model'];
  billboard!: PathAnimationTargetConfig['billboard'];

  interpolate: InterpolateFunction = linearInterpolate; // 默认是xx插值函数

  viewer: IViewer;
  lineEntity!: LineEntity;
  modelEntity!: ModelEntity;
  billboardEntity!: BillboardEntity;

  
  isInKeyframes (time: number): boolean {
    return time >= this.start && time <= this.end + TIME_ERROR;
    // 这里加了50毫秒的误差，是为了防止时间精度问题导致的误差
  }


  constructor(viewer: IViewer, path: any, config: PathAnimationTargetConfig) {
    this.viewer = viewer;
    this.baseEntity = path;
    Object.assign(this, config);
    this.init();
  }

  // 动画初始化, 根据postions变化、计算模型位置、和更新线实体长度
  init() {
    // 创建动画相关要素、比如线要素、和模型要素
    const baseStyle = this.baseEntity.getStyle();
    const positions = this.baseEntity.positions;

    // 初始化动画开始值、和结束时的值
    this.startValue = positions[0];
    this.endValue = positions[positions.length - 1];

    this.interpolate = createPointRoamingSlerp(positions.slice(1, -1))

    // 创建线实体
    this.lineEntity = new LineEntity({
      positions: [...positions]
    });
    this.lineEntity.setStyle(baseStyle);

    if (this.model) {
      // 创建跟随的模型
      this.modelEntity = new ModelEntity({
        ...this.model,
      })
    }

    if (this.billboard) {
      this.billboardEntity = new BillboardEntity({
        ...this.billboard
      })
    }
    

    if (this.lineEntity.polyline) {
      this.lineEntity.polyline.positions = new CallbackProperty((e, result) => {
        if (this.positions.length < 2) {
          return this.positions; // 如果位置不足，返回当前的位置
        }

        // TODO: 通过billboard.alignedAxis来实时更新entity的朝向，让其始终沿着轨迹方向行驶。
        const direction = Cartesian3.subtract(
          this.positions[this.positions.length - 1],
          this.positions[this.positions.length - 2], 
          new Cartesian3()
        );
        // 如果轨迹动画用的图片、则 修改图片的角度
        if (this.billboardEntity?.billboard) {
          this.billboardEntity.billboard.alignedAxis = Cartesian3.normalize(
            direction,
            new Cartesian3()
          );
        } else if (this.modelEntity.model) {
          // 模型角度计算更新
          const heading =
            -(Math.atan2(direction.y, direction.x) + CMath.PI_OVER_TWO);
          console.log('heading: ', CMath.toDegrees(heading));

          const hpr = new HeadingPitchRoll(heading, 0, 0);
          const orientation = Transforms.headingPitchRollQuaternion(
            this.positions[this.positions.length - 1],
            hpr
          );
          this.modelEntity.orientation = orientation;
        }

        return this.positions;
      }, false);
    }
  }

  // 提供给外界、告知本动画对应的实体有哪些，用于让 animationControler 把我们的动画相关实体添加到viewer中
  getAnimationEntities() {
    if (this.lineEntity) {
      const arr: IEntity[] = [this.lineEntity];
      if (this.modelEntity) {
        arr.push(this.modelEntity)
      }
      if (this.billboardEntity) {
        arr.push(this.billboardEntity);
      }
      return arr;
    }
    return [];
  }

  // 根据传入的时间、计算新的value值, 在这里是返回
  getValue(time: number): any {
    // 1. 如果时间 <= 动画真正开始的时刻，返回初始值
    // 2. 如果时间 >= 动画执行结束的时刻、返回最终值
    let startTime = this.start + this.startDelay;
    let endTime = this.start + this.duration;
    if (time <= startTime) return this.startValue;
    if (time >= endTime) return this.endValue;

    // 找到当前时间所在的关键帧区间, 目前就默认只有起点和终点这一个keyframe区间
    if (time >= startTime && time <= endTime) {
      let t = Math.min((time - startTime) / (endTime - startTime), 1); // 非重复性执行动画
      // 如果是非重复动画、则
      return this.interpolate(this.startValue, this.endValue, t); // 插值计算
    }
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

  setDuration(duration: number): void {
    this.duration = duration;
  }

  setStyle(style: any): void {
  }

  show(): void {
  }

  hide(): void {
  }
}
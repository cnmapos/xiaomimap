import { IEntity, LineEntity, CallbackProperty, Cartesian3, Cartographic, Transforms, Math as CMath, HeadingPitchRoll, IViewer, ModelEntity, BillboardEntity, Coordinate, Style } from '@hztx/core';
import { linearInterpolate } from '../interpolations/common';
import { AnimationStatus, AnimationTarget, InterpolateFunction, PathAnimationTargetConfig } from '../types';
import { createPointRoamingSlerp } from '../interpolations';
import { BaseAnimationTarget } from './BaseAnimationTarget';

const TIME_ERROR = 50; // 时间误差，防止时间精度问题导致的误差

export class PathAnimationTarget extends BaseAnimationTarget implements AnimationTarget {
  baseEntity: LineEntity; // 基础线要素、只是用来继承他的一些样式和属性、动画用到的实体另外实例化
  isShowBaseEntity: boolean;
  start: number;
  end: number;
  startValue: Coordinate;
  endValue: Coordinate;

  startDelay: number = 0;
  endStay: number = 0;
  model?: PathAnimationTargetConfig['model'];
  billboard?: PathAnimationTargetConfig['billboard'];

  customOnBefore: () => void = () => { };
  customOnAfter: () => void = () => { };

  // 保存线路坐标
  private positions: Cartesian3[] = [];
  style: any = {};
  interpolationFn: InterpolateFunction = linearInterpolate; // 默认是xx插值函数

  lineEntity?: LineEntity | null;
  modelEntity?: ModelEntity | null;
  billboardEntity?: BillboardEntity | null;

  constructor(config: PathAnimationTargetConfig) {
    super();
    this.baseEntity = config.baseEntity;
    this.start = config.start;
    this.end = config.end;
    this.startValue = config.startValue;
    this.endValue = config.endValue;
    this.isShowBaseEntity = config.isShowBaseEntity;

    if (config.startDelay) {
      this.startDelay = config.startDelay;
    }
    if (config.endStay) {
      this.endStay = config.endStay;
    }

    if (config.model) {
      this.model = config.model;
    }
    if (config.billboard) {
      this.billboard = config.billboard;
    }

    if (config.onBefore) {
      this.customOnBefore = config.onBefore;
    }

    if (config.onAfter) {
      this.customOnAfter = config.onAfter;
    }

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

    this.interpolationFn = createPointRoamingSlerp(positions.slice(1, -1))

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
          //@ts-ignore
          this.billboardEntity.billboard.alignedAxis = Cartesian3.normalize(
            direction,
            new Cartesian3()
          );
        } else if (this.modelEntity?.model) {
          // 模型角度计算更新
          const heading =
            -(Math.atan2(direction.y, direction.x) + CMath.PI_OVER_TWO);

          const hpr = new HeadingPitchRoll(heading, 0, 0);
          const orientation = Transforms.headingPitchRollQuaternion(
            this.positions[this.positions.length - 1],
            hpr
          );
          // @ts-ignore
          this.modelEntity.entity.orientation = orientation;
        }

        return this.positions;
      }, false);
    }
  }

  // 获取实现动画效果需要的实体
  override getAnimationEntities() {
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


  applyValue(value: [number, number, number]): void {
    // 这里需要根据是否配置了展示旧要素、去控制旧要素是否要隐藏
    if (this.isShowBaseEntity && this.baseEntity.show === false) {
      this.baseEntity.show = true;
    }
    const position = Cartesian3.fromDegrees(...value);
    const lastPosition = this.positions[this.positions.length - 1];
    if (!lastPosition || !Cartesian3.equals(position, lastPosition)) {
      this.positions.push(position);
      if (this.modelEntity?.entity) {
        // @ts-ignore
        this.modelEntity.entity.position = position;
      }
    }
  }

  reset(): void {
    super.reset();
    this.positions = [];
  }

  // 设置billboard
  setBillboard(billboard: PathAnimationTargetConfig['billboard']) {
    if (billboard) {
      // 把模型先隐藏
      if (this.modelEntity) {
        this.modelEntity.show = false;
      }

      if (this?.billboardEntity?.billboard) {
        // 更新billboard的图像和其他配置
        this.billboardEntity.billboard.image = billboard.image;
        this.billboardEntity.billboard.height = billboard.height;
        this.billboardEntity.billboard.width = billboard.width;
      } else {
        this.billboard = billboard;
        this.billboardEntity = new BillboardEntity({
          ...this.billboard
        })
      }
    }
  }

  // 设置model
  setModel(model: PathAnimationTargetConfig['model']) {
    if (model) {
      // 把billboard先隐藏
      if (this.billboardEntity) {
        this.billboardEntity.show = false;
      }

      if (this.modelEntity?.model) {
        // 更新model
        // @ts-ignore
        this.modelEntity.model.uri = model.uri;
        // @ts-ignore
        this.modelEntity.model.scale = model.scale;
      } else {
        this.model = model;
        this.modelEntity = new ModelEntity({
          ...this.model
        })
      }
    }
  }

  setStyle(style: Style): void {
    if (this.lineEntity) {
      this.lineEntity.setStyle(style);
    }
  }

  // onBefore和onAfter会被track调用
  onBefore(e: { viewer: IViewer; }): void {
    super.onBefore(e);
    this.customOnBefore();
  }

  onAfter(e: { viewer: IViewer; }): void {
    super.onAfter(e);
    this.customOnAfter();
  }

  show(): void {
    const entities = this.getAnimationEntities();
    entities.forEach((ety) => {
      ety.show = true;
    })
  }

  hide(): void {
    const entities = this.getAnimationEntities();
    entities.forEach((ety) => {
      ety.show = false;
    })
  }
}
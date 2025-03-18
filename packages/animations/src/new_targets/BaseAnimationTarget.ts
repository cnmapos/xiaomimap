import { IEntity, IViewer } from "@hztx/core";
import { AnimationCategory, AnimationStatus, InterpolateFunction } from "../types";
import { linearInterpolate } from "../interpolations";

const TIME_ERROR = 50; // 时间误差，防止时间精度问题导致的误差

export abstract class BaseAnimationTarget {
    config: any = {};
    start: number = 0; // 时间点， 生命周期、新增动画要素时间
    end: number = 0; // 时间点，生命周期、要素删除时间
    startDelay: number = 0; // 动画开始等待时长，在生命周期内、动画需要等几秒后才开始
    endStay: number = 0;
    startValue: any;
    endValue: any;
    category: AnimationCategory = AnimationCategory.NEUTER; // 默认中性动画
    duration: number = 1000; // 循环动画才会用到duration字段
    status: AnimationStatus = AnimationStatus.PENDING;

    interpolationFn: InterpolateFunction = linearInterpolate;

    isInKeyframes (time: number): boolean {
        // 这里加了50毫秒的误差，是为了防止时间精度问题导致的误差
        return time >= this.start && time <= this.end + TIME_ERROR;
    }

    // 子类实现
    abstract getAnimationEntities(): IEntity[];

    // 子类实现
    abstract applyValue(viewer: IViewer, value: any): void;

      // 根据传入的时间、计算新的value值, 在这里是返回
    getValue(time: number): any {
        // 1. 如果时间 <= 动画真正开始的时刻，返回初始值
        // 2. 如果时间 >= 动画执行结束的时刻、返回最终值
        let startTime = this.start + this.startDelay;
        let endTime = this.end - this.endStay;
        if (time <= startTime) return this.startValue;
        if (time >= endTime) return this.endValue;

        // 找到当前时间所在的关键帧区间, 目前就默认只有起点和终点这一个keyframe区间
        if (time >= startTime && time <= endTime) {
            let t = Math.min((time - startTime) / (endTime - startTime), 1); // 非重复性执行动画

            if (this.category === AnimationCategory.REPEAT) {
                t = Math.min(
                  ((time - startTime) % this.duration) / this.duration,
                  1
                ); // 重复执行动画
            }
            return this.interpolationFn(this.startValue, this.endValue, t); // 插值计算
        }
    }

    reset() {
        this.status === AnimationStatus.PENDING;
    }

    // 动画开始之前执行的回调、通用逻辑是添加到 viewer 视图中
    onBefore(e: { viewer: IViewer }) {
        const viewer = e.viewer;
        if (viewer) {
            // 拿到动画要素提供的需要加入到 viewer 中的实体、然后加入
            const entities = this.getAnimationEntities();
            entities.forEach((entity) => {
                // 避免重复添加
                if (!viewer.entities.contains(entity)) {
                    viewer.addEntity(entity);
                }
            })
        }
    }

    // 动画执行完毕、要素生命周期结束后、需要从viewer中移除
    onAfter(e: { viewer: IViewer }) {
        const viewer = e.viewer;
        if (viewer) {
            // 拿到动画要素提供的需要加入到 viewer 中的实体、然后加入
            const entities = this.getAnimationEntities();
            entities.forEach((entity) => {
                // 避免重复添加
                if (viewer.entities.contains(entity)) {
                    viewer.removeEntity(entity);
                }
            })
        }
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

    setEndStay(stay: number): void {
        this.endStay = stay;
    }

    // track会控制动画是否开始的状态
    setStatus(status: AnimationStatus) {
        this.status = status;
    }
}
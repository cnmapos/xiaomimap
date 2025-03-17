import { IEntity, IViewer } from "@hztx/core";


const TIME_ERROR = 50; // 时间误差，防止时间精度问题导致的误差

export abstract class BaseAnimationTarget {
    config: any = {};
    start: number = 0; // 时间点， 生命周期、新增动画要素时间
    end: number = 0; // 时间点，生命周期、要素删除时间
    startDelay: number = 0; // 动画开始等待时长，在生命周期内、动画需要等几秒后才开始
    endStay: number = 0;

    isInKeyframes (time: number): boolean {
        return time >= this.start && time <= this.end + TIME_ERROR;
        // 这里加了50毫秒的误差，是为了防止时间精度问题导致的误差
    }

    getAnimationEntities(): IEntity[] {
        return [];
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

}
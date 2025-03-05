import { Model } from './model';

enum AnimationCategory {
    ENTER = 'enter',
    EXIT = 'exit',
    REPEAT = 'repeat',
    NEUTER = 'neuter', // 中性的动画、入场、出场、循环动画外的动画、比如相机从A->B没有入场出场一说，轨迹动画也没有这一说
}

/** 相机动画配置 **/
export type CamerAnimation = {
    type: 'CameraAnimation';
    category: AnimationCategory.NEUTER;
    keyFrames: [
        {
            time: number;
            value: {
                position: Position;
                orientation?: [number, number, number];
            },
            onBefore?: () => void;
            onAfter?: () => void;
        },
        {
            time: number;
            value: {
                position: Position;
                orientation?: [number, number, number];
            },
            onBefore?: () => void;
            onAfter?: () => void;
        }
    ]
}

/** 轨迹动画配置、仅可装饰线要素 **/
export type PathAnimation = {
    type: 'PathAnimation';
    category: AnimationCategory.NEUTER;
    config: {
        // 图标的配置
        tracked: boolean; // 是否配置相机视角跟随，默认为true
        mark: Model | { // 模型或图片
            uri: string;
            width: number;
            height: number;
        };
        initRotate: number; // 图标初始朝向，正北方向夹角

        // 相机的位置配置
        camera: {
            distance: number; // 视点距离（米）
            head: number;  // 左右方位
            pitch: number; // 上下倾斜
            roll: number; // 滚动角
        };

        // 样式配置，默认继承装饰的线要素的样式
        style: {
            width: number;
            color: string;
            outlineWidth?: number;
            outlineColor?: string;
            glowPower?: number; // 发光强度，0-1之前的值、为1代表没有任何发光效果、为0则是整个线条都看不到了、中间值则随着0.1->0.9逐渐增强发光效果
        },
        
        // 其他配置
        startDelayTime: number; // 开始停留时间
        endDelayTime: number; // 结束停留时间
    },
    keyFrames: [
        {
            time: number,
            value: {
                position: Position;
                orientation?: [number, number, number];
            },
            onBefore?: () => void;
            onAfter?: () => void;
        },
        {
            time: number,
            value: {
                position: Position;
                orientation?: [number, number, number];
            },
            onBefore?: () => void;
            onAfter?: () => void;
        }
    ]
}



// 轨迹生成场景、需要的 props
{

}

export type Position = number[]; // [number, number] | [number, number, number];

// 图形类型
export enum GeometryType {
    Point = 'Point',
    LineString = 'LineString',
    Polygon = 'Polygon'
}

// 几何图形基础类型
export type Geomtory = {
    id: string; // 每个元素必须有一个id
    type: GeometryType;
    style: any;
    lifeCycle: {
        startTime: number;
        endTime: number;
    }
}

export type Point = Geomtory & {
    type: GeometryType.Point;
    position: Position;
    style: {
        color: string;
        outlineColor: string;
        outlineWidth: number;
        pixelSize: number;
    }
}

export type LineString = Geomtory & {
    type: GeometryType.LineString;
    position: Position[];
    style: {
        width: number;
        color: string;
        outlineWidth?: number;
        outlineColor?: string;
        glowPower?: number; // 发光强度，0-1之前的值、为1代表没有任何发光效果、为0则是整个线条都看不到了、中间值则随着0.1->0.9逐渐增强发光效果
        dash?: {
            color: string;
            gapColor: string;
            dashLength: number; // 间隔长度、像素大小
        }
        arrow?: boolean; // 是否需要带箭头
    }
}

export type Polygon = Geomtory & {
    type: GeometryType.Polygon;
    position: Position[][];
    style: {
        height?: number; // 距离地面多高，默认为0
        extrudedHeight?: number; // 挤压高度，立体效果
        material: string; // 渲染的素材、可以是颜色、也可以是其他纹理素材对象，这里先定义一个颜色、简单实现下
        outline?: boolean;
        outlineWidth?: number;
        outlineColor?: string;
    }
}

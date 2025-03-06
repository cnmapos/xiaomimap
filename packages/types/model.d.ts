import { Position } from "./geojson";

export type Model = {
    id: string;
    /** 模型位置 **/
    position: Position;
    /** heading, pitch, roll **/
    orientation?: [number, number, number];
    /**​ 模型资源路径 (如 .gltf/.glb 文件路径) */
    uri?: string;
    show: boolean;
    minimumPixelSize: number;
    maximumScale: number;
    /**​ 模型颜色叠加 (RGBA 数组，如 [1, 0, 0, 1] 表示红色) */
    color?: [number, number, number, number];
    lightColor?: string;
    imageBasedLightingFactor?: [number, number, number];
}


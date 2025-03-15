import { Coordinate, Style } from "@hztx/core";

export enum AssetTypes {
  PICTURE = 1,
  AUDIO = 2,
  VIDEO = 3,
  GEOMETRY = 4,
}

export enum GeometryTypes {
  POINT = "point",
  LINE_STRING = "linestring",
  POLYGON = "polygon",
  MULTI_POINT = "multipoint",
  MULTI_LINE_STRING = "multilinestring",
  MULTI_POLYGON = "multipolygon",
}

export enum AniCategories {
  ENTER = "enter",
  EXIT = "exit",
  REPEAT = "repeat",
}

export enum AniTypes {
  FADE_IN = "FadeIn",
  SCALE_IN = "ScaleIn",
  ROTATE_IN = "RotateIn",
}

export interface AniConfig {}

export interface HzAnimation {
  type: AniTypes; // 动画类型，淡入
  category: AniCategories; // 入场动画， exit 出场动画
  keyFrames: { time: number; value: any }[];
}

export interface AniKeyframe {
  id: string;
  startTime: number;
  endTime: number;
  position?: Coordinate;
  type: GeometryTypes;
  style: Style;
  lifecycle: {
    startTime: number;
    endTime: number;
  };
  animations: HzAnimation[];
  config?: AniConfig;
}

export interface AniLayer {
  id: string;
  lock?: boolean;
  voice?: boolean;
  visible: boolean;
  keyframes: AniKeyframe[];
  startTime: number;
  endTime: number;
  type: AssetTypes;
}

import {
  ImageryLayer,
  ImageryProvider,
  SceneMode as Mode,
  PolylineGraphics as CesiumPolylineGraphics,
  BillboardGraphics as CesiumBillboardGraphics,
  ModelGraphics as CesiumModelGraphics,
  Cartesian3 as CesiumCartesian3,
  Cartographic as CesiumCartographic,
  Color as CesiumColor,
  Transforms as CesiumCTransforms,
  CallbackProperty as CesiumCallbackProperty,
  Math as CesiumMath,
  HeadingPitchRoll as CesiumHeadingPitchRoll,
  Quaternion as CesiumQuaternion,
  ScreenSpaceEventType,
} from 'cesium';
import { EntityCollection } from '../entities';
import { RasterLayer } from '../layers';

export namespace Entity {
  type ConstructorOptions = {
    id?: string;
  };
}

export type Coordinate = [number, number, number?];

export type PolylineGraphics = CesiumPolylineGraphics;
export type BillboardGraphics = CesiumBillboardGraphics;
export type ModelGraphics = CesiumModelGraphics;

export const Transforms = CesiumCTransforms;
export const Cartesian3 = CesiumCartesian3;
export const CallbackProperty = CesiumCallbackProperty;
export const Cartographic = CesiumCartographic;
export const Math = CesiumMath;
export const HeadingPitchRoll = CesiumHeadingPitchRoll;
export const Quaternion = CesiumQuaternion;

export type Cartesian3 = CesiumCartesian3;

export type Color = CesiumColor;

export type Quaternion = CesiumQuaternion;

export type HeadingPitchRoll = {
  heading: number;
  pitch: number;
  roll: number;
};

export type HeadingPitchRange = {
  heading: number;
  pitch: number;
  range: number;
};

export enum SceneMode {
  SCENE3D = Mode.SCENE3D,
  COLUMBUS_VIEW = Mode.COLUMBUS_VIEW,
  SCENE2D = Mode.SCENE2D,
  MORPHING = Mode.MORPHING,
}

export interface Style {
  color?: string; // 点、线、面填充颜色
  pixelSize?: number;
  width?: number;
  height?: number;
  radius?: number;
  outlineColor?: string; // 描边颜色
  outlineWidth?: number; // 描边宽度
  scale?: number;
  minimumPixelSize?: number;
}

export interface RasterProvider {
  url: string;
  alpha?: number;
  brightness?: number;
  contrast?: number;
  maximumLevel?: number;
  minimumLevel?: number;
}

export interface ILayer {}

export interface IEntity {
  id: string;

  polyline?: PolylineGraphics | undefined;
  billboard: BillboardGraphics | undefined;
  model: ModelGraphics | undefined;

  show?: boolean;

  setStyle(style: Style): void;
  getStyle(): Style;

  setProperties(properties: any): void;
  getProperty(key: string): any;
  getProperties(): any;
}

export interface EntityLike {}

export interface PointEntityLike extends EntityLike {}

export interface LineEntityLike extends EntityLike {}

export interface PolygonEntityLike extends EntityLike {}

export enum EventTypes {
  LEFT_CLICK = ScreenSpaceEventType.LEFT_CLICK,
  RIGHT_CLICK = ScreenSpaceEventType.RIGHT_CLICK,
  MOUSE_MOVE = ScreenSpaceEventType.MOUSE_MOVE,
}

export interface MapEvent {
  entities: IEntity;
  coordinate: Coordinate;
}

export interface IViewer {
  entities: EntityCollection;

  addRasterLayer(layer: RasterProvider | RasterLayer): void;
  removeRasterLayer(layer: ILayer): void;

  flyTo(options: {
    destination?: Coordinate;
    entities?: IEntity[];
    orientation?: any;
    duration?: number;
    complete?: () => void;
    cancel?: () => void;
  }): void;
  setView(position: Coordinate, orientation: HeadingPitchRoll): void;

  setTrackEntity(entity: IEntity): void;
  getTrackEntity(): IEntity;

  addEntity(entity: IEntity | EntityLike): IEntity;
  removeEntity(entity: IEntity): void;

  destroy(): void;

  zoomIn: (amount?: number) => void;
  zoomOut: (amount?: number) => void;
}

export namespace HzEditor {
  export type Types = 'point' | 'line' | 'polygon';

  export type CreateOption = {
    point: { style?: any };
    line: { style?: any; smooth?: boolean };
    polygon: { style?: any };
  };
}

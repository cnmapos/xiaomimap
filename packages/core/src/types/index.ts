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
} from 'cesium';

export type Coordinate = [number, number, number?];

export type PolylineGraphics = CesiumPolylineGraphics;
export type BillboardGraphics = CesiumBillboardGraphics;
export type ModelGraphics = CesiumModelGraphics;

export const Transforms = CesiumCTransforms;
export type Cartesian3 = CesiumCartesian3;
export type Cartographic = CesiumCartographic;

export type Color = CesiumColor;

export type HeadingPitchRoll = {
  heading: number;
  pitch: number;
  roll: number;
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
  radius?: number;
  outlineColor?: string; // 描边颜色
  outlineWidth?: number; // 描边宽度
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

export interface IViewer {
  addRasterLayer(layer: RasterProvider): void;
  removeRasterLayer(layer: ILayer): void;

  flyTo(options: {
    destination: Coordinate;
    orientation?: any;
    duration?: number;
    complete?: () => void;
    cancel?: () => void;
  }): void;
  setView(position: Coordinate, orientation: HeadingPitchRoll): void;

  addEntity(entity: IEntity | EntityLike): IEntity;
  removeEntity(entity: IEntity): void;

  destroy(): void;

  zoomIn: (amount?: number) => void;
  zoomOut: (amount?: number) => void;
}

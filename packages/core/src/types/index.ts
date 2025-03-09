import { ImageryLayer, ImageryProvider, SceneMode as Mode } from "cesium";

export type Coordinate = [number, number, number?];

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
  color?: string;
  pixelSize?: number;
  width?: number;
  outlineColor?: string;
  outlineWidth?: number;
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

  zoomIn: (amount?:number) => void;
  zoomOut: (amount?:number) => void;
}

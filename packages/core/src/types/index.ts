import { ImageryLayer, ImageryProvider } from "cesium";

export type Coordinate = {
  lat: number;
  lng: number;
  height: number;
};

export type HeadingPitchRoll = {
  heading: number;
  pitch: number;
  roll: number;
};

export interface IViewer {
  addImageryLayer(layer: ImageryProvider): void;
  setView(position: Coordinate, orientation: HeadingPitchRoll): void;
  removeImageryLayer(layer: ImageryLayer): void;
  destroy(): void;
}

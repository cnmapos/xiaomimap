// ... existing code ...

import { ImageryLayer, Rectangle, UrlTemplateImageryProvider } from "cesium";
import { ILayer, IViewer } from "../types";

export class RasterLayer implements ILayer {
  _layer: ImageryLayer;

  maximumLevel: number;
  minimumLevel: number;

  constructor(options: {
    url: string;
    rectangle?: Rectangle;
    alpha?: number;
    brightness?: number;
    contrast?: number;
    maximumLevel?: number;
    minimumLevel?: number;
  }) {
    this.minimumLevel = options.minimumLevel ?? 0;
    this.maximumLevel = options.maximumLevel ?? 25;
    const provider = new UrlTemplateImageryProvider({
      url: options.url,
      rectangle: options.rectangle,
      minimumLevel: this.minimumLevel,
      maximumLevel: this.maximumLevel,
    });

    this._layer = new ImageryLayer(provider, {
      show: true,
      alpha: options.alpha ?? 1.0,
      brightness: options.brightness ?? 1.0,
      contrast: options.contrast ?? 1.0,
    });
  }

  public setAlpha(alpha: number): void {
    this._layer.alpha = alpha;
  }

  public setBrightness(brightness: number): void {
    this._layer.brightness = brightness;
  }

  public setContrast(contrast: number): void {
    this._layer.contrast = contrast;
  }
}

// ... existing code ...

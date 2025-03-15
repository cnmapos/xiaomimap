import { Coordinate, IEntity, Style } from '../types';
import { Entity, Cartesian3, Color } from 'cesium';
import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from './Base';

export class ModelEntity extends BaseEntity implements IEntity {
  positions: Coordinate;

  constructor(options: { positions: Coordinate; uri: string }) {
    super();
    const { positions, uri } = options;
    this.positions = positions;
    this.id = uuidv4();
    this._style = {
      scale: 1.0,
      minimumPixelSize: 128,
    };
    this._entity = new Entity({
      id: this.id,
      position: Cartesian3.fromDegrees(...positions),
      model: {
        uri,
        scale: 1.0,
        minimumPixelSize: 128,
      },
    });
  }
  getStyle(): Style {
    return this._style;
  }
  setProperties(properties: Record<string, any>): void {
    this._properties = { ...this._properties, ...properties };
  }

  getProperty(key: string): any {
    return this._properties[key];
  }

  getProperties(): Record<string, any> {
    return this._properties;
  }

  setStyle(style: Style): void {
    this._style = { ...this._style, ...style };
    if (style.color) {
      this._entity.model!.color = Color.fromCssColorString(style.color) as any;
    }
    if (style.scale) {
      this._entity.model!.scale = style.scale as any;
    }
  }

  // ... existing getStyle, setProperties, getProperty, getProperties methods ...
}

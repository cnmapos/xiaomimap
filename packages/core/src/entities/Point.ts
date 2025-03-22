import { Coordinate, IEntity, Style } from '../types';
import { Entity, Cartesian3, Color } from 'cesium';
import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from './Base';

export class PointEntity extends BaseEntity implements IEntity {
  positions: Coordinate;

  constructor(options: Entity.ConstructorOptions & { positions: Coordinate }) {
    super();
    const { positions, id } = options;
    this.positions = positions;
    this.id = id || uuidv4();
    this._style = {
      pixelSize: 10,
      color: '#FFF',
    };
    this._entity = new Entity({
      id: this.id,
      position: Cartesian3.fromDegrees(...positions),
      point: {
        pixelSize: this._style.pixelSize,
        color: Color.fromCssColorString(this._style.color),
      },
    });
  }

  setStyle(style: Style): void {
    this._style = { ...this._style, ...style };
    if (style.color) {
      this._entity.point!.color = Color.fromCssColorString(style.color) as any;
    }
    if (style.pixelSize) {
      this._entity.point!.pixelSize = style.pixelSize as any;
    }
    if (style.outlineColor) {
      this._entity.point!.outlineColor = Color.fromCssColorString(
        style.outlineColor
      ) as any;
    }
    if (style.outlineWidth) {
      this._entity.point!.outlineWidth = style.outlineWidth as any;
    }
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
}

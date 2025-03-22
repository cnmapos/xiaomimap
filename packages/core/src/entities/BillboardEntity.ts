import { Coordinate, IEntity, Style } from '../types';
import { Entity, Cartesian3, Color } from 'cesium';
import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from './Base';

export class BillboardEntity extends BaseEntity implements IEntity {
  private width: number;
  private height: number;
  private image: string;

  positions: Coordinate;

  constructor(
    options: Entity.ConstructorOptions & {
      positions: Coordinate;
      image: string;
      width?: number;
      height?: number;
    }
  ) {
    super();
    const { positions, image, id, width = 50, height = 50 } = options;
    this.positions = positions;
    this.id = id || uuidv4();
    this.width = width;
    this.height = height;
    this.image = image;

    this._entity = new Entity({
      id: this.id,
      position: Cartesian3.fromDegrees(...positions),
      billboard: {
        image,
        width,
        height,
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
      this._entity.billboard!.color = Color.fromCssColorString(
        style.color
      ) as any;
    }
    if (style.width) {
      this._entity.billboard!.width = style.width as any;
    }
    if (style.height) {
      this._entity.billboard!.height = style.height as any;
    }
  }

  // ... existing getStyle, setProperties, getProperty, getProperties methods ...
}

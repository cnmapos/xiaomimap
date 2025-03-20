import { Coordinate, IEntity, Style } from '../types';
import { Entity, Cartesian3, Color } from 'cesium';
import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from './Base';

export class PolygonEntity extends BaseEntity implements IEntity {
  positions: Coordinate[];

  constructor(
    options: Entity.ConstructorOptions & { positions: Coordinate[] }
  ) {
    super();
    const { positions, id } = options;
    this.positions = positions;
    this.id = id || uuidv4();
    this._style = {
      pixelSize: 10,
      color: '#FFF',
      outlineColor: '#FFF',
    };
    this._entity = new Entity({
      id: this.id,
      polygon: {
        hierarchy: positions.map((p) => Cartesian3.fromDegrees(...p)),
        material: Color.fromCssColorString(this._style.color).withAlpha(0.5),
        outline: !!this._style.outlineColor,
        outlineColor: Color.fromCssColorString(this._style.outlineColor),
      },
    });
  }

  setStyle(style: Style): void {
    this._style = { ...this._style, ...style };
    if (style.color) {
      this._entity.polygon!.material = Color.fromCssColorString(
        style.color
      ) as any;
    }
    if (style.outlineColor) {
      this._entity.polygon!.outlineColor = Color.fromCssColorString(
        style.outlineColor
      ) as any;
    }
    if (style.outlineWidth) {
      this._entity.polygon!.outlineWidth = style.outlineWidth as any;
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

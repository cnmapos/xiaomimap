import { Coordinate, IEntity, Style } from '../types';
import {
  Entity,
  Cartesian3,
  Color,
  BillboardGraphics,
  ModelGraphics,
  PolylineGraphics,
} from 'cesium';
import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from './Base';

export class LineEntity extends BaseEntity implements IEntity {
  positions: Coordinate[];

  constructor(options: { positions: Coordinate[] }) {
    super();
    const { positions } = options;
    this.positions = positions;
    this.id = uuidv4();
    this._style = {
      width: 2,
      color: '#FFF',
    };
    this._entity = new Entity({
      id: this.id,
      polyline: {
        positions: positions.map((p) => Cartesian3.fromDegrees(...p)),
        width: this._style.width,
        material: Color.fromCssColorString(this._style.color),
      },
    });
  }

  setStyle(style: Style): void {
    this._style = { ...this._style, ...style };
    if (style.color) {
      this._entity.polyline!.material = Color.fromCssColorString(
        style.color
      ) as any;
    }
    if (style.width) {
      this._entity.polyline!.width = style.width as any;
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

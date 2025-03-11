import { Coordinate, IEntity, Style } from "../types";
import { Entity, Cartesian3, Color } from "cesium";
import { v4 as uuidv4 } from "uuid";

export class PointEntity implements IEntity {
  id: string;
  private _entity: Entity;
  private _style: Style = {};
  private _properties: Record<string, any> = {};

  positions: Coordinate;

  constructor(options: { positions: Coordinate }) {
    const { positions } = options;
    this.positions = positions;
    this.id = uuidv4();
    this._entity = new Entity({
      id: this.id,
      position: Cartesian3.fromDegrees(...positions),
      point: {
        pixelSize: 10,
        color: Color.WHITE,
      },
    });
  }

  setStyle(style: Style): void {
    this._style = { ...this._style, ...style };
    if (style.color) {
      this._entity.point!.color = Color.fromCssColorString(style.color);
    }
    if (style.pixelSize) {
      this._entity.point!.pixelSize = style.pixelSize;
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

import { Coordinate, IEntity, Style } from "../types";
import { Entity, Cartesian3, Color } from "cesium";
import { v4 as uuidv4 } from "uuid";
import { BaseEntity } from "./Base";

export class PointEntity extends BaseEntity implements IEntity {
  positions: Coordinate;

  constructor(options: { positions: Coordinate }) {
    super();
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

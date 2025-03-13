import { Coordinate, IEntity, Style } from "../types";
import {
  Entity,
  Cartesian3,
  Color,
  BillboardGraphics,
  ModelGraphics,
  PolylineGraphics,
} from "cesium";
import { v4 as uuidv4 } from "uuid";
import { BaseEntity } from "./Base";

export class LineEntity extends BaseEntity implements IEntity {
  positions: Coordinate[];

  constructor(options: { positions: Coordinate[] }) {
    super();
    const { positions } = options;
    this.positions = positions;
    this.id = uuidv4();
    this._entity = new Entity({
      id: this.id,
      polyline: {
        positions: positions.map((p) => Cartesian3.fromDegrees(...p)),
        width: 2,
        material: Color.WHITE,
      },
    });
  }

  setStyle(style: Style): void {
    this._style = { ...this._style, ...style };
    if (style.color) {
      this._entity.polyline!.material = Color.fromCssColorString(style.color);
    }
    if (style.width) {
      this._entity.polyline!.width = style.width;
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

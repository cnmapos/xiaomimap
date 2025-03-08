import { IEntity, Style } from "../types";
import { Entity, Cartesian3, Color } from "cesium";

export class LineEntity implements IEntity {
  id: string;
  private _entity: Entity;
  private _style: Style = {};
  private _properties: Record<string, any> = {};

  constructor(positions: Cartesian3[], id: string) {
    this.id = id;
    this._entity = new Entity({
      id,
      polyline: {
        positions,
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

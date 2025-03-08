import { IEntity, Style } from "../types";
import { Entity, Cartesian3, Color } from "cesium";

export class PolygonEntity implements IEntity {
  id: string;
  private _entity: Entity;
  private _style: Style = {};
  private _properties: Record<string, any> = {};

  constructor(positions: Cartesian3[], id: string) {
    this.id = id;
    this._entity = new Entity({
      id,
      polygon: {
        hierarchy: positions,
        material: Color.WHITE.withAlpha(0.5),
        outline: true,
        outlineColor: Color.WHITE,
      },
    });
  }

  setStyle(style: Style): void {
    this._style = { ...this._style, ...style };
    if (style.color) {
      this._entity.polygon!.material = Color.fromCssColorString(style.color);
    }
    if (style.outlineColor) {
      this._entity.polygon!.outlineColor = Color.fromCssColorString(
        style.outlineColor
      );
    }
    if (style.outlineWidth) {
      this._entity.polygon!.outlineWidth = style.outlineWidth;
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

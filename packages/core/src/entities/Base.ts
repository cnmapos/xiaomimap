import { Entity } from "cesium";
import {
  BillboardGraphics,
  IEntity,
  ModelGraphics,
  PolylineGraphics,
  Style,
} from "../types";

export abstract class BaseEntity {
  get polyline(): PolylineGraphics | undefined {
    return this._entity.polyline;
  }

  set polyline(polyline: PolylineGraphics) {
    this._entity.polyline = polyline;
  }

  get billboard(): BillboardGraphics | undefined {
    return this._entity.billboard;
  }

  set billboard(billboard: BillboardGraphics) {
    this._entity.billboard = billboard;
  }

  get model(): ModelGraphics | undefined {
    return this._entity.model;
  }

  set model(model: ModelGraphics) {
    this._entity.model = model;
  }

  get show(): boolean {
    return this._entity.show;
  }

  set show(show: boolean) {
    this._entity.show = show;
  }

  id!: string;
  protected _entity!: Entity;
  protected _style: Style = {};
  protected _properties: Record<string, any> = {};
}

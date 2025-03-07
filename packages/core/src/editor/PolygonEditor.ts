import {
  Cartesian3,
  Color,
  Entity,
  PolygonHierarchy,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
} from "cesium";
import { EditorBase } from "./EditorBase";

export class PolygonEditor extends EditorBase {
  private positions: Cartesian3[] = [];
  private entity: Entity | null = null;
  private pointEntities: Entity[] = [];

  startCreate(customStyle?: any): void {
    const handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
    const style = this.mergeStyles(this.defaultStyle, customStyle);
    const pointStyle = {
      point: {
        pixelSize: 8,
        color: Color.YELLOW,
        outlineColor: Color.BLACK,
        outlineWidth: 2,
      },
    };

    handler.setInputAction((movement: any) => {
      const cartesian = this.viewer.camera.pickEllipsoid(movement.position);
      if (cartesian) {
        this.positions.push(cartesian);
        const pointEntity = this.viewer.entities.add({
          position: cartesian,
          ...pointStyle,
        });
        this.pointEntities.push(pointEntity);

        if (!this.entity) {
          this.entity = this.viewer.entities.add({
            polygon: {
              hierarchy: new PolygonHierarchy(this.positions),
              ...style,
            },
          });
        } else {
          (this.entity.polygon!.hierarchy as any).setValue(
            new PolygonHierarchy(this.positions)
          );
        }
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction(() => {
      if (this.entity) {
        const coordinates = this.positions.map((pos) =>
          this.cartesianToDegrees(pos)
        );
        this.onEndCreate(coordinates);
        this.pointEntities.forEach((entity) =>
          this.viewer.entities.remove(entity)
        );
        this.pointEntities = [];
        this.viewer.entities.remove(this.entity);
        this.entity = null;
        this.positions = [];
        handler.destroy();
      }
    }, ScreenSpaceEventType.RIGHT_CLICK);
  }
}

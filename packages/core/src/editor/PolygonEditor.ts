import {
  Cartesian3,
  Color,
  Entity,
  PolygonHierarchy,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
} from 'cesium';
import { EditorBase } from './EditorBase';
import { HzEditor } from '../types';

export class PolygonEditor extends EditorBase {
  private positions: Cartesian3[] = [];
  private entity: Entity | null = null;
  private pointEntities: Entity[] = [];
  private handler?: ScreenSpaceEventHandler;

  cancel(): void {
    this.handler?.destroy();
  }

  startCreate(options: HzEditor.CreateOption['polygon']): void {
    const { style: customStyle } = options;
    this.handler = new ScreenSpaceEventHandler(
      this.viewer._viewer.scene.canvas
    );
    const style = this.mergeStyles(this.defaultStyle, customStyle);
    const pointStyle = {
      point: {
        pixelSize: 8,
        color: Color.YELLOW,
        outlineColor: Color.BLACK,
        outlineWidth: 2,
      },
    };

    this.handler.setInputAction((movement: any) => {
      const cartesian = this.viewer._viewer.camera.pickEllipsoid(
        movement.position
      );
      if (cartesian) {
        this.positions.push(cartesian);
        const pointEntity = this.viewer._viewer.entities.add({
          position: cartesian,
          ...pointStyle,
        });
        this.pointEntities.push(pointEntity);

        if (!this.entity) {
          this.entity = this.viewer._viewer.entities.add({
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

    this.handler.setInputAction(() => {
      if (this.entity) {
        const coordinates = this.positions.map((pos) =>
          this.cartesianToDegrees(pos)
        );
        this.onEndCreate(coordinates);
        this.pointEntities.forEach((entity) =>
          this.viewer._viewer.entities.remove(entity)
        );
        this.pointEntities = [];
        this.viewer._viewer.entities.remove(this.entity);
        this.entity = null;
        this.positions = [];
        this.handler.destroy();
      }
    }, ScreenSpaceEventType.RIGHT_CLICK);
  }
}

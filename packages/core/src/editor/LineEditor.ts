import {
  CallbackProperty,
  Cartesian3,
  Color,
  Entity,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
} from 'cesium';
import { EditorBase } from './EditorBase';

export class LineEditor extends EditorBase {
  private positions: Cartesian3[] = [];
  private tempEntity: Entity | null = null;
  private pointEntities: Entity[] = [];
  private handler?: ScreenSpaceEventHandler;

  cancel(): void {
    this.handler?.destroy();
  }

  startCreate(customStyle?: any): void {
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

        if (!this.tempEntity) {
          this.tempEntity = this.viewer._viewer.entities.add({
            polyline: {
              positions: new CallbackProperty(() => this.positions, false),
              ...style,
            },
          });
        }
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    this.handler.setInputAction(() => {
      if (this.tempEntity) {
        const coordinates = this.positions.map((pos) =>
          this.cartesianToDegrees(pos)
        );
        this.onEndCreate(coordinates);
        this.viewer._viewer.entities.remove(this.tempEntity);
        this.pointEntities.forEach((entity) =>
          this.viewer._viewer.entities.remove(entity)
        );
        this.pointEntities = [];
        this.tempEntity = null;
        this.positions = [];
        this.handler.destroy();
      }
    }, ScreenSpaceEventType.RIGHT_CLICK);
  }
}

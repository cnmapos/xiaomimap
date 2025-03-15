import { Entity, ScreenSpaceEventHandler, ScreenSpaceEventType } from 'cesium';
import { EditorBase } from './EditorBase';

export class PointEditor extends EditorBase {
  private handler?: ScreenSpaceEventHandler;

  cancel(): void {
    this.handler?.destroy();
  }

  startCreate(customStyle?: any): void {
    this.handler = new ScreenSpaceEventHandler(
      this.viewer._viewer.scene.canvas
    );
    const style = this.mergeStyles(this.defaultStyle, customStyle);

    this.handler.setInputAction((movement: any) => {
      const cartesian = this.viewer._viewer.camera.pickEllipsoid(
        movement.position
      );
      if (cartesian) {
        this.handler.destroy();
        this.onEndCreate(this.cartesianToDegrees(cartesian));
      }
    }, ScreenSpaceEventType.LEFT_CLICK);
  }
}

import { Entity, ScreenSpaceEventHandler, ScreenSpaceEventType } from "cesium";
import { EditorBase } from "./EditorBase";

export class PointEditor extends EditorBase {
  startCreate(customStyle?: any): void {
    const handler = new ScreenSpaceEventHandler(
      this.viewer._viewer.scene.canvas
    );
    const style = this.mergeStyles(this.defaultStyle, customStyle);

    handler.setInputAction((movement: any) => {
      const cartesian = this.viewer._viewer.camera.pickEllipsoid(
        movement.position
      );
      if (cartesian) {
        handler.destroy();
        this.onEndCreate(this.cartesianToDegrees(cartesian));
      }
    }, ScreenSpaceEventType.LEFT_CLICK);
  }
}

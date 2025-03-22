import {
  CallbackProperty,
  Color,
  Entity,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
} from 'cesium';
import { EditorBase } from './EditorBase';
import { Cartesian3, Cartographic, HzEditor } from '../types';
import { HzMath, smoothLine } from '../utils';

function generateLine(positions: Cartesian3[], smooth?: boolean) {
  if (positions.length < 2 || !smooth) {
    return positions.map((p) => {
      // 将Cartesian3对象转换为Degree经纬度
      const cartographic = Cartographic.fromCartesian(p);
      const longitude = HzMath.toDegrees(cartographic.longitude);
      const latitude = HzMath.toDegrees(cartographic.latitude);
      return [longitude, latitude, cartographic.height];
    });
  }
  return smoothLine(positions);
}

export class LineEditor extends EditorBase {
  private positions: Cartesian3[] = [];
  private tempEntity: Entity | null = null;
  private pointEntities: Entity[] = [];
  private handler?: ScreenSpaceEventHandler;

  cancel(): void {
    this.handler?.destroy();
  }

  startCreate(options: HzEditor.CreateOption['line']): void {
    const { smooth } = options;
    this.handler = new ScreenSpaceEventHandler(
      this.viewer._viewer.scene.canvas
    );
    const style = this.mergeStyles(this.defaultStyle, options.style);
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
              positions: new CallbackProperty(
                () =>
                  generateLine(this.positions, smooth).map((p) =>
                    Cartesian3.fromDegrees(...p)
                  ),
                false
              ),
              ...style,
            },
          });
        }
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    this.handler.setInputAction(() => {
      if (this.tempEntity) {
        let coordinates = generateLine(this.positions, smooth);
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

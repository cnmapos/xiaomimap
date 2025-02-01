import { Cartesian3, Math as CMath } from 'cesium';
import { AnimationTarget } from '../types';

export class CameraAnimationTarget implements AnimationTarget {
  private camera: Camera;

  constructor(camera: Camera) {
    this.camera = camera;
  }

  applyValue(value: {
    position: [number, number, number];
    direction: [number, number, number?];
  }): void {
    const { position, direction } = value;

    this.camera.setView({
      destination: Cartesian3.fromDegrees(
        position[0],
        position[1],
        position[2]
      ),
      orientation: {
        heading: CMath.toRadians(direction[0]), // east, default value is 0.0 (north)
        pitch: CMath.toRadians(direction[1]), // default value (looking down)
        roll: CMath.toRadians(direction[2] || 0), // default value
      },
    });
  }

  reset() {}
}

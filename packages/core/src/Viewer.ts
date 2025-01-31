import {
  Cartesian3,
  ImageryProvider,
  Viewer,
  Math as CMath,
  ImageryLayer,
  Ion,
  SceneMode,
} from "cesium";
import { Coordinate, HeadingPitchRoll, IViewer } from "./types";

export class HZViewer implements IViewer {
  viewer: Viewer;

  static HZViewerKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YjliYjIwYi0zMWE0LTQ4MTgtYWU4NC0wNWZmNTFmZjVhYmMiLCJpZCI6MjY1NzYxLCJpYXQiOjE3MzU1NzA3MTl9.BOJDK-WqsLV-QcQhbnAEf-wG1mtkftG1BYV6JIv0VoI";

  constructor(
    containerId: string,
    options?: { key?: string; sceneMode?: string }
  ) {
    Ion.defaultAccessToken = options?.key || HZViewer.HZViewerKey;
    const sceneMode = options?.sceneMode || SceneMode.SCENE3D;

    this.viewer = new Viewer(containerId, {
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      sceneMode: sceneMode,
      fullscreenButton: false,
      infoBox: false,
      selectionIndicator: false,
      creditContainer: document.createElement("div"),
    });

    this.viewer.clock.shouldAnimate = true;

    this.viewer.camera.changed.addEventListener(() => {
      const cartographic = this.viewer.camera.positionCartographic;
      console.log(
        "camera position",
        CMath.toDegrees(cartographic.longitude),
        ",",
        CMath.toDegrees(cartographic.latitude),
        ",",
        cartographic.height
      );
      console.log(
        "camera direction",
        CMath.toDegrees(this.viewer.camera.heading),
        ",",
        CMath.toDegrees(this.viewer.camera.pitch),
        ",",
        CMath.toDegrees(this.viewer.camera.roll)
      );
    });
  }

  // 封装添加图层的方法
  addImageryLayer(layer: ImageryProvider) {
    this.viewer.imageryLayers.addImageryProvider(layer);
  }

  // 封装设置视角的方法
  setView(position: Coordinate, orientation: HeadingPitchRoll) {
    this.viewer.camera.setView({
      destination: Cartesian3.fromDegrees(
        position.lng,
        position.lat,
        position.height
      ),
      orientation: {
        heading: Math.toRadians(orientation.heading),
        pitch: Math.toRadians(orientation.pitch),
        roll: Math.toRadians(orientation.roll),
      },
    });
  }

  // 封装移除图层的方法
  removeImageryLayer(layer: ImageryLayer) {
    this.viewer.imageryLayers.remove(layer);
  }

  destroy() {
    this.viewer.destroy();
  }
}

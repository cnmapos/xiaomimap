import {
  Cartesian3,
  ImageryProvider,
  Viewer,
  Math as CMath,
  ImageryLayer,
  Ion,
} from "cesium";
import {
  Coordinate,
  Entity,
  EntityLike,
  HeadingPitchRoll,
  ILayer,
  IViewer,
  Layer,
  RasterProvider,
  SceneMode,
} from "./types";
import { RasterLayer } from "./layers/RasterLayer";
import { HzMath } from "./utils/math";
import { EntityCollection } from "./entities/Collection";

// export class HZViewer implements IViewer {
//   viewer: Viewer;

//   static HZViewerKey =
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YjliYjIwYi0zMWE0LTQ4MTgtYWU4NC0wNWZmNTFmZjVhYmMiLCJpZCI6MjY1NzYxLCJpYXQiOjE3MzU1NzA3MTl9.BOJDK-WqsLV-QcQhbnAEf-wG1mtkftG1BYV6JIv0VoI";

//   constructor(
//     containerId: string,
//     options?: { key?: string; sceneMode?: string }
//   ) {
//     Ion.defaultAccessToken = options?.key || HZViewer.HZViewerKey;
//     const sceneMode = options?.sceneMode || SceneMode.SCENE3D;

//     this.viewer = new Viewer(containerId, {
//       baseLayerPicker: false,
//       geocoder: false,
//       homeButton: false,
//       sceneModePicker: false,
//       navigationHelpButton: false,
//       animation: false,
//       timeline: false,
//       sceneMode: sceneMode,
//       fullscreenButton: false,
//       infoBox: false,
//       selectionIndicator: false,
//       creditContainer: document.createElement("div"),
//       contextOptions: {
//         webgl: {
//           preserveDrawingBuffer: true,
//           powerPreference: "high-performance",
//         },
//         allowTextureFilterAnisotropic: true,
//       },
//     });

//     this.viewer.clock.shouldAnimate = true;
//     this.viewer.resolutionScale = 1.5;

//     const cameraChange = () => {
//       const cartographic = this.viewer.camera.positionCartographic;
//       console.log(
//         "camera position",
//         CMath.toDegrees(cartographic.longitude),
//         ",",
//         CMath.toDegrees(cartographic.latitude),
//         ",",
//         cartographic.height
//       );
//       console.log(
//         "camera direction",
//         CMath.toDegrees(this.viewer.camera.heading),
//         ",",
//         CMath.toDegrees(this.viewer.camera.pitch),
//         ",",
//         CMath.toDegrees(this.viewer.camera.roll)
//       );
//     };

//     this.viewer.camera.changed.addEventListener(() => {
//       cameraChange();
//     });

//     window.camera = cameraChange;
//   }

//   // 封装添加图层的方法
//   addImageryLayer(layer: ImageryProvider) {
//     this.viewer.imageryLayers.addImageryProvider(layer);
//   }

//   // 封装设置视角的方法
//   setView(position: Coordinate, orientation: HeadingPitchRoll) {
//     this.viewer.camera.setView({
//       destination: Cartesian3.fromDegrees(
//         position.lng,
//         position.lat,
//         position.height
//       ),
//       orientation: {
//         heading: Math.toRadians(orientation.heading),
//         pitch: Math.toRadians(orientation.pitch),
//         roll: Math.toRadians(orientation.roll),
//       },
//     });
//   }

//   // 封装移除图层的方法
//   removeImageryLayer(layer: ImageryLayer) {
//     this.viewer.imageryLayers.remove(layer);
//   }

//   destroy() {
//     this.viewer.destroy();
//   }
// }

export class HZViewer implements IViewer {
  private key: string;
  private sceneMode: SceneMode;
  private _viewer: Viewer;
  private layers: ILayer[] = [];
  private entities: EntityCollection;

  constructor(
    element: string | HTMLElement,
    options: { key: string; sceneMode?: SceneMode }
  ) {
    this.key = Ion.defaultAccessToken = options.key;
    this.sceneMode = options?.sceneMode || SceneMode.SCENE3D;
    this._viewer = new Viewer(element, {
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      sceneMode: this.sceneMode,
      fullscreenButton: false,
      infoBox: false,
      selectionIndicator: false,
      creditContainer: document.createElement("div"),
      contextOptions: {
        webgl: {
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
        },
        allowTextureFilterAnisotropic: true,
      },
    });

    this._viewer.clock.shouldAnimate = true;
    this._viewer.resolutionScale = 1.5;

    this.entities = new EntityCollection(this._viewer.entities);
  }
  flyTo(options: {
    destination: Coordinate;
    orientation?: HeadingPitchRoll;
    duration?: number;
    complete?: () => void;
    cancel?: () => void;
  }): void {
    const destination = Cartesian3.fromDegrees(
      options.destination[0],
      options.destination[1],
      options.destination[2] || 0
    );

    const orientation = options.orientation
      ? {
          heading: HzMath.toRadians(options.orientation.heading),
          pitch: HzMath.toRadians(options.orientation.pitch),
          roll: HzMath.toRadians(options.orientation.roll),
        }
      : undefined;

    this._viewer.camera.flyTo({
      destination,
      orientation,
      duration: options.duration,
      complete: options.complete,
      cancel: options.cancel,
    });
  }

  addRasterLayer(provider: RasterProvider): void {
    const layer = new RasterLayer(provider);
    this._viewer.scene.imageryLayers.add(layer._layer);
    this.layers.push(layer);
  }

  removeRasterLayer(layer: RasterLayer): void {
    const index = this.layers.indexOf(layer);
    if (index !== -1) {
      this.layers.splice(index, 1);
      this._viewer.scene.imageryLayers.remove(layer._layer);
    }
  }
  setView(position: Coordinate, orientation: HeadingPitchRoll): void {
    this._viewer.camera.setView({
      destination: Cartesian3.fromDegrees(
        position[0],
        position[1],
        position[2] || 0
      ),
      orientation: {
        heading: HzMath.toRadians(orientation.heading),
        pitch: HzMath.toRadians(orientation.pitch),
        roll: HzMath.toRadians(orientation.roll),
      },
    });
  }
  addEntity(entity: Entity | EntityLike): Entity {
    this.entities.add(entity);
  }
  removeEntity(entity: Entity): void {
    this.entities.remove(entity);
  }
  destroy(): void {
    this._viewer.destroy();
  }
}

export function createViewer(
  element: string | HTMLElement,
  options: { key: string; sceneMode?: SceneMode }
) {
  return new HZViewer(element, options);
}

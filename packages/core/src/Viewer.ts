//@ts-nocheck
import {
  Cartesian3,
  ImageryProvider,
  Viewer,
  Math as CMath,
  ImageryLayer,
  Ion,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Entity,
  Cartographic,
  Cartesian2,
  BoundingSphere,
  HeadingPitchRange as CesiumHeadingPitchRange,
} from 'cesium';
import {
  Coordinate,
  EntityLike,
  EventTypes,
  HeadingPitchRoll,
  IEntity,
  ILayer,
  IViewer,
  MapEvent,
  RasterProvider,
  SceneMode,
  HeadingPitchRange,
} from './types';
import { RasterLayer } from './layers/RasterLayer';
import { HzMath } from './utils/math';
import { EntityCollection } from './entities/Collection';

export class HZViewer implements IViewer {
  private key: string;
  private sceneMode: SceneMode;
  private _viewer: Viewer;
  private layers: ILayer[] = [];
  private trackedEntity?: IEntity;
  private eventHandlers: Map<EventTypes, Array<(e: MapEvent) => void>> =
    new Map();

  entities: EntityCollection;

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
      creditContainer: document.createElement('div'),
      contextOptions: {
        webgl: {
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
        },
        allowTextureFilterAnisotropic: true,
      },
    });

    this._viewer.clock.shouldAnimate = true;
    this._viewer.resolutionScale = 1.5;

    this.entities = new EntityCollection(this._viewer.entities);

    this.initEvents();
  }
  setTrackEntity(entity: IEntity): void {
    this.trackedEntity = entity;
    this._viewer.trackedEntity = entity._entity;
  }
  getTrackEntity(): IEntity {
    return this.trackedEntity;
  }

  flyTo(options: {
    destination?: Coordinate;
    orientation?: HeadingPitchRoll;
    duration?: number;
    complete?: () => void;
    cancel?: () => void;
  }): void {
    // 否则使用传入的destination
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

  flyToEntities(options: {
    entities: IEntity[];
    headingPitchRange?: HeadingPitchRange;
  }): void {
    const { entities, headingPitchRange } = options;
    // 计算合并的包围球
    const boundingSphere = this.computeMergedBoundingSphere(entities);

    if (!boundingSphere) {
      console.log('无法计算包围球，请确认实体列表有效。');
      return;
    }
    const hpr = headingPitchRange
      ? new CesiumHeadingPitchRange(
          HzMath.toRadians(headingPitchRange.heading) || 0,
          HzMath.toRadians(headingPitchRange.pitch) || 0,
          HzMath.toRadians(headingPitchRange.range) || 0
        )
      : undefined;

    // 调整相机视角，使包围球位于视图中心
    this._viewer.camera.viewBoundingSphere(boundingSphere, hpr);
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

  zoomIn(amount?: number) {
    this._viewer.camera.zoomIn(amount);
  }

  zoomOut(amount?: number) {
    this._viewer.camera.zoomOut(amount);
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
  addEntity(entity: IEntity | EntityLike): IEntity {
    return this.entities.add(entity as any);
  }
  removeEntity(entity: IEntity): void {
    this.entities.remove(entity);
  }
  destroy(): void {
    this._viewer.destroy();
  }

  on(eventType: EventTypes, callback: (e: MapEvent) => void): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)?.push(callback);
  }

  off(eventType: EventTypes, callback: (e: MapEvent) => void): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(callback);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private initEvents() {
    const screenSpaceEventHandler = new ScreenSpaceEventHandler(
      this._viewer.scene.canvas
    );

    // 处理左键点击事件
    screenSpaceEventHandler.setInputAction((movement: any) => {
      const pickedObjects = this._viewer.scene.drillPick(movement.position);
      const coordinate = this.pixelToCoordinate(
        movement.position.x,
        movement.position.y
      );
      const entities = pickedObjects
        .map((obj) => obj.id)
        .filter((id) => id instanceof Entity)
        .map((entity) => this.entities.find((e) => e._entity === entity));
      this.triggerEvent(EventTypes.LEFT_CLICK, { coordinate, entities });
    }, ScreenSpaceEventType.LEFT_CLICK);

    // 处理右键点击事件
    screenSpaceEventHandler.setInputAction((movement: any) => {
      const pickedObjects = this._viewer.scene.drillPick(movement.position);
      const coordinate = this.pixelToCoordinate(
        movement.position.x,
        movement.position.y
      );
      const entities = pickedObjects
        .map((obj) => obj.id)
        .filter((id) => id instanceof Entity)
        .map((entity) => this.entities.find((e) => e._entity === entity));
      this.triggerEvent(EventTypes.RIGHT_CLICK, { coordinate, entities });
    }, ScreenSpaceEventType.RIGHT_CLICK);

    // 处理鼠标移动事件
    screenSpaceEventHandler.setInputAction((movement) => {
      const pickedObjects = this._viewer.scene.drillPick(movement.endPosition);
      const coordinate = this.pixelToCoordinate(
        movement.endPosition.x,
        movement.endPosition.y
      );

      
      const entities = pickedObjects
        .map((obj) => obj.id)
        .filter((id) => id instanceof Entity)
        .map((entity) => this.entities.find((e) => e._entity === entity));

      // @ts-ignore
      this.triggerEvent(EventTypes.MOUSE_MOVE, { coordinate, entities });
    }, ScreenSpaceEventType.MOUSE_MOVE);
  }

  private triggerEvent(eventType: EventTypes, e: MapEvent): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.forEach((handler) => handler(e));
    }
  }

  private pixelToCoordinate(x: number, y: number): Coordinate {
    const cartesian = this._viewer.scene.pickPosition(new Cartesian2(x, y));
    if (cartesian) {
      const cartographic = Cartographic.fromCartesian(cartesian);
      return [
        CMath.toDegrees(cartographic.longitude),
        CMath.toDegrees(cartographic.latitude),
        cartographic.height,
      ];
    }
    return null;
  }

  computeMergedBoundingSphere(entities: IEntity[]) {
    let combinedBoundingSphere;
    const currentTime = this._viewer.clock.currentTime;

    entities.forEach((entity) => {
      // 计算单个实体的包围球
      const dataSourceDisplay = this._viewer.dataSourceDisplay;
      const boundingSphere = new BoundingSphere();
      dataSourceDisplay.getBoundingSphere(entity._entity, true, boundingSphere);

      if (!boundingSphere) return; // 跳过无法计算包围球的实体

      if (!combinedBoundingSphere) {
        combinedBoundingSphere = BoundingSphere.clone(boundingSphere);
      } else {
        // 合并包围球
        BoundingSphere.union(
          combinedBoundingSphere,
          boundingSphere,
          combinedBoundingSphere
        );
      }
    });

    return combinedBoundingSphere;
  }
}

export function createViewer(
  element: string | HTMLElement,
  options: { key: string; sceneMode?: SceneMode }
) {
  return new HZViewer(element, options);
}

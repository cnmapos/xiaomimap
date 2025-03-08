import {
  AnimationController,
  AnimationTrack,
  CameraAnimationTarget,
  cameraFlyInterpolate,
} from '@hztx/animations';
import { HZViewer, EditorManager } from '@hztx/core';
import {
  CallbackProperty,
  CesiumTerrainProvider,
  Color,
  SceneMode,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Viewer,
  CatmullRomSpline,
  Cartographic,
  Math as CMath,
  UrlTemplateImageryProvider,
} from 'cesium';
import React, { useEffect, useRef } from 'react';
import MapContainer from '../components/map-container';
import { Button } from 'antd';

function Editor() {
  const aniCtr = new AnimationController();
  const context = useRef<{ viewer: Viewer }>({
    viewer: null,
  });
  useEffect(() => {
    const hz = new HZViewer('map', { sceneMode: SceneMode.SCENE3D });
    const { viewer }: { viewer: Viewer } = hz;
    const terrianProvider = CesiumTerrainProvider.fromUrl(
      // 星云图
      'https://tiles1.geovisearth.com/base/v1/terrain?token=fa74f216c7265ac713a224dcd0a4d0f20e27b61051ed729b587111b4c410528b'
      // 水经注
      //   'https://assets.ion.cesium.com/us-east-1/asset_depot/1/CesiumWorldTerrain/v1.2/{z}/{x}/{y}.terrain?extensions=octvertexnormals-metadata&v=1.2.0'
    );
    terrianProvider.then((provider) => {
      viewer.terrainProvider = provider;
    });
    context.current.viewer = viewer;

    viewer.resolutionScale = 2;

    const chinaTiles = new UrlTemplateImageryProvider({
      url: 'https://tiles2.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=fa74f216c7265ac713a224dcd0a4d0f20e27b61051ed729b587111b4c410528b', // 替换为中国行政区级别瓦片的URL
    });
    viewer.imageryLayers.addImageryProvider(chinaTiles);
    const topoTiles = new UrlTemplateImageryProvider({
      url: 'https://tiles1.geovisearth.com/base/v1/cia/{z}/{x}/{y}?format=webp&tmsIds=w&token=fa74f216c7265ac713a224dcd0a4d0f20e27b61051ed729b587111b4c410528b', // 替换为中国行政区级别瓦片的URL
    });
    viewer.imageryLayers.addImageryProvider(topoTiles);

    const cameraTarget = new CameraAnimationTarget(viewer.camera);
    const track1 = new AnimationTrack(cameraTarget, {
      interpolationFn: cameraFlyInterpolate,
    });

    track1.addKeyframe(0, {
      position: [-75.4204237390705, 33.85698238168112, 8567977.849840268],
      direction: [5.088887, -89.9190563526215],
    });
    track1.addKeyframe(500, {
      position: [104.297364, 30.549396, 1000.025086346157],
      direction: [0, -90],
    });
    aniCtr.addTrack(track1);

    return () => {
      viewer?.destroy();
    };
  }, []);

  function play() {
    aniCtr.play();
  }

  function pause() {
    aniCtr.pause();
  }

  function replay() {
    aniCtr.seek(0);
    play();
  }

  function addPoint() {
    const manager = new EditorManager(context.current.viewer);
    manager.startCreate('point', {}, (coordinates) => {
      console.log('point', coordinates);
    });
  }

  function addLine() {
    const manager = new EditorManager(context.current.viewer);
    manager.startCreate('line', {}, (coordinates) => {
      console.log('draw line', coordinates);
    });
  }

  function addPolygon() {
    const manager = new EditorManager(context.current.viewer);
    manager.startCreate('polygon', {}, (coordinates) => {
      console.log('draw polygon', coordinates);
    });
  }

  return (
    <MapContainer>
      <div style={{ width: '100%', height: '100%' }} id="map"></div>
      <div>
        <div className="hz-player">
          <div>
            <Button className="hz-btn" onClick={play}>
              播放
            </Button>
            <Button className="hz-btn" onClick={pause}>
              暂停
            </Button>
            <Button className="hz-btn" onClick={replay}>
              重新播放
            </Button>
          </div>
          <div>
            <Button className="hz-btn" onClick={addPoint}>
              添加点
            </Button>
            <Button className="hz-btn" onClick={addLine}>
              添加线
            </Button>
            <Button className="hz-btn" onClick={addPolygon}>
              添加面
            </Button>
          </div>
        </div>
        <div className="hz-style"></div>
      </div>
    </MapContainer>
  );
}

export default Editor;

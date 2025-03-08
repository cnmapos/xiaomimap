import {
  AnimationController,
  AnimationTrack,
  CameraAnimationTarget,
  cameraFlyInterpolate,
} from '@hztx/animations';
import { HZViewer } from '@hztx/core';
import {
  CallbackProperty,
  CesiumTerrainProvider,
  Color,
  SceneMode,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Viewer,
  CatmullRomSpline,
  Cartesian3,
  Entity,
  DirectionalLight,
  ShadowMode,
} from 'cesium';
import React, { useEffect, useRef } from 'react';
import MapContainer from '../components/map-container';
import { Button } from 'antd';

function Model3D() {
  const aniCtr = new AnimationController();
  const context = useRef<{ viewer: Viewer; model: Entity | null }>({
    viewer: null,
    model: null,
  });

  function loadModel(url: string) {
    if (context.current.model) {
      context.current.viewer.entities.remove(context.current.model);
    }
    context.current.model = context.current.viewer.entities.add({
      position: Cartesian3.fromDegrees(103.96546, 30.634155, 0),
      model: {
        uri: url, // 替换为实际模型路径
        minimumPixelSize: 256,
        maximumScale: 1280,
        imageBasedLightingFactor: new Cartesian3(1.0, 1.0, 1.0),
        lightColor: Color.WHITE,
      },
    });
  }

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
    // viewer.scene.globe.enableLighting = true;
    viewer.scene.light = new DirectionalLight({
      direction: new Cartesian3(1.0, 1.0, -1.0),
      intensity: 2.0,
    });
    viewer.scene.globe.shadows = ShadowMode.ENABLED;

    const cameraTarget = new CameraAnimationTarget(viewer.camera);
    const track1 = new AnimationTrack(cameraTarget, {
      interpolationFn: cameraFlyInterpolate,
    });

    track1.addKeyframe(0, {
      position: [-75.4204237390705, 33.85698238168112, 8567977.849840268],
      direction: [5.088887, -89.9190563526215],
    });
    track1.addKeyframe(500, {
      position: [103.96546, 30.634155, 1000.025086346157],
      direction: [0, -45.000137765029564],
    });
    aniCtr.addTrack(track1);

    // 加载三维模型
    loadModel('assets/models/car.glb');

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

  return (
    <MapContainer>
      <div style={{ width: '100%', height: '100%' }} id="map"></div>
      <div>
        <div className="hz-player">
          <Button className="hz-btn" onClick={play}>
            播放
          </Button>
          <Button className="hz-btn" onClick={pause}>
            暂停
          </Button>
          <Button className="hz-btn" onClick={replay}>
            重新播放
          </Button>
          <Button
            className="hz-btn"
            onClick={() => loadModel('assets/models/car.glb')}
          >
            加载轿车1
          </Button>
          <Button
            className="hz-btn"
            onClick={() => loadModel('assets/models/car2.glb')}
          >
            加载轿车2
          </Button>
          <Button
            className="hz-btn"
            onClick={() => loadModel('assets/models/aircraft.glb')}
          >
            加载航母
          </Button>
          <Button
            className="hz-btn"
            onClick={() => loadModel('assets/models/battleplane.glb')}
          >
            加载战斗机1
          </Button>
          <Button
            className="hz-btn"
            onClick={() => loadModel('assets/models/battleplane2.glb')}
          >
            加载战斗机2
          </Button>
          <Button
            className="hz-btn"
            onClick={() => loadModel('assets/models/flight.glb')}
          >
            加载民航飞机
          </Button>
          <Button
            className="hz-btn"
            onClick={() => loadModel('assets/models/people_run_1.glb')}
          >
            加载奔跑的人1
          </Button>
          <Button
            className="hz-btn"
            onClick={() => loadModel('assets/models/people_run_2.glb')}
          >
            加载奔跑的人2
          </Button>
        </div>
        <div className="hz-style"></div>
      </div>
    </MapContainer>
  );
}

export default Model3D;

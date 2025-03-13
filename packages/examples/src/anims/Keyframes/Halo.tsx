import React, { useEffect, useRef } from 'react';
import MapContainer from '../../components/map-container';
import { Button } from 'antd';
import {
  AnimationController,
  AnimationTrack,
  CameraAnimationTarget,
  cameraFlyInterpolate,
  PointHaloAnimationTarget,
} from '@hztx/animations';
import {
  Cartesian3,
  CircleGeometry,
  GeometryInstance,
  Material,
  MaterialAppearance,
  Primitive,
  SceneMode,
  Viewer,
} from 'cesium';
import { HZViewer } from '@hztx/core';

function createCirclePrimitive(
  position: [number, number, number?],
  options: { radius?: number; color?: string }
) {
  const { radius = 1000, color = '#FF0' } = options;

  const center = Cartesian3.fromDegrees(...position);
  // 创建圆形几何
  const circleGeometry = new CircleGeometry({
    center: center,
    radius: radius,
    height: 1,
  });

  // 创建几何实例
  const circleInstance = new GeometryInstance({
    geometry: circleGeometry,
  });

  // 创建外观
  const appearance = new MaterialAppearance({
    material: Material.fromType('Color', { color: color }),
    flat: true,
  });

  // 创建Primitive并添加到场景中
  const circlePrimitive = new Primitive({
    geometryInstances: circleInstance,
    appearance: appearance,
    asynchronous: false,
  });

  return circlePrimitive;
}

function Polygon() {
  const aniCtr = new AnimationController();
  const context = useRef<{ viewer: Viewer }>({
    viewer: null,
  });

  useEffect(() => {
    const hz = new HZViewer('map', { sceneMode: SceneMode.SCENE3D });
    const { viewer }: { viewer: Viewer } = hz;
    context.current.viewer = viewer;

    // 实现一个简单动画，从全球场景飞到成都市
    const cameraTarget = new CameraAnimationTarget(viewer.camera);
    const track1 = new AnimationTrack(cameraTarget, {
      interpolationFn: cameraFlyInterpolate,
    });

    track1.addKeyframe(1000, {
      position: [-75.4204237390705, 33.85698238168112, 8567977.849840268],
      direction: [5.088887, -89.9190563526215],
    });
    track1.addKeyframe(2000, {
      position: [104.15175065097104, 30.71616947969781, 9986.025086346157],
      direction: [0, -45.000137765029564],
    });

    const primitive = createCirclePrimitive(
      [104.16786962664, 30.758956891, 10000],
      { radius: 10000, color: '#0F0' }
    );
    const circleTarget = new PointHaloAnimationTarget(primitive);
    viewer.scene.primitives.add(circleTarget.innerPrimitive);
    viewer.scene.primitives.add(circleTarget.outPrimitive);
    const track2 = new AnimationTrack(circleTarget);
    track2.addKeyframe(3000, 0, { repeat: true, duration: 1500 });
    track2.addKeyframe(4000 * 20, 1);

    const primitive2 = createCirclePrimitive(
      [104.267869626642999, 30.759956896017201, 10000],
      { radius: 10000, color: '#F00' }
    );
    const circleTarget2 = new PointHaloAnimationTarget(primitive2);
    viewer.scene.primitives.add(circleTarget2.innerPrimitive);
    viewer.scene.primitives.add(circleTarget2.outPrimitive);
    const track3 = new AnimationTrack(circleTarget2);
    track3.addKeyframe(3500, 0, { repeat: true, duration: 1500 });
    track3.addKeyframe(4000 * 20, 1);

    aniCtr.addTrack(track1);
    aniCtr.addTrack(track2);
    aniCtr.addTrack(track3);

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
        </div>
        <div className="hz-style"></div>
      </div>
    </MapContainer>
  );
}

export default Polygon;

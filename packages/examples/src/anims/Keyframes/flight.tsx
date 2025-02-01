import React, { useEffect, useRef } from 'react';
import MapContainer from '../../components/map-container';
import { Button } from 'antd';
import {
  AnimationController,
  AnimationTrack,
  createPointRoamingSlerp,
  parabolaInterpolate,
  PointRoamingAnimationTarget,
} from '@hztx/animations';
import {
  Cartesian3,
  Color,
  PolylineGlowMaterialProperty,
  SceneMode,
  Viewer,
} from 'cesium';
import { HZViewer } from '@hztx/core';
import PathGeoJSONData from '../assets/pathForBike.json';

function Trace() {
  const aniCtr = new AnimationController();
  const context = useRef<{ viewer: Viewer }>({
    viewer: null,
  });

  let animationFrameId: number;

  useEffect(() => {
    const hz = new HZViewer('map', { sceneMode: SceneMode.SCENE3D });
    const { viewer }: { viewer: Viewer } = hz;
    context.current.viewer = viewer;

    const start = [116.405285, 39.904989];
    const end = [104.065735, 30.659462];
    const wayPoints = [[108.405285, 35.904989, 100000]];
    const imageEntity = viewer.entities.add({
      name: 'Moving Image',
      position: Cartesian3.fromDegrees(...start, 0),
      billboard: {
        image: 'assets/airplane.png', // 'assets/airplane.png', // 替换为你的图片路径
        width: 50,
        height: 50,
      },
    });
    const lineEntity = viewer.entities.add({
      name: 'Path',
      polyline: {
        // positions: Cartesian3.fromDegreesArrayHeights(coordinates.flat()),
        positions: [],
        width: 5,
        material: new PolylineGlowMaterialProperty({
          glowPower: 0.2,
          color: Color.fromCssColorString('#FF0000'),
        }),
        //箭头
        // material: new PolylineArrowMaterialProperty(Color.ORANGE),
        // clampToGround: true,
      },
    });
    viewer.trackedEntity = imageEntity;
    const target = new PointRoamingAnimationTarget(imageEntity, lineEntity);
    const track = new AnimationTrack(target, {
      interpolationFn: parabolaInterpolate({ height: 300000 }),
    });
    track.addKeyframe(0, start);
    track.addKeyframe(10000, end);

    aniCtr.addTrack(track);
    return () => {
      viewer?.destroy();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  function play() {
    aniCtr.play();
  }

  function pause() {
    aniCtr.pause();
  }

  function replay() {
    aniCtr.reset();
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

export default Trace;

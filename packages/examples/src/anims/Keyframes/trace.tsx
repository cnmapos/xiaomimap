import React, { useEffect, useRef } from 'react';
import MapContainer from '../../components/map-container';
import { Button, Radio } from 'antd';
import {
  AnimationController,
  AnimationTrack,
  CameraAnimationTarget,
  createPointRoamingSlerp,
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

    const start = PathGeoJSONData.features[0].geometry.coordinates[0];
    const end = PathGeoJSONData.features[0].geometry.coordinates.at(-1);
    const wayPoints = PathGeoJSONData.features[0].geometry.coordinates.slice(
      1,
      -1
    ) as [number, number, number][];
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
        clampToGround: true,
      },
    });
    const target = new PointRoamingAnimationTarget(imageEntity, lineEntity);
    const track = new AnimationTrack(target, {
      interpolationFn: createPointRoamingSlerp(wayPoints),
    });
    track.addKeyframe(0, start);
    track.addKeyframe(3000, end);

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

export default Trace;

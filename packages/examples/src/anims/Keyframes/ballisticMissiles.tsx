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
  HeadingPitchRoll,
  PolylineGlowMaterialProperty,
  SceneMode,
  Transforms,
  UrlTemplateImageryProvider,
  Viewer,
} from 'cesium';
import { HZViewer } from '@hztx/core';
import PathGeoJSONData from '../assets/pathForBike.json';

const HEIGHT = 10000;

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

    viewer.resolutionScale = 2;

    const chinaTiles = new UrlTemplateImageryProvider({
      url: 'https://tiles2.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=fa74f216c7265ac713a224dcd0a4d0f20e27b61051ed729b587111b4c410528b', // 替换为中国行政区级别瓦片的URL
    });
    viewer.imageryLayers.addImageryProvider(chinaTiles);
    const topoTiles = new UrlTemplateImageryProvider({
      url: 'https://tiles1.geovisearth.com/base/v1/cia/{z}/{x}/{y}?format=webp&tmsIds=w&token=fa74f216c7265ac713a224dcd0a4d0f20e27b61051ed729b587111b4c410528b', // 替换为中国行政区级别瓦片的URL
    });
    viewer.imageryLayers.addImageryProvider(topoTiles);

    const start = [119.44272869790059, 25.581238625271528, HEIGHT];
    const end = [-100.01966972905115, 39.229725061949104, HEIGHT];
    const wayPoints = [[0.44272869790059, 25.581238625271528, HEIGHT]];
    const modelEntity = context.current.viewer.entities.add({
      position: Cartesian3.fromDegrees(...start),
      show: true,
      model: {
        uri: 'assets/models/ballistic1.glb', // 替换为实际模型路径
        // minimumPixelSize: 256 * 16,
        // maximumScale: 1280,
        scale: 1500000,
        imageBasedLightingFactor: new Cartesian3(1.0, 1.0, 1.0),
        lightColor: Color.WHITE,
      },
      //   orientation: Transforms.headingPitchRollQuaternion(
      //     Cartesian3.fromDegrees(...start),
      //     new HeadingPitchRoll(Math.PI, 0, 0)
      //   ),
    });
    const lineEntity = viewer.entities.add({
      name: 'Path',
      polyline: {
        // positions: Cartesian3.fromDegreesArrayHeights(coordinates.flat()),
        positions: [],
        width: 20,
        material: new PolylineGlowMaterialProperty({
          glowPower: 0.2,
          taperPower: 0.25,
          color: Color.fromCssColorString('#FF0000'),
        }),
        //箭头
        // material: new PolylineArrowMaterialProperty(Color.ORANGE),
        // clampToGround: true,
      },
    });
    viewer.trackedEntity = modelEntity;
    const target = new PointRoamingAnimationTarget(modelEntity, lineEntity, {
      heading: -Math.PI / 2,
    });
    const track = new AnimationTrack(target, {
      interpolationFn: createPointRoamingSlerp([], { toEast: true }),
    });
    track.addKeyframe(0, start);
    track.addKeyframe(10000, end);

    aniCtr.addTrack(track);
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

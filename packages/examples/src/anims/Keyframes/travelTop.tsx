import React, { useEffect, useRef } from 'react';
import MapContainer from '../../components/map-container';
import { Button } from 'antd';
import {
  AnimationController,
  AnimationTrack,
  CameraAnimationTarget,
  cameraFlyInterpolate,
  PointHaloAnimationTarget,
  TextTagAnimationTarget,
} from '@hztx/animations';
import {
  Cartesian3,
  CircleGeometry,
  Color,
  Entity,
  GeometryInstance,
  Material,
  MaterialAppearance,
  Primitive,
  SceneMode,
  Viewer,
} from 'cesium';
import { HZViewer } from '@hztx/core';
import { TagsPlayer } from '../TextTag/Player';

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

const haloRadius = 2000;
const OFFSETY = 2000;
const OFFSETX = 2000;
const OFFSETZ = 2000;

function TravelTop() {
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

    const data = [
      {
        cameraFly: {
          start: 0,
          end: 1000,
          fly: {
            end: {
              position: [
                121.74990508677502, 31.003442173942535, 26252.302494599673,
              ],
              direction: [0, -45.37356917309797],
            },
            start: {
              position: [
                -75.4204237390705, 33.85698238168112, 8567977.849840268,
              ],
              direction: [5.088887, -89.9190563526215],
            },
          },
        },
        pois: {
          positions: [
            {
              position: [121.492156, 31.233462],
              radius: haloRadius,
              color: '#FF0',
              duration: 1500,
              name: '外滩',
              tagAlign: 'top',
              offset: [OFFSETX, OFFSETY, OFFSETZ * 2],
            },
            {
              position: [121.661348, 31.143768],
              radius: haloRadius,
              color: '#FF0',
              duration: 1500,
              name: '迪士尼乐园',
              tagAlign: 'top',
              offset: [-OFFSETX, OFFSETY, OFFSETZ],
            },
            {
              position: [121.49093, 31.226959],
              radius: haloRadius,
              color: '#FF0',
              duration: 1500,
              name: '豫园',
              offset: [-OFFSETX, OFFSETY, OFFSETZ],
              tagAlign: 'top',
            },
          ],
          start: 1000,
          end: 300000,
        },
      },
    ];

    for (let i = 0; i < data.length; i++) {
      const { cameraFly, pois } = data[i];
      const { start, end, fly } = cameraFly;
      const { start: s, end: e } = fly;

      const flyTrack = new AnimationTrack(cameraTarget, {
        interpolationFn: cameraFlyInterpolate,
      });
      flyTrack.addKeyframe(start, s);
      flyTrack.addKeyframe(end, e);
      aniCtr.addTrack(flyTrack);

      const { positions, start: cStart, end: cEnd } = pois;
      positions.forEach((p) => {
        const primitive = createCirclePrimitive([...p.position, 1], {
          radius: p.radius,
          color: p.color,
        });
        const circleTarget = new PointHaloAnimationTarget(primitive);
        viewer.scene.primitives.add(circleTarget.innerPrimitive);
        viewer.scene.primitives.add(circleTarget.outPrimitive);
        const track = new AnimationTrack(circleTarget);
        track.addKeyframe(cStart, 0, { repeat: true, duration: p.duration });
        track.addKeyframe(cEnd, 1);
        aniCtr.addTrack(track);

        const poiEntity = new Entity({
          position: Cartesian3.fromDegrees(...p.position),
          point: {
            pixelSize: 10,
            color: Color.fromCssColorString('#FFF'),
          },
        });
        const tagTarget = new TextTagAnimationTarget(poiEntity, {
          title: p.name,
          color: p.color,
          offset: p.offset,
          align: p.tagAlign || 'top',
        });
        viewer.entities.add(poiEntity);
        viewer.entities.add(tagTarget.lineEntity);
        viewer.entities.add(tagTarget.billboardEntity);
        const tagTrack = new AnimationTrack(tagTarget);
        tagTrack.addKeyframe(cStart, 0);
        tagTrack.addKeyframe(cStart + 10000, 1);
        aniCtr.addTrack(tagTrack);
      });
    }

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

export default TravelTop;

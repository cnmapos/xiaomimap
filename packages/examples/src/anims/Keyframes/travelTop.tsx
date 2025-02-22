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

    // const chinaTiles = new UrlTemplateImageryProvider({
    //   url: 'https://tiles2.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=fa74f216c7265ac713a224dcd0a4d0f20e27b61051ed729b587111b4c410528b', // 替换为中国行政区级别瓦片的URL
    // });
    // viewer.imageryLayers.addImageryProvider(chinaTiles);
    // const topoTiles = new UrlTemplateImageryProvider({
    //   url: 'https://tiles1.geovisearth.com/base/v1/cia/{z}/{x}/{y}?format=webp&tmsIds=w&token=fa74f216c7265ac713a224dcd0a4d0f20e27b61051ed729b587111b4c410528b', // 替换为中国行政区级别瓦片的URL
    // });
    // viewer.imageryLayers.addImageryProvider(topoTiles);

    // 实现一个简单动画，从全球场景飞到成都市
    const cameraTarget = new CameraAnimationTarget(viewer.camera);

    const data = [
      // 上海
      {
        cameraFly: {
          start: 0,
          end: 1000,
          fly: {
            end: {
              position: [
                121.57341937938517, 30.769366775443462, 25861.224301018647,
              ],
              direction: [0, -21],
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
          start: 1500,
          end: 300000,
        },
      },
      // 三亚
      {
        cameraFly: {
          start: 0,
          end: 1000,
          fly: {
            end: {
              position: [
                109.63600309661167, 17.939127404999923, 93950.61101582817,
              ],
              direction: [0, -66],
            },
            start: {
              position: [
                121.57341937938517, 30.769366775443462, 25861.224301018647,
              ],
              direction: [0, -21],
            },
          },
        },
        pois: {
          positions: [
            {
              position: [109.647656, 18.234236],
              radius: haloRadius,
              color: '#FF0',
              duration: 1500,
              name: '亚龙湾',
              tagAlign: 'top',
              offset: [OFFSETX, OFFSETY, OFFSETZ * 2],
            },
            {
              position: [109.348173, 18.294961],
              radius: haloRadius,
              color: '#FF0',
              duration: 1500,
              name: '天涯海角',
              tagAlign: 'top',
              offset: [OFFSETX, OFFSETY, OFFSETZ * 2],
            },
            {
              position: [109.766409, 18.310365],
              radius: haloRadius,
              color: '#FF0',
              duration: 1500,
              name: '蜈支洲岛',
              tagAlign: 'top',
              offset: [OFFSETX, OFFSETY, OFFSETZ * 2],
            },
          ],
          start: 1000,
          end: 300000,
        },
      },
      // 西安
      {
        cameraFly: {
          start: 0,
          end: 1000,
          fly: {
            end: {
              position: [
                109.03362824359297, 33.67653038642466, 44918.88003755327,
              ],
              direction: [7.450792886699177, -32.25210236120793],
            },
            start: {
              position: [
                109.63600309661167, 17.939127404999923, 93950.61101582817,
              ],
              direction: [0, -66],
            },
          },
        },
        pois: {
          positions: [
            {
              position: [109.28196, 34.386214],
              radius: haloRadius,
              color: '#FF0',
              duration: 1500,
              name: '秦始皇兵马俑',
              tagAlign: 'top',
              offset: [OFFSETX, OFFSETY, OFFSETZ * 2],
            },
            {
              position: [108.947207, 34.275848],
              radius: haloRadius,
              color: '#FF0',
              duration: 1500,
              name: '古城墙',
              tagAlign: 'top',
              offset: [OFFSETX, OFFSETY, OFFSETZ * 2],
            },
            {
              position: [108.964162, 34.218285],
              radius: haloRadius,
              color: '#FF0',
              duration: 1500,
              name: '大雁塔',
              tagAlign: 'top',
              offset: [OFFSETX, OFFSETY, OFFSETZ * 2],
            },
          ],
          start: 1000,
          end: 300000,
        },
      },
      {
        cameraFly: {
          start: 0,
          end: 1000,
          fly: {
            end: {
              position: [
                103.799733622973, 29.927588834721412, 75539.87720785671,
              ],
              direction: [7.450792886699177, -32.25210236120793],
            },
            start: {
              position: [
                109.03362824359297, 33.67653038642466, 44918.88003755327,
              ],
              direction: [7.450959847442252, -32.254125485208],
            },
          },
        },
        pois: {
          positions: [
            {
              position: [104.138176, 30.740573],
              radius: haloRadius + 500,
              color: '#FF0',
              duration: 1500,
              name: '熊猫基地',
              tagAlign: 'top',
              offset: [OFFSETX, OFFSETY, OFFSETZ * 2],
            },
            {
              position: [104.052331, 30.663189],
              radius: haloRadius + 500,
              color: '#FF0',
              duration: 1500,
              name: '宽窄巷子',
              tagAlign: 'top',
              offset: [OFFSETX, OFFSETY, OFFSETZ * 2],
            },
            {
              position: [103.609836, 31.004221],
              radius: haloRadius + 500,
              color: '#FF0',
              duration: 1500,
              name: '都江堰',
              tagAlign: 'top',
              offset: [OFFSETX, OFFSETY, OFFSETZ * 2],
            },
          ],
          start: 1000,
          end: 300000,
        },
      },
      {
        cameraFly: {
          start: 0,
          end: 1000,
          fly: {
            end: {
              position: [
                120.12710688383741, 30.01907283885324, 13082.068737672449,
              ],
              direction: [1.508161315676096, -20.08021275602418],
            },
            start: {
              position: [
                103.799733622973, 29.927588834721412, 75539.87720785671,
              ],
              direction: [7.450792886699177, -32.25210236120793],
            },
          },
        },
        pois: {
          positions: [
            {
              position: [120.142582, 30.24752],
              radius: haloRadius,
              color: '#FF0',
              duration: 1500,
              name: '西湖',
              tagAlign: 'top',
              offset: [OFFSETX, OFFSETY, OFFSETZ],
            },
            {
              position: [120.102077, 30.240012],
              radius: haloRadius,
              color: '#FF0',
              duration: 1500,
              name: '灵隐寺',
              tagAlign: 'top',
              offset: [OFFSETX, OFFSETY, OFFSETZ],
            },
            {
              position: [119.011533, 29.594371],
              radius: haloRadius,
              color: '#FF0',
              duration: 1500,
              name: '千岛湖',
              tagAlign: 'top',
              offset: [OFFSETX, OFFSETY, OFFSETZ * 2],
            },
          ],
          start: 1000,
          end: 300000,
        },
      },
      {
        cameraFly: {
          start: 0,
          end: 1000,
          fly: {
            end: {
              position: [
                118.07243621645493, 24.229609094166147, 28834.416318571817,
              ],
              direction: [6.383444766873809, -41.94654321271545],
            },
            start: {
              position: [
                120.12710688383741, 30.01907283885324, 13082.068737672449,
              ],
              direction: [1.508161315676096, -20.08021275602418],
            },
          },
        },
        pois: {
          positions: [
            {
              position: [118.066347, 24.444104],
              radius: haloRadius,
              color: '#FF0',
              duration: 1500,
              name: '鼓浪屿',
              tagAlign: 'top',
              height: 20,
              offset: [OFFSETX, OFFSETY, OFFSETZ * 2],
            },
            {
              position: [118.126072, 24.547813],
              radius: haloRadius,
              color: '#FF0',
              duration: 1500,
              name: '环岛路',
              tagAlign: 'top',
              height: 20,
              offset: [OFFSETX, OFFSETY, OFFSETZ * 2],
            },
            {
              position: [118.124797, 24.425823],
              radius: haloRadius,
              color: '#FF0',
              duration: 1500,
              name: '曾厝垵',
              tagAlign: 'top',
              height: 20,
              offset: [OFFSETX, OFFSETY, OFFSETZ * 2],
            },
          ],
          start: 1000,
          end: 300000,
        },
      },
    ];

    let time = 0;
    for (let i = 0; i < data.length; i++) {
      const { cameraFly, pois } = data[i];
      const { start, end, fly } = cameraFly;
      const { start: s, end: e } = fly;

      const flyTrack = new AnimationTrack(cameraTarget, {
        interpolationFn: cameraFlyInterpolate,
      });
      flyTrack.addKeyframe(time, s);
      flyTrack.addKeyframe(time + 1000, e);
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
        track.addKeyframe(time, 0, { repeat: true, duration: p.duration });
        track.addKeyframe(time + 300000, 1);
        aniCtr.addTrack(track);

        const poiTime = time + 1500;

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
        tagTrack.addKeyframe(poiTime, 0);
        tagTrack.addKeyframe(poiTime + 1000, 1);
        aniCtr.addTrack(tagTrack);
      });

      time += 13000;
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

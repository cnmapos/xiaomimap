import React, { useEffect, useRef } from 'react';
import MapContainer from '../../components/map-container';
import { Button, Radio } from 'antd';
import {
  AnimationController,
  AnimationTrack,
  CameraAnimationTarget,
  cameraFlyInterpolate,
  UniformAnimationTarget,
} from '@hztx/animations';
import {
  Cartesian3,
  Color,
  GeometryInstance,
  Material,
  MaterialAppearance,
  PolygonGeometry,
  PolylineGeometry,
  PolylineMaterialAppearance,
  Primitive,
  SceneMode,
  Viewer,
} from 'cesium';
import { HZViewer } from '@hztx/core';
import chinaGEOJSON from '../../assets/geo/china.json';

enum Direction {
  leftRight = 0,
  rightLeft = 1,
  upDown = 2,
  downUp = 3,
}

function createEntities(coordinates: [number, number, number][]) {
  const color = Color.RED;
  const direction = Direction.leftRight;
  const showOutline = true;

  const primitive = new Primitive({
    geometryInstances: new GeometryInstance({
      geometry: new PolygonGeometry({
        polygonHierarchy: {
          positions: Cartesian3.fromDegreesArray(coordinates.flat()),
          holes: [],
        },
      }),
    }),
    appearance: new MaterialAppearance({
      material: new Material({
        fabric: {
          type: 'FadeMaterial',
          uniforms: {
            time: 0.0,
            r: color.red,
            g: color.green,
            b: color.blue,
          },
          source: `
          uniform float time;
          uniform float r;
          uniform float g;
          uniform float b;

          czm_material czm_getMaterial(czm_materialInput materialInput)
          {
              czm_material material = czm_getDefaultMaterial(materialInput);
              float fade = smoothstep(0.0, 1.0, time);
              ${
                direction === Direction.leftRight
                  ? `
                      if (materialInput.st.x > fade) {
                          discard;
                      }
                  `
                  : direction === Direction.rightLeft
                    ? `
                      if (materialInput.st.x < 1.0 - fade) {
                          discard;
                      }
                  `
                    : direction === Direction.downUp
                      ? `
                      if (materialInput.st.y > fade) {
                          discard;
                      }`
                      : ` 
                       if (materialInput.st.y < 1.0 - fade) {
                          discard;
                      }
                    `
              }
              fade = max(fade, 0.1);
              material.diffuse = vec3(r, g, b); // 红色
              material.alpha = fade;
              return material;
          }
      `,
        },
      }),
    }),
  });

  const points = Cartesian3.fromDegreesArray(coordinates.flat());
  const edgeGeometry = new PolylineGeometry({
    positions: points,
    width: 5,
  });
  const edgePrimitive = new Primitive({
    geometryInstances: new GeometryInstance({
      geometry: edgeGeometry,
    }),
    appearance: new PolylineMaterialAppearance({
      material: new Material({
        fabric: {
          type: 'FadeMaterial',
          uniforms: {
            time: 0.0,
            r: color.red,
            g: color.green,
            b: color.blue,
          },
          source: `
            uniform float time;
            uniform float r;
            uniform float g;
            uniform float b;

            czm_material czm_getMaterial(czm_materialInput materialInput)
            {
                czm_material material = czm_getDefaultMaterial(materialInput);
                float fade = smoothstep(0.0, 1.0, time);

                if (materialInput.st.y > fade) {
                    discard;
                }

                fade = max(fade, 0.1);
                material.diffuse = vec3(r, g, b); // 红色
                material.alpha = ${showOutline ? 'fade' : '0.0'};
                return material;
            }
        `,
        },
      }),
    }),
  });

  return [primitive, edgePrimitive];
}

function Polygon() {
  const aniCtr = new AnimationController();
  const context = useRef<{ viewer: Viewer }>({
    viewer: null,
  });

  let animationFrameId: number;

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
      position: [102.49978448388684, 22.524896018580144, 1065158.853875258],
      direction: [0, -45],
    });

    aniCtr.addTrack(track1);

    const coordinates =
      chinaGEOJSON.features.find((item) => item.properties.code === 510000)
        ?.geometry.coordinates[0][0] || [];
    const [primitive, edgePrimitive] = createEntities(coordinates);
    viewer.scene.primitives.add(primitive);
    viewer.scene.primitives.add(edgePrimitive);
    const primitiveTarget = new UniformAnimationTarget(primitive, ['time']);
    const edgePrimitiveTarget = new UniformAnimationTarget(edgePrimitive, [
      'time',
    ]);
    const track2 = new AnimationTrack([primitiveTarget, edgePrimitiveTarget]);
    track2.addKeyframe(3000, 0);
    track2.addKeyframe(6000, 1);
    aniCtr.addTrack(track2);

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

export default Polygon;

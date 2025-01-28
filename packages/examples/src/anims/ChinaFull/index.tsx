import { useContext, useEffect, useRef, useState } from 'react';
import MapContainer from '../../components/map-container';
import {
  CallbackProperty,
  Cartesian3,
  Math as CMath,
  Cartographic,
  Color,
  PolylineArrowMaterialProperty,
  Cartesian2,
  Viewer,
  defined,
  PolygonGraphics,
  Material,
  MaterialAppearance,
  PolygonGeometry,
  GeometryInstance,
  Primitive,
  Matrix4,
  SceneMode,
  GeoJsonDataSource,
  LabelStyle,
  VerticalOrigin,
  LabelGraphics,
  JulianDate,
  Entity,
  HeightReference,
  Property,
  SampledProperty,
  PolylineGraphics,
  PolylineGlowMaterialProperty,
  HeadingPitchRoll,
  EasingFunction,
} from 'cesium';
import { HZViewer } from '@hztx/core';
import { Button, ColorPicker, InputNumber, Select, Switch } from 'antd';
import chinaJSON from '../../assets/china.json';
import { PolygonPlayer } from './PolygonPlayer';
import { TagsPlayer } from '../ImageTag/Player';
import { Animator } from './animations';
import { duration } from 'html2canvas/dist/types/css/property-descriptors/duration';
import { IPlayer } from '../../types';

const Video = () => {
  const [color, setColor] = useState('#24BF7C');
  const context = useRef<{ viewer: Viewer; recorder: any }>({
    viewer: null,
    recorder: new CCapture({ format: 'webm', framerate: 30 }),
  });
  const height = 2500;
  const districtMap = new Map();
  const centerMap = new Map();

  useEffect(() => {
    const hz = new HZViewer('map', { sceneMode: SceneMode.COLUMBUS_VIEW });
    const { viewer }: { viewer: Viewer } = hz;
    context.current.viewer = viewer;

    viewer.scene.globe.undergroundColor = new Color(0, 0, 0, 1);
    viewer.scene.globe.baseColor = Color.fromCssColorString('#000');
    viewer.scene.skyBox.show = false;
    viewer.scene.skyAtmosphere.show = false;
    viewer.scene.backgroundColor = new Color(0, 0, 0, 1);
    viewer.imageryLayers.get(0).show = false;

    viewer.camera.changed.addEventListener(() => {
      const cartographic = viewer.camera.positionCartographic;
      console.log(
        'camera position',
        CMath.toDegrees(cartographic.longitude),
        ',',
        CMath.toDegrees(cartographic.latitude),
        ',',
        cartographic.height
      );
      console.log(
        'camera direction',
        CMath.toDegrees(viewer.camera.heading),
        ',',
        CMath.toDegrees(viewer.camera.pitch),
        ',',
        CMath.toDegrees(viewer.camera.roll)
      );
    });

    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(
        104.01916352656762,
        30.00340694312018,
        69527.1232469771
      ),
      orientation: {
        heading: CMath.toRadians(0),
        pitch: CMath.toRadians(-40.0524657),
        roll: 0,
        up: Cartesian3.UNIT_Z,
      },
    });

    const labelEntities: any[] = [];
    viewer.dataSources
      .add(
        GeoJsonDataSource.load('assets/geo/chengdu.json', {
          fill: Color.GRAY.withAlpha(1),
          stroke: Color.WHITE,
          strokeWidth: 5,
        }).then((dataSource) => {
          const entities = dataSource.entities.values;

          for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            if (entity.polygon) {
              // entity.show = false;
              entity.polygon.extrudedHeight = height;
            }

            if (!entity.properties?.name) {
              continue;
            }
            const name = entity.properties!.name.getValue(JulianDate.now());

            const positions = entity.polygon.hierarchy
              .getValue(JulianDate.now())
              .positions.map((p) => {
                const cartographic = Cartographic.fromCartesian(p);
                const lon = CMath.toDegrees(cartographic.longitude);
                const lat = CMath.toDegrees(cartographic.latitude);

                return [lon, lat];
              });
            const positionsArr = districtMap.get(name) || [];
            positionsArr.push(positions);
            districtMap.set(name, positionsArr);

            const [lng, lat] = entity.properties!.cp.getValue(JulianDate.now());
            centerMap.set(name, [lng, lat]);
            // 创建一个新的实体
            const newEntity = new Entity({
              position: Cartesian3.fromDegrees(lng, lat, height + 10),
              name: name,
              label: {
                text: name,
                font: 'bold 14px sans-serif',
                // style: LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 1,
                fillColor: Color.WHITE,
                // outlineColor: Color.GOLD.withAlpha(0.6),
                verticalOrigin: VerticalOrigin.BOTTOM,
                showBackground: true,
                backgroundColor: Color.BLACK.withAlpha(0.1),
                backgroundPadding: new Cartesian2(7, 5),
                // heightReference: HeightReference.CLAMP_TO_GROUND,
              },
            });
            labelEntities.push(newEntity);
          }

          return dataSource;
        })
      )
      .finally(() => {
        console.log('labelEntities', labelEntities);
        labelEntities.forEach((entity) => {
          viewer?.entities.add(entity);
        });
      });

    // 添加成都边界 https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=510100
    viewer.dataSources
      .add(
        GeoJsonDataSource.load(
          'https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=510100',
          {
            fill: Color.GRAY.withAlpha(0.0),
            stroke: Color.WHITE,
            strokeWidth: 5,
          }
        )
      )
      .then((dataSource) => {
        dataSource.entities.values.forEach((e) => {
          e.polyline = new PolylineGraphics({
            material: new PolylineGlowMaterialProperty({
              color: Color.WHITE,
              glowPower: 0.3,
            }),
            width: 7, // 设置宽度
            positions: e.polygon.hierarchy
              .getValue(JulianDate.now())
              .positions.map((p) => {
                const cartographic = Cartographic.fromCartesian(p);
                const lon = CMath.toDegrees(cartographic.longitude);
                const lat = CMath.toDegrees(cartographic.latitude);

                return Cartesian3.fromDegrees(lon, lat, height + 1);
              }), // 设置位置
          });
        });

        return dataSource;
      });

    return () => {
      viewer.destroy();
    };
  }, []);
  const play = async () => {
    // for (const [key, value] of districtMap) {
    //   if (value.length > 1) {
    //     const player = new PolygonPlayer(context.current.viewer, value, {
    //       color: '#DB7093',
    //       extrudedHeight: height + 1,
    //       direction: 0,
    //       showOutline: true,
    //       outlineColor: '#DB7093',
    //       outlineWidth: 5,
    //     });
    //     player.play();
    //     // break;
    //   }
    // }

    // for (const [key, value] of centerMap) {
    //   new TagsPlayer(context.current.viewer, value, {
    //     imageUrl: 'assets/hangmu.png',
    //     offset: { x: 10, y: -10, z: 500 },
    //     align: 'top',
    //     title: '成都网红楼盘',
    //     color: color,
    //     fontColor: color,
    //     height: height + 500,
    //   });
    // }

    const topHouseMap = [
      {
        district: '金牛区',
        name: '绿地世纪城',
        price: 1.64,
        imageUrl: 'assets/houses/金牛区.png',
        imageWidth: 250,
        position: [104.079969, 30.720682],
        imageHeight: (250 * 3) / 4,
        color: '#FFDEAD',
        camera: [104.06097457973259, 30.53333036567943, 18727.677837615833],
        direction: [2, -34],
      },
      {
        district: '青羊区',
        name: '凯德风尚',
        price: 2.28,
        imageUrl: 'assets/houses/青羊区.png',
        imageWidth: 250,
        position: [103.955748, 30.670359],
        imageHeight: (250 * 3) / 4,
        color: '#E6E6FA',
        camera: [104.00503721479751, 30.46443552627737, 25406.827256054617],
        direction: [2, -34],
      },
      {
        district: '成华区',
        name: '招商中央华城二期',
        price: 2.5,
        imageUrl: 'assets/houses/青羊区.png',
        imageWidth: 250,
        position: [104.134174, 30.672566],
        imageHeight: (250 * 3) / 4,
        color: '#6A5ACD',
        camera: [104.14732447727128, 30.5690715662249, 13437.478566139936],
        direction: [360, -40.05246569999956],
      },
      {
        district: '武侯区',
        name: '桐梓林欧城',
        price: 2.44,
        imageUrl: 'assets/houses/武侯区.png',
        imageWidth: 250,
        position: [104.061604, 30.610669],
        imageHeight: (250 * 3) / 4,
        color: '#FFA07A',
        camera: [103.99834545951875, 30.46549099973109, 21633.808647939935],
        direction: [359.9999999999998, -40.05246570000383],
      },
      {
        district: '锦江区',
        name: '新希望D10天府',
        price: 5.97,
        imageUrl: 'assets/houses/锦江区.png',
        imageWidth: 250,
        position: [104.097368, 30.642507],
        imageHeight: (250 * 3) / 4,
        color: '#33FF57',
        camera: [104.11645708041081, 30.459053560240793, 11344.311798960902],
        direction: [2, -20],
      },
      {
        district: '高新南区',
        name: '长冶南阳御龙府',
        price: 2.44,
        imageUrl: 'assets/houses/高新区.png',
        imageWidth: 250,
        position: [104.084875, 30.534519],
        imageHeight: (250 * 3) / 4,
        color: '#00CED1',
        camera: [104.05866590349441, 30.4229076173483, 14271.612511875108],
        direction: [360, -21],
      },
      {
        district: '双流区',
        name: '中海右岸',
        price: 1.95,
        imageUrl: 'assets/houses/双流区.png',
        imageWidth: 250,
        position: [104.030133, 30.493673],
        imageHeight: (250 * 3) / 4,
        color: '#F5DEB3',
        camera: [104.00342090135183, 30.30406060170878, 20307.436920855194],
        direction: [345.50274210152196, -20.256640505061814],
      },
      {
        district: '成都天府新区',
        name: '南湖国际社区',
        price: 1.75,
        imageUrl: 'assets/houses/天府新区.png',
        imageWidth: 250,
        position: [104.042027, 30.497514],
        imageHeight: (250 * 3) / 4,
        color: '#ADFF2F',
        camera: [104.1088620198038, 30.076310236436253, 18370.78609673865],
        direction: [1.3809264508565653, -17.28458230516483],
      },
      {
        district: '龙泉驿区',
        name: '世茂城三期',
        price: 1.75,
        imageUrl: 'assets/houses/龙泉驿区.png',
        imageWidth: 250,
        position: [104.18143, 30.572817],
        imageHeight: (250 * 3) / 4,
        color: '#FFD733',
        camera: [104.25711572717496, 30.173075187996922, 26024.417016443796],
        direction: [1.3809264508565653, -17.28458230516483],
      },
    ];

    const cameraDirection = {
      heading: CMath.toRadians(17.205),
      pitch: CMath.toRadians(-70), // CMath.toRadians(-56.087178),
      roll: 0,
      up: Cartesian3.UNIT_Z,
    };

    const keyFrameAnimations = topHouseMap
      .map((config) => {
        const animations = [];
        const polygonArr = districtMap.get(config.district);
        polygonArr.forEach((points) => {
          animations.push({
            start: () => {
              const player = new PolygonPlayer(context.current.viewer, points, {
                color: config.color,
                extrudedHeight: height + 50,
                direction: 0,
                showOutline: true,
                outlineColor: config.color,
                outlineWidth: 5,
              });
              player.play();
            },
            update: () => {},
            end: () => {},
            duration: 2000,
          });
        });
        let tagPlayer: IPlayer;

        return [
          {
            totalDuration: 500,
            animations: [
              {
                start: () => {
                  context.current.viewer.camera.flyTo({
                    destination: Cartesian3.fromDegrees(
                      ...(config.camera || centerMap.get(config.district))
                    ),
                    orientation: {
                      ...cameraDirection,
                      ...(() => {
                        const direction: any = {};
                        if (config.direction) {
                          direction.heading = CMath.toRadians(
                            config.direction[0]
                          );
                          direction.pitch = CMath.toRadians(
                            config.direction[1]
                          );
                        }

                        return direction;
                      })(),
                    },
                    duration: 1,
                    easingFunction: EasingFunction.BOUNCE_OUT,
                  });
                },
                update: () => {},
                end: () => {},
                duration: 500,
              },
            ],
          },
          {
            totalDuration: 1500,
            animations: animations,
          },
          {
            totalDuration: 2000,
            animations: [
              {
                start: () => {
                  tagPlayer = new TagsPlayer(
                    context.current.viewer,
                    centerMap.get(config.district),
                    {
                      imageUrl: config.imageUrl,
                      offset: { x: 10, y: -10, z: 500 },
                      align: 'top',
                      title: `${config.name} ${config.price}万/平`,
                      color: config.color,
                      fontColor: config.color,
                      height: height + 500,
                      imageWidth: config.imageWidth,
                      imageHeight: config.imageHeight,
                    }
                  );
                },
                update: () => {},
                end: () => {
                  tagPlayer?.destroy();
                },
                duration: 2000,
              },
            ],
          },
        ];
      })
      .flat();

    // const animations = [
    //   {
    //     // 高新区
    //     totalDuration: 1000,
    //     animations: [
    //       {
    //         start: () => {
    //           const value = districtMap.get('高新南区');
    //           value?.forEach((v) => {
    //             const player = new PolygonPlayer(context.current.viewer, v, {
    //               color: '#FF5733',
    //               extrudedHeight: height + 50,
    //               direction: 0,
    //               showOutline: false,
    //               outlineColor: '#FF5733',
    //               outlineWidth: 5,
    //             });
    //             player.play();
    //           });
    //         },
    //         update: () => {},
    //         end: () => {},
    //         duration: 1000,
    //       },
    //     ],
    //   },
    //   {
    //     totalDuration: 1000,
    //     animations: [
    //       {
    //         duration: 1000,
    //         start: () => {
    //           const value = centerMap.get('高新南区');
    //           new TagsPlayer(context.current.viewer, value, {
    //             imageUrl: 'assets/hangmu.png',
    //             offset: { x: 10, y: -10, z: 500 },
    //             align: 'top',
    //             title: 'XXXXXX楼盘',
    //             color: color,
    //             fontColor: color,
    //             height: height + 500,
    //             imageWidth: 300,
    //             imageHeight: (300 * 9) / 16,
    //           });
    //         },
    //         update: () => {},
    //         end: () => {},
    //       },
    //     ],
    //   },
    // ];

    // const keyFrameAnimations: any = [];
    keyFrameAnimations.push({
      totalDuration: 1000,
      animations: [
        {
          start: () => {
            topHouseMap.forEach((config) => {
              const newEntity = new Entity({
                position: Cartesian3.fromDegrees(
                  ...centerMap.get(config.district),
                  height + 10
                ),
                name: config.name,
                label: {
                  text: `${config.name} ${config.price}万/平`,
                  font: 'bold 12px sans-serif',
                  // style: LabelStyle.FILL_AND_OUTLINE,
                  fillColor: Color.WHITE,
                  // outlineColor: Color.GOLD.withAlpha(0.6),
                  verticalOrigin: VerticalOrigin.BOTTOM,
                  showBackground: false,
                  backgroundColor: Color.BLACK.withAlpha(0.1),
                  backgroundPadding: new Cartesian2(7, 5),
                  pixelOffset: new Cartesian2(0, -30),
                  // heightReference: HeightReference.CLAMP_TO_GROUND,
                },
              });
              context.current.viewer.entities.add(newEntity);
            });
          },
          update: () => {},
          end: () => {},
          duration: 1000,
        },
        {
          start: () => {
            context.current.viewer.camera.flyTo({
              destination: Cartesian3.fromDegrees(
                104.10567036516667,
                30.039199202882305,
                73164
              ),
              orientation: HeadingPitchRoll.fromDegrees(
                359.9999999999997,
                -40.0524657000205,
                360
              ),
              duration: 1,
              easingFunction: EasingFunction.BOUNCE_OUT,
            });
          },
          update: () => {},
          end: () => {},
          duration: 1000,
        },
      ],
    });

    const animator = new Animator(keyFrameAnimations);
    animator.play();
  };

  const stop = () => {};

  const replay = () => {};

  const record = () => {
    const recorder = context.current.recorder;

    if (recorder._recording) {
      recorder.removeEvents?.();
      recorder.stop();

      window.open(recorder.save());
      return;
    }
    recorder.start();
    recorder._recording = true;

    recorder.removeEvents =
      context.current.viewer.scene.postRender.addEventListener(function () {
        recorder.capture(context.current.viewer.scene.canvas);
      });

    console.log(recorder);
  };

  return (
    <MapContainer>
      <div style={{ width: '100%', height: '100%' }} id="map"></div>
      <div>
        <div className="hz-player">
          <Button className="hz-btn" onClick={play}>
            播放
          </Button>
          <Button className="hz-btn" onClick={stop}>
            停止
          </Button>
          <Button className="hz-btn" onClick={replay}>
            重新播放
          </Button>
          <Button className="hz-btn" onClick={record}>
            录屏
          </Button>
        </div>
        <div className="hz-style"></div>
      </div>
    </MapContainer>
  );
};

export default Video;

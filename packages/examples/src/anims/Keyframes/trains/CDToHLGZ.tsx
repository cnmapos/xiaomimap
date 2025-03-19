import React, { useEffect, useRef } from 'react';
import MapContainer from '../../../components/map-container';
import { Button } from 'antd';
import {
  AnimationController,
  AnimationTrack,
  BillboardScaleTarget,
  CameraAnimationTarget,
  cameraFlyInterpolate,
  createPointRoamingSlerp,
  parabolaInterpolate,
  PointRoamingAnimationTarget,
  TextAnimationTarget,
} from '@hztx/animations';
import {
  Cartesian3,
  CatmullRomSpline,
  CesiumTerrainProvider,
  Color,
  PolylineGlowMaterialProperty,
  SceneMode,
  UrlTemplateImageryProvider,
  Viewer,
  Math as CMath,
  LabelStyle,
  Cartesian2,
  HeadingPitchRoll,
  NearFarScalar,
  VerticalOrigin,
  ShadowMode,
  DirectionalLight,
} from 'cesium';
import { HZViewer } from '@hztx/core';
import PathGeoJSONData from '../assets/pathForBike.json';
import { TextAnimationType, TextEntity } from '../../../addon_entities/Text';

function TrainCDToHK() {
  const aniCtr = new AnimationController();
  const context = useRef<{ viewer: Viewer }>({
    viewer: null,
  });

  useEffect(() => {
    const hz = new HZViewer('map', { sceneMode: SceneMode.SCENE3D });
    const { viewer }: { viewer: Viewer } = hz;
    context.current.viewer = viewer;
    viewer.resolutionScale = 2;

    const gaodeImageProvider = new UrlTemplateImageryProvider({
      url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', // 添加高德影像
    });
    viewer.imageryLayers.addImageryProvider(gaodeImageProvider);
    const topoTiles = new UrlTemplateImageryProvider({
      url: 'https://tiles1.geovisearth.com/base/v1/cia/{z}/{x}/{y}?format=webp&tmsIds=w&token=fa74f216c7265ac713a224dcd0a4d0f20e27b61051ed729b587111b4c410528b', // 替换为中国行政区级别瓦片的URL
    });
    viewer.imageryLayers.addImageryProvider(topoTiles);
    // 添加场景光源
    viewer.scene.light = new DirectionalLight({
      direction: new Cartesian3(1.0, -1.0, -1.0), // 光源方向
      color: Color.WHITE, // 光源颜色
      intensity: 2.1, // 光源强度
    });

    // 启用环境光遮蔽（AO）
    viewer.scene.postProcessStages.fxaa.enabled = true;
    viewer.scene.postProcessStages.ambientOcclusion.enabled = true;

    context.current.viewer = viewer;

    const cameraTarget = new CameraAnimationTarget(viewer.camera);
    const track1 = new AnimationTrack(cameraTarget, {
      interpolationFn: cameraFlyInterpolate,
    });

    track1.addKeyframe(1000, {
      position: [104.05634898335825, 31.636135372626935, 308297.3176002812],
      direction: [0, -89.9190563526215],
    });
    track1.addKeyframe(2000, {
      position: [104.1446140516676, 30.596254983594935, 8645.427193963842],
      direction: [0, -59.000137765029564],
    });

    // aniCtr.addTrack(track1);

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(
        104.05634898335825,
        31.636135372626935,
        308297.3176002812
      ),
      // orientation: HeadingPitchRoll.fromDegrees(
      //   0, -57.9066660, 0
      // ),
      duration: 0,
    });

    const trainPath = [
      {
        time: '10:42',
        position: [104.140947, 30.628779],
        address: '成都东站',
        event: '始发站',
        station: true,
      },
      {
        position: [104.225489, 30.894749],
        address: '清北江东',
        station: false,
      },
      {
        time: '11:28',
        position: [104.390031, 31.165715],
        address: '德阳站',
        event: '',
        station: true,
      },
      {
        position: [104.120909, 31.12128],
        address: '什邡西站',
        station: true,
      },
      {
        position: [104.212537, 31.259157],
        address: '绵竹南站',
        station: true,
      },
      {
        position: [104.238133, 31.462151],
        address: '安州站',
        station: true,
      },
      {
        time: '12:10',
        position: [104.208832, 31.635928],
        address: '高川站',
        event: '',
        station: true,
      },
      {
        position: [103.944961, 31.724706],
        address: '茂县站',
        station: true,
      },
      {
        position: [103.684603, 31.897184],
        address: '石大关',
        station: false,
      },
      {
        position: [103.683256, 32.041437],
        address: '叠溪站',
        station: false,
      },
      {
        position: [103.720988, 32.328591],
        address: '镇江关站',
        station: true,
      },
      {
        position: [103.606452, 32.595098],
        address: '潘松站',
        station: true,
      },
      {
        position: [103.615084, 32.745215],
        address: '黄龙九寨站',
        station: true,
      },
    ];

    // 添加静态标注点
    trainPath.forEach((l) => {
      if (l.station) {
        viewer.entities.add({
          position: Cartesian3.fromDegrees(...l.position, 5),
          billboard: {
            image: 'assets/train_station.png',
            width: l.station ? 32 : 16, // 车站图标较大
            height: l.station ? 32 : 16,
            pixelOffset: new Cartesian2(0, -10),
            scaleByDistance: new NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5), // 根据距离缩放图标
            verticalOrigin: VerticalOrigin.BOTTOM, // 图标底部对齐
          },
        });
      } else {
        const iconEntity = viewer.entities.add({
          position: Cartesian3.fromDegrees(...l.position, 5),
          billboard: {
            image: 'assets/train_station.png',
            width: l.station ? 32 : 16, // 车站图标较大
            height: l.station ? 32 : 16,
            pixelOffset: new Cartesian2(0, -10),
            scaleByDistance: new NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5), // 根据距离缩放图标
            verticalOrigin: VerticalOrigin.BOTTOM, // 图标底部对齐
            scale: 0,
          },
        });
        const textTarget = new BillboardScaleTarget(iconEntity);
        const track = new AnimationTrack(textTarget);
        track.addKeyframe(3000, 0);
        track.addKeyframe(4000, 1);
        aniCtr.addTrack(track);
      }

      const textStyle = {
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', // 使用现代感的字体
        fontSize: l.station ? 16 : 13, // 设置较大的字体大小
        color: l.station ? '#FFF' : '#FF0', // 设置颜色
        opacity: 0,
        textAlign: 'center', // 文字居中对齐
        fontWeight: '700', // 设置粗体
        fontStyle: 'normal', // 设置斜体
        backgroundColor: l.station ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0)',
        borderColor: '#fff',
        // borderWidth: 1,
        lineHeight: 1.5, // 设置合理的行高
        underline: false, // 添加下划线效果
        offset: [0, l.station ? -50 : -40],
        // shadow: { color: 'rgba(249, 58, 15, 0.4)', offsetX: 4, offsetY: 4, blur: 1 }// 设置轻微的阴影效果
      };
      // 创建文字
      const textEntity = new TextEntity(l.position, {
        text: l.address,
        textStyle,
        animationType: TextAnimationType.FADE,
      });

      // 给文字添加动画
      const textTarget = new TextAnimationTarget(textEntity.entity);
      viewer.entities.add(textEntity.entity);
      const tagTrack = new AnimationTrack(textTarget);
      tagTrack.addKeyframe(2500, 0);
      tagTrack.addKeyframe(3500, 1);
      aniCtr.addTrack(tagTrack);
    });

    const positions = trainPath.map((l) =>
      Cartesian3.fromDegrees(...l.position)
    );
    const spline = new CatmullRomSpline({
      times: positions.map((_, i) => i),
      points: positions,
    });
    let smoothPoints = [];
    for (let i = 0; i <= positions.length * 10; i++) {
      const time = (i / (positions.length * 10)) * (positions.length - 1);
      smoothPoints.push(spline.evaluate(time));
    }
    smoothPoints = smoothPoints.map((p) => {
      // 将Cartesian3对象转换为Degree经纬度
      const cartographic =
        viewer.scene.globe.ellipsoid.cartesianToCartographic(p);
      const longitude = CMath.toDegrees(cartographic.longitude);
      const latitude = CMath.toDegrees(cartographic.latitude);
      return [longitude, latitude];
    });

    const start = smoothPoints[0];
    const end = smoothPoints.at(-1);
    const wayPoints = smoothPoints.slice(1, -1);

    const modelEntity = context.current.viewer.entities.add({
      position: Cartesian3.fromDegrees(...start),
      show: false,
      model: {
        uri: 'assets/models/train.glb',
        scale: 1000,
        imageBasedLightingFactor: new Cartesian3(1.0, 1.0, 1.0),
        lightColor: Color.WHITE,
        shadows: ShadowMode.ENABLED,
        silhouetteColor: Color.YELLOW,

        // silhouetteSize: 0.2,
      },
    });

    const guideLine = viewer.entities.add({
      name: 'GuideLine',
      polyline: {
        positions: smoothPoints.map((p) => Cartesian3.fromDegrees(...p)),
        width: 5, // 增加宽度
        material: new PolylineGlowMaterialProperty({
          glowPower: 0.5, // 增加发光强度
          color: Color.fromCssColorString('#808080'), // 使用灰色模拟铁轨颜色
        }),
        clampToGround: true,
      },
    });

    // 添加第二条线模拟双轨
    const guideLine2 = viewer.entities.add({
      name: 'GuideLine2',
      polyline: {
        positions: smoothPoints.map((p) =>
          Cartesian3.fromDegrees(p[0] + 0.0003, p[1] + 0.0003)
        ), // 稍微偏移经度
        width: 5,
        material: new PolylineGlowMaterialProperty({
          glowPower: 0.5,
          color: Color.fromCssColorString('#808080'),
        }),
        clampToGround: true,
      },
    });

    const track2 = new AnimationTrack(cameraTarget, {
      interpolationFn: cameraFlyInterpolate,
    });

    track2.addKeyframe(1000, {
      position: [109.69662608451321, 29.914501730530972, 2790065.5788134094],
      direction: [0, -57.90666603002427],
    });
    track2.addKeyframe(2000, {
      position: [...start, 107953.27456308954],
      direction: [0, -89],
    });
    aniCtr.addTrack(track2);

    const lineEntity = viewer.entities.add({
      name: 'Path',
      polyline: {
        // positions: Cartesian3.fromDegreesArrayHeights(coordinates.flat()),
        positions: [],
        width: 10,
        material: new PolylineGlowMaterialProperty({
          glowPower: 0.2,
          color: Color.fromCssColorString('#FF0000'),
        }),
        //箭头
        // material: new PolylineArrowMaterialProperty(Color.ORANGE),
        // clampToGround: true,
      },
    });
    // viewer.trackedEntity = modelEntity;
    const target = new PointRoamingAnimationTarget(modelEntity, lineEntity, {
      //   heading: -Math.PI / 2 + Math.PI / 10,
      onBefore: () => {
        modelEntity.show = true;
        if (!context.current.viewer?.trackedEntity) {
          context.current.viewer.trackedEntity = modelEntity;

          const distance = 107953 / 10; // 设置你想要的固定距离
          context.current.viewer.trackedEntity.viewFrom = new Cartesian3(
            distance / 2,
            -distance,
            distance * 1.2
          );
        }
      },
    });
    const track = new AnimationTrack(target, {
      interpolationFn: createPointRoamingSlerp(wayPoints),
    });
    track.addKeyframe(2500, start);
    track.addKeyframe(120000, end);

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

export default TrainCDToHK;

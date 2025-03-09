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

    const chinaTiles = new UrlTemplateImageryProvider({
      url: 'https://tiles2.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=fa74f216c7265ac713a224dcd0a4d0f20e27b61051ed729b587111b4c410528b', // 替换为中国行政区级别瓦片的URL
    });
    viewer.imageryLayers.addImageryProvider(chinaTiles);
    const topoTiles = new UrlTemplateImageryProvider({
      url: 'https://tiles1.geovisearth.com/base/v1/cia/{z}/{x}/{y}?format=webp&tmsIds=w&token=fa74f216c7265ac713a224dcd0a4d0f20e27b61051ed729b587111b4c410528b', // 替换为中国行政区级别瓦片的URL
    });
    viewer.imageryLayers.addImageryProvider(topoTiles);

    // const terrianProvider = CesiumTerrainProvider.fromUrl(
    //   // 星云图
    //   'https://tiles1.geovisearth.com/base/v1/terrain?token=fa74f216c7265ac713a224dcd0a4d0f20e27b61051ed729b587111b4c410528b'
    //   // 水经注
    //   //   'https://assets.ion.cesium.com/us-east-1/asset_depot/1/CesiumWorldTerrain/v1.2/{z}/{x}/{y}.terrain?extensions=octvertexnormals-metadata&v=1.2.0'
    // );
    // terrianProvider.then((provider) => {
    //   viewer.terrainProvider = provider;
    // });

    // 添加场景光源
    viewer.scene.light = new DirectionalLight({
      direction: new Cartesian3(1.0, -1.0, -1.0), // 光源方向
      color: Color.WHITE, // 光源颜色
      intensity: 2.0, // 光源强度
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
      position: [109.23662407568617, 26.63985849636349, 2152184.779436756],
      direction: [0, -89.9190563526215],
    });
    track1.addKeyframe(2000, {
      position: [1104.140947, 30.628779],
      direction: [0, -45.000137765029564],
    });

    // aniCtr.addTrack(track1);

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(
        109.23662407568617,
        26.63985849636349,
        2152184.779436756
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
        position: [103.956527, 30.569214],
        address: '双流机场站',
        station: false,
      },
      {
        position: [103.87099, 30.465171],
        address: '新津站',
        station: false,
      },
      {
        position: [103.822589, 30.066462],
        address: '眉山东站',
        station: false,
      },
      {
        position: [103.770045, 29.848677],
        address: '青神站',
        station: false,
      },
      {
        time: '11:28',
        position: [103.713921, 29.602157],
        address: '乐山站',
        event: '',
        station: true,
      },
      {
        position: [103.960053, 29.346234],
        address: '犍为站',
        station: false,
      },
      {
        position: [104.274898, 29.006012],
        address: '泥溪站',
        station: false,
      },
      {
        position: [104.361168, 28.848079],
        address: '屏山站',
        station: false,
      },
      {
        time: '12:10',
        position: [104.607546, 28.723054],
        address: '宜宾西',
        event: '',
        station: true,
      },
      {
        position: [104.929987, 28.59601],
        address: '长宁站',
        station: false,
      },
      {
        position: [105.248423, 28.335811],
        address: '兴文站',
        station: false,
      },
      {
        position: [105.108177, 28.039228],
        address: '新街站',
        station: false,
      },
      {
        position: [105.058001, 27.818868],
        address: '威信站',
        station: false,
      },
      {
        position: [105.126384, 27.590192],
        address: '镇雄站',
        station: false,
      },
      {
        position: [105.419539, 27.262688],
        address: '毕节站',
        station: false,
      },
      {
        position: [105.596186, 27.207139],
        address: '大方站',
        station: false,
      },
      {
        position: [106.04758, 26.984656],
        address: '黔西站',
        station: false,
      },
      {
        position: [106.380019, 26.799999],
        address: '清镇西站',
        station: false,
      },
      {
        position: [106.661927, 26.703627],
        address: '白云北站',
        station: false,
      },
      {
        time: '13:55',
        position: [106.74397, 26.664053],
        address: '贵阳东',
        event: '',
        station: true,
      },
      {
        position: [106.798264, 26.544204],
        address: '龙洞堡站',
        station: false,
      },
      {
        position: [106.967168, 26.467814],
        address: '龙里北站',
        station: false,
      },
      {
        position: [107.19015, 26.352523],
        address: '贵定县站',
        station: false,
      },
      {
        position: [107.585344, 26.166726],
        address: '都匀东站',
        station: false,
      },
      {
        position: [107.815883, 26.076989],
        address: '三都县站',
        station: false,
      },
      {
        position: [108.556388, 25.986921],
        address: '榕江站',
        station: false,
      },
      {
        position: [109.114151, 25.908841],
        address: '从江站',
        station: false,
      },
      {
        position: [109.577018, 25.724841],
        address: '三江南站',
        station: false,
      },
      {
        position: [110.089147, 25.372058],
        address: '五通站',
        station: false,
      },
      {
        time: '15:39',
        position: [110.26647, 25.354042],
        address: '桂林西',
        event: '',
        station: true,
      },
      {
        position: [110.567715, 24.960083],
        address: '阳朔站',
        station: false,
      },
      {
        position: [110.871232, 24.830968],
        address: '恭城站',
        station: false,
      },
      {
        position: [111.332432, 24.551989],
        address: '钟山西站',
        station: false,
      },
      {
        position: [111.540429, 24.455654],
        address: '贺州站',
        station: false,
      },
      {
        position: [112.159348, 23.893136],
        address: '怀集站',
        station: false,
      },
      {
        position: [112.427565, 23.585081],
        address: '广宁站',
        station: false,
      },
      {
        time: '17:11',
        position: [112.662517, 23.213178],
        address: '肇庆东',
        event: '',
        station: true,
      },
      {
        position: [112.869999, 23.113095],
        address: '三水南站',
        station: false,
      },
      {
        position: [113.034331, 23.080243],
        address: '佛山西站',
        station: false,
      },
      {
        time: '17:46',
        position: [113.270842, 22.990024],
        address: '广州南',
        event: '',
        desc: '',
        station: true,
      },
      {
        position: [113.492925, 22.868357],
        address: '庆盛站',
        station: false,
      },
      {
        time: '18:08',
        position: [113.674056, 22.861466],
        address: '虎门站',
        event: '',
        desc: '',
        station: true,
      },
      {
        position: [113.955757, 22.733218],
        address: '光明城站',
        station: false,
      },
      {
        time: '17:46',
        position: [114.030075, 22.610576],
        address: '深圳北',
        event: '',
        desc: '',
        station: true,
      },
      {
        position: [114.058034, 22.538978],
        address: '福田站',
        station: false,
      },
      {
        time: '18:55',
        position: [114.170881, 22.301628],
        address: '香港西九龙',
        event: '',
        desc: '',
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
        scale: 10000,
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
          Cartesian3.fromDegrees(p[0] + 0.003, p[1] + 0.003)
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

          const distance = 107953; // 设置你想要的固定距离
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

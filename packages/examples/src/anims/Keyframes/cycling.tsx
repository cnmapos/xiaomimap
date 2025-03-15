import React, { useEffect, useRef } from 'react';
import MapContainer from '../../components/map-container';
import { Button } from 'antd';
import {
  AnimationController,
  AnimationTrack,
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
  HeightReference,
} from 'cesium';
import { HZViewer } from '@hztx/core';
import { TextAnimationType, TextEntity } from '../../addon_entities/Text';
import CyclingJSON from './assets/cycling.json';

function Cycling() {
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

    const terrianProvider = CesiumTerrainProvider.fromUrl(
      // 星云图
      'https://tiles1.geovisearth.com/base/v1/terrain?token=fa74f216c7265ac713a224dcd0a4d0f20e27b61051ed729b587111b4c410528b'
      // 水经注
      //   'https://assets.ion.cesium.com/us-east-1/asset_depot/1/CesiumWorldTerrain/v1.2/{z}/{x}/{y}.terrain?extensions=octvertexnormals-metadata&v=1.2.0'
    );
    terrianProvider.then((provider) => {
      viewer.terrainProvider = provider;
    });
    context.current.viewer = viewer;

    const cameraTarget = new CameraAnimationTarget(viewer.camera);
    const track1 = new AnimationTrack(cameraTarget, {
      interpolationFn: cameraFlyInterpolate,
    });

    track1.addKeyframe(1000, {
      position: [-75.4204237390705, 33.85698238168112, 8567977.849840268],
      direction: [5.088887, -89.9190563526215],
    });
    track1.addKeyframe(2000, {
      position: [116.027114, 25.88623, 100.025086346157],
      direction: [0, -45.000137765029564],
    });

    // aniCtr.addTrack(track1);

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(
        104.29554913632033,
        30.54109047652791,
        7681.62766
      ),
      // orientation: HeadingPitchRoll.fromDegrees(
      //   0, -57.9066660, 0
      // ),
      duration: 0,
    });

    const longMarchPath = [
      {
        name: '龙泉山森林公园',
        position: [104.27394645356127, 30.55486104479599, 646.3691396299013],
      },
      {
        name: '桃源山庄',
        position: [104.29484183314538, 30.55227771869295, 646.3691396299013],
      },
      {
        name: '云里小坐·山上见',
        position: [104.31457740210615, 30.542531800579876, 806.1025071],
      },
      {
        name: 'G318公路商店',
        position: [104.31403383248534, 30.541720606279696, 819.2367333143],
      },
      {
        name: '藤原豆腐店',
        position: [104.31720802439384, 30.54187089067476, 834.900839516],
      },
      {
        name: '日出观景点',
        position: [104.30850417271614, 30.534016769957645, 885.2707416407122],
      },
      {
        name: '等风来(美食)',
        position: [104.3055008353802, 30.53256126005873, 885.599461504],
      },
      {
        name: 'LALALAND远山坐忘',
        position: [104.30578019016734, 30.527857915007463, 910.5494469223],
      },
      {
        name: '观景台',
        position: [104.30347005060912, 30.522281368077554, 901.7426991237],
      },
      {
        name: '和风悬崖餐厅',
        position: [104.2960903710392, 30.523396321028947, 759.3385806],
      },
      {
        name: '长松村蔡家水蜜桃采摘园',
        position: [104.30006750692054, 30.525900475587697, 832.5034186],
      },
      {
        name: '牛王庙',
        position: [104.29809372315859, 30.525836282462702, 807.9568762596],
      },
      {
        name: '古家牌',
        position: [104.29208300734882, 30.53158092416372, 708.485159],
      },
      {
        name: '梦里桃园',
        position: [104.29221116052705, 30.538882867826217, 677.85948433893],
      },
      {
        name: '运动大本营',
        position: [104.29147404683268, 30.541337827022005, 671.81247975598],
      },
    ];

    // 添加静态标注点
    longMarchPath.forEach((l) => {
      viewer.entities.add({
        position: Cartesian3.fromDegrees(...l.position),
        point: {
          pixelSize: 10,
          color: Color.YELLOW,
          outlineColor: Color.BLACK,
          outlineWidth: 2,
          heightReference: HeightReference.CLAMP_TO_TERRAIN,
        },
      });
      const textStyle = {
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', // 使用现代感的字体
        fontSize: 16, // 设置较大的字体大小
        color: '#FFF', // 设置颜色
        opacity: 0,
        textAlign: 'center', // 文字居中对齐
        fontWeight: '700', // 设置粗体
        fontStyle: 'normal', // 设置斜体
        backgroundColor: 'rgba(0, 0, 0, 1)',
        borderColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 1,
        lineHeight: 1.5, // 设置合理的行高
        underline: false, // 添加下划线效果
        offset: [0, -20],
        // shadow: { color: 'rgba(249, 58, 15, 0.4)', offsetX: 4, offsetY: 4, blur: 1 }// 设置轻微的阴影效果
      };
      // 创建文字
      const textEntity = new TextEntity(l.position, {
        text: l.name,
        textStyle,
        animationType: TextAnimationType.FADE,
      });

      // 给文字添加动画
      const textTarget = new TextAnimationTarget(textEntity.entity);
      viewer.entities.add(textEntity.entity);
      const tagTrack = new AnimationTrack(textTarget);
      tagTrack.addKeyframe(1000, 0);
      tagTrack.addKeyframe(2000, 1);
      aniCtr.addTrack(tagTrack);
    });
    const positions = CyclingJSON.map((l) => Cartesian3.fromDegrees(...l));
    const spline = new CatmullRomSpline({
      times: positions.map((_, i) => i),
      points: positions,
    });
    let smoothPoints = [];
    for (let i = 0; i <= positions.length * 5; i++) {
      const time = (i / (positions.length * 5)) * (positions.length - 1);
      smoothPoints.push(spline.evaluate(time));
    }
    smoothPoints = smoothPoints.map((p) => {
      // 将Cartesian3对象转换为Degree经纬度
      const cartographic =
        viewer.scene.globe.ellipsoid.cartesianToCartographic(p);
      const longitude = CMath.toDegrees(cartographic.longitude);
      const latitude = CMath.toDegrees(cartographic.latitude);
      return [longitude, latitude, cartographic.height];
    });

    const start = smoothPoints[0];
    const end = smoothPoints.at(-1);
    const wayPoints = smoothPoints.slice(1, -1);

    const modelEntity = context.current.viewer.entities.add({
      position: Cartesian3.fromDegrees(...start),
      show: false,
      model: {
        uri: 'assets/models/cycling2.glb', // 替换为实际模型路径
        // minimumPixelSize: 256 * 16,
        // maximumScale: 1280,
        scale: 100,
        imageBasedLightingFactor: new Cartesian3(1.0, 1.0, 1.0),
        lightColor: Color.WHITE,
      },
    });

    const guideLine = viewer.entities.add({
      name: 'GuideLine',
      polyline: {
        positions: smoothPoints.map((p) => Cartesian3.fromDegrees(...p)),
        width: 10,
        material: new PolylineGlowMaterialProperty({
          glowPower: 0.2,
          color: Color.fromCssColorString('#ddd'),
        }),
        clampToGround: true,
      },
    });

    const track2 = new AnimationTrack(cameraTarget, {
      interpolationFn: cameraFlyInterpolate,
    });

    track2.addKeyframe(1000, {
      position: [104.29554913632033, 30.54109047652791, 7681.62766],
      direction: [0, -89.0],
    });
    track2.addKeyframe(2000, {
      position: [start[0], start[1], 7673.0],
      direction: [0, -89.0],
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
      // heading: -Math.PI / 2,
      onBefore: () => {
        modelEntity.show = true;
        if (!context.current.viewer?.trackedEntity) {
          context.current.viewer.trackedEntity = modelEntity;

          const distance = 107953 / 100; // 设置你想要的固定距离
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
    track.addKeyframe(3000, start);
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

export default Cycling;

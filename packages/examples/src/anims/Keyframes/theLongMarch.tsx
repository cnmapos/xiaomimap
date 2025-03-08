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
  LabelStyle,
  Cartesian2,
  HeadingPitchRoll,
} from 'cesium';
import { HZViewer } from '@hztx/core';
import PathGeoJSONData from '../assets/pathForBike.json';
import { TextAnimationType, TextEntity } from '../../addon_entities/Text';

function Trace() {
  const aniCtr = new AnimationController();
  const context = useRef<{ viewer: Viewer }>({
    viewer: null,
  });

  function loadModel(url: string) {
    return context.current.viewer.entities.add({
      position: Cartesian3.fromDegrees(103.96546, 30.634155, 0),
      model: {
        uri: url, // 替换为实际模型路径
        minimumPixelSize: 256,
        maximumScale: 1280,
        imageBasedLightingFactor: new Cartesian3(1.0, 1.0, 1.0),
        lightColor: Color.WHITE,
      },
    });
  }

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
        109.69662608451321,
        29.914501730530972,
        2790065.5788134094
      ),
      // orientation: HeadingPitchRoll.fromDegrees(
      //   0, -57.9066660, 0
      // ),
      duration: 0,
    });

    const longMarchPath = [
      {
        time: '1934年10月10日',
        position: [115.904349, 25.845237],
        address: '江西瑞金',
        event: '长征开始，中央红军从瑞金出发',
      },
      {
        time: '1934年10月21-25日',
        position: [115.099366, 25.329945],
        address: '江西信丰',
        event: '突破第一道封锁线',
      },
      {
        time: '1934年11月5-8日',
        position: [113.685193, 25.533024],
        address: '湖南汝城',
        event: '突破第二道封锁线',
      },
      {
        time: '1934年11月13-15日',
        position: [112.948806, 25.40059],
        address: '湖南宜章',
        event: '突破第三道封锁线',
      },
      {
        time: '1934年11月27日-12月1日',
        position: [111.087089, 25.94939],
        address: '广西全州、兴安、灌阳',
        event: '湘江战役',
      },
      {
        time: '1934年12月12日',
        position: [109.630772, 26.317333],
        address: '湖南通道',
        event: '通道转兵',
      },
      {
        time: '1934年12月18日',
        position: [109.125826, 26.213304],
        address: '贵州黎平',
        event: '黎平会议',
        desc: '中共中央政治局在此召开会议，正式决定向以遵义为中心的川黔边地区进军。',
      },
      {
        time: '1934年12月31日-1935年1月1日',
        position: [107.571343, 27.180832],
        address: '贵州瓮安',
        event: '猴场会议',
        desc: '重申黎平会议决议，作出《关于渡江后新的行动方针的决定》。',
      },
      {
        time: '1935年1月15-17日',
        position: [106.92141, 27.688997],
        address: '贵州遵义',
        event: '遵义会议',
        desc: '中共中央政治局扩大会议在此召开，确立了以毛泽东为代表的新的中央的正确领导。',
      },
      {
        time: '1935年1月29日-3月22日',
        position: [106.378708, 27.86251],
        address: '赤水河',
        event: '四渡赤水',
        desc: '四渡赤水，进军云南。',
      },
      {
        time: '1935年5月3-9日',
        position: [102.453347, 26.126096],
        address: '云南皎平渡',
        event: '巧渡金沙江',
        desc: '红军主力靠7条小船，经过7天7夜，从皎平渡全部渡过金沙江，摆脱几十万国民党军围追堵截。',
      },
      {
        time: '1935年5月25日',
        position: [102.284759, 29.270555],
        address: '四川安顺场',
        event: '强渡大渡河',
        desc: '红1军团第1师第1团在安顺场强渡大渡河成功。',
      },
      {
        time: '1935年5月29日',
        position: [102.229605, 29.912086],
        address: '四川泸定桥',
        event: '飞夺泸定桥',
        desc: '红4团一昼夜奔袭240里，22勇士踏索夺桥。',
      },
      {
        time: '1935年6月12日',
        position: [102.684935, 30.857062],
        address: '四川夹金山',
        event: '翻越雪山',
        desc: '中央红军开始翻越第一座雪山夹金山。',
      },
      {
        time: '1935年6月18日',
        position: [102.638725, 30.96192],
        address: '四川懋功达维镇',
        event: '懋功会师',
        desc: '红一方面军与红四方面军在懋功会师。',
      },
      {
        time: '1935年6月26日',
        position: [102.49416, 31.483027],
        address: '四川两河口',
        event: '两河口会议',
        desc: '中共中央政治局在此召开会议，确定了北上建立川陕甘根据地的战略方针。',
      },
      {
        time: '1935年8月20日',
        position: [103.065554, 32.598585],
        address: '四川毛儿盖',
        event: '毛儿盖会议',
        desc: '中央政治局在毛儿盖召开会议，决定红军主力向洮河以东发展。',
      },
      {
        time: '1935年8月下旬-9月上旬',
        position: [103.712165, 32.423573],
        address: '松潘草地',
        event: '过草地',
        desc: '红军穿越松潘草地，面临饥饿、寒冷、沼泽等困难，减员严重。',
      },
      {
        time: '1935年9月12日',
        position: [103.316688, 33.875509],
        address: '甘肃迭部县高吉村',
        event: '俄界会议',
        desc: '中共中央政治局召开紧急扩大会议，作出《关于张国焘同志的错误的决定》。',
      },
      {
        time: '1935年9月17日',
        position: [103.924248, 34.133788],
        address: '甘肃迭部县腊子口',
        event: '突破腊子口',
        desc: '红军攻克天险腊子口，打开了进入甘肃的通道。',
      },
      {
        time: '1935年9月27日',
        position: [104.939208, 35.032929],
        address: '甘肃通渭榜罗镇',
        event: '榜罗镇会议',
        desc: '中共中央政治局在榜罗镇召开会议，正式决定以陕北作为领导中国革命的大本营。',
      },
      {
        time: '1935年10月19日',
        position: [108.198664, 36.906852],
        address: '陕西吴起镇',
        event: '吴起镇会师',
        desc: '中央红军到达吴起镇，与陕北红军会师，红一方面军长征结束。',
      },
    ];

    // 添加静态标注点
    longMarchPath.forEach((l) => {
      viewer.entities.add({
        position: Cartesian3.fromDegrees(...l.position, 5),
        point: {
          pixelSize: 10,
          color: Color.YELLOW,
          outlineColor: Color.BLACK,
          outlineWidth: 2,
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
        offset: [0, -40],
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
      tagTrack.addKeyframe(1000, 0);
      tagTrack.addKeyframe(2000, 1);
      aniCtr.addTrack(tagTrack);
    });

    const positions = longMarchPath.map((l) =>
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
        uri: 'assets/models/people_run_2.glb', // 替换为实际模型路径
        // minimumPixelSize: 256 * 16,
        // maximumScale: 1280,
        scale: 15000,
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
      position: [109.69662608451321, 29.914501730530972, 2790065.5788134094],
      direction: [0, -57.90666603002427],
    });
    track2.addKeyframe(2000, {
      position: [...start, 107953.27456308954],
      direction: [0, -89],
    });
    aniCtr.addTrack(track2);

    const track = new AnimationTrack();
    const aniObject = new AnimationObject(target, {
      start,
      end,
      style,
      interpolate,
    });
    track.addObject(aniObject);
    track.lock = true;
    track.show = true;

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
      heading: -Math.PI / 2,
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
    track.addKeyframe(180000, end);

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

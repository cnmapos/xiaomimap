import React, { useEffect, useRef } from 'react';
import MapContainer from '../../components/map-container';
import { Button } from 'antd';
import {
  AnimationController,
  AnimationTrack,
  createPointRoamingSlerp,
  parabolaInterpolate,
  PointHaloAnimationTarget,
  PointRoamingAnimationTarget,
} from '@hztx/animations';
import {
  Cartesian3,
  Color,
  DirectionalLight,
  HeadingPitchRoll,
  Math,
  PolylineGlowMaterialProperty,
  SceneMode,
  Transforms,
  UrlTemplateImageryProvider,
  Viewer,
} from 'cesium';
import { createCirclePrimitive, HZViewer } from '@hztx/core';
import PathGeoJSONData from '../assets/pathForBike.json';
import { smoothPoints } from '../../utils';

const HEIGHT = 900000;

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

    viewer.scene.light = new DirectionalLight({
      direction: new Cartesian3(1.0, -1.0, -1.0), // 光源方向
      color: Color.WHITE, // 光源颜色
      intensity: 2.0, // 光源强度
    });

    // 启用环境光遮蔽（AO）
    viewer.scene.postProcessStages.fxaa.enabled = true;
    viewer.scene.postProcessStages.ambientOcclusion.enabled = true;

    //[130.43837494772174 , 33.57647134472288] 小仓市
    // [129.75774189303715 , 32.592941189034256] 长崎市
    // 途径位置
    /**
     * [2.280676991265219,0.5828409021876386,40.7930355611858],[2.2795163584841136,0.5835867850342943,75.404033476654],[2.278555845296461,0.5845555190106474,112.34702611184521],[2.2777875623580317,0.5857180639645218,42.86384948652313],[2.2773765184243078,0.5869286981835962,88.03863472128057],[2.276465033850543,0.5876390058293202,-9.449048906007],[2.2756624130758074,0.5871465960190703,-6.556231445604565],[2.274855625064425,0.5863784536117209,1.923439739518469],[2.2744953146293994,0.5854648969426753,120.99008095867092],[2.27446533028903,0.584736573548037,188.71076787006876],[2.2750180503089634,0.5844178477771022,123.83611025001558],[2.2757384321100584,0.5844966037298978,77.09261890016523],[2.2764169799268683,0.5847788789105294,47.728640889127504],[2.2769495529135266,0.5854681765624894,30.70907073951217],[2.2770068519318682,0.5864628314673682,52.598903787716935],[2.276399077016596,0.5871424636368049,-6.474849215794719],[2.2754294498789562,0.5876761812512186,-12.96980324589297],[2.2744520141687987,0.5868564873015669,-5.760170642816565],[2.27372752170804,0.5854135430525182,160.32468159537495],[2.2738586491913173,0.5839728413150657,593.7223125908495],[2.2737201626109025,0.5822854455100047,258.17611795555024],[2.2716578203512716,0.5794826130980807,134.41920677157276],[2.270659510728834,0.5776278304930426,159.5483511687475],[2.2696780141866966,0.5757780312893509,130.77511048620866],[2.26772624861149,0.5726606198302642,-40.57502926792832],[2.2663538221443265,0.5717498512376963,-65.62329059607639],[2.265292646461873,0.5712674218133885,-72.6533374380327],[2.264089476290734,0.570551522005468,-78.29269882416453],[2.2635627222892203,0.5696943776249961,-112.93347969082402],[2.2635955148118305,0.5686822083951938,-129.2290304167432],[2.2643409173336355,0.567735283627753,-117.68796629491263],[2.2653357620692858,0.567764124450638,-84.52695314917565],[2.2662304574969423,0.568590943502169,-43.03343541370623],[2.2666014178453513,0.5695662049648751,-63.310714993354686],[2.2666799815440184,0.5707946724846669,-77.83833538882318],[2.2666799815440184,0.5707946724846669,-77.83833538882318],[2.2666799815440184,0.5707946724846669,-77.83833538882318]
     */
    // 127.69772816393342 , 26.14176359048973 冲绳岛
    // 剧本：1.从琉球群岛出发，到达小仓市盘旋一圈，继续往长崎市出发，到达长崎市后投掷原子弹，最后迫降冲绳岛
    console.log(
      [
        [2.280676991265219, 0.5828409021876386, 40.7930355611858],
        [2.2795163584841136, 0.5835867850342943, 75.404033476654],
        [2.278555845296461, 0.5845555190106474, 112.34702611184521],
        [2.2777875623580317, 0.5857180639645218, 42.86384948652313],
        [2.2773765184243078, 0.5869286981835962, 88.03863472128057],
        [2.276465033850543, 0.5876390058293202, -9.449048906007],
        [2.2756624130758074, 0.5871465960190703, -6.556231445604565],
        [2.274855625064425, 0.5863784536117209, 1.923439739518469],
        [2.2744953146293994, 0.5854648969426753, 120.99008095867092],
        [2.27446533028903, 0.584736573548037, 188.71076787006876],
        [2.2750180503089634, 0.5844178477771022, 123.83611025001558],
        [2.2757384321100584, 0.5844966037298978, 77.09261890016523],
        [2.2764169799268683, 0.5847788789105294, 47.728640889127504],
        [2.2769495529135266, 0.5854681765624894, 30.70907073951217],
        [2.2770068519318682, 0.5864628314673682, 52.598903787716935],
        [2.276399077016596, 0.5871424636368049, -6.474849215794719],
        [2.2754294498789562, 0.5876761812512186, -12.96980324589297],
        [2.2744520141687987, 0.5868564873015669, -5.760170642816565],
        [2.27372752170804, 0.5854135430525182, 160.32468159537495],
        [2.2738586491913173, 0.5839728413150657, 593.7223125908495],
        [2.2737201626109025, 0.5822854455100047, 258.17611795555024],
        [2.2716578203512716, 0.5794826130980807, 134.41920677157276],
        [2.270659510728834, 0.5776278304930426, 159.5483511687475],
        [2.2696780141866966, 0.5757780312893509, 130.77511048620866],
        [2.26772624861149, 0.5726606198302642, -40.57502926792832],
        [2.2663538221443265, 0.5717498512376963, -65.62329059607639],
        [2.265292646461873, 0.5712674218133885, -72.6533374380327],
        [2.264089476290734, 0.570551522005468, -78.29269882416453],
        [2.2635627222892203, 0.5696943776249961, -112.93347969082402],
        [2.2635955148118305, 0.5686822083951938, -129.2290304167432],
        [2.2643409173336355, 0.567735283627753, -117.68796629491263],
        [2.2653357620692858, 0.567764124450638, -84.52695314917565],
        [2.2662304574969423, 0.568590943502169, -43.03343541370623],
        [2.2666014178453513, 0.5695662049648751, -63.310714993354686],
        [2.2666799815440184, 0.5707946724846669, -77.83833538882318],
        [2.2666799815440184, 0.5707946724846669, -77.83833538882318],
        [2.2666799815440184, 0.5707946724846669, -77.83833538882318],
      ].map((p) => [Math.toDegrees(p[0]), Math.toDegrees(p[1])])
    );
    const points = [
      [130.8135478417313, 33.20052975176603, 32170.22533348005],
      [130.67987736361252, 33.43495751891457, 9320.947425960609],
      [130.6029356214408, 33.585781262209785, 15309.057059954363],
      [130.55352806200335, 33.68321446762636, 23937.26870703247],
      [130.43656397311153, 33.72910569418493, -411.2774906304669],
      [130.32223601164898, 33.72505635322353, -1592.5013419044935],
      [130.2293379984599, 33.658608342445994, -232.1825237666705],
      [130.2215521440263, 33.56549129308717, 823.9634367971864],
      [130.26808741066634, 33.491881710527146, 32138.100151848455],
      [130.3888821257156, 33.47061600962125, 23909.13314403784],
      [130.46078552817315, 33.47194758698993, 13514.451395660219],
      [130.53684057119182, 33.548800681833995, 7291.839674913327],
      [130.5303809737017, 33.62535979091186, 7029.418301092995],
      [130.52081195757606, 33.66811662700433, 6065.08659129618],
      [130.4909052121885, 33.740680797515125, 1237.7014846219515],
      [130.445877077487, 33.765924335042335, -535.433252863605],
      [130.39017095225623, 33.76827835159619, -1697.0197118576186],
      [130.2885209790717, 33.73700543810051, -1956.70666185106],
      [130.2003916669964, 33.678721166521335, -1418.7220814678444],
      [130.1741121552507, 33.60875789699173, 6475.449692748351],
      [130.15690596739577, 33.53572082333239, 1293.043704349697],
      [130.152923354461, 33.48578652447052, 22693.288021953318],
      [130.05402472954538, 32.88899212310058, 9960.170621356765],
      [130.02600392170388, 32.73081466982091, 4734.967704841674],
      [129.87830924132976, 32.581112727258095, -2229.296249413881],
      [129.69240023608455, 32.53749996778599, -7474.131521394396],
      [129.5886265360641, 32.71470502926885, -9065.152114751534],
      [129.60275353186663, 32.834703531840766, -6258.442636184966],
      [129.61962183197898, 32.95091677582941, -2362.5120394392043],
      [129.75123201732896, 33.03560768685354, 4517.075223281446],
      [129.87891915162658, 33.06600783819007, 1866.8784506382785],
      [129.97051774580123, 33.032628146540624, 15292.225318906114],
      [130.03116867392453, 32.98349667277258, 28828.002284458227],
      [130.15408016151028, 32.8313591496204, 1186.661070050469],
      [130.10469982974615, 32.672251355273886, -1848.125874279151],
      [129.89202114485812, 32.50989019007662, -4436.737718074537],
      [129.6312555367825, 32.50547287416594, -9211.238422686522],
      [129.4916390878864, 32.660269589240755, -12483.526662287422],
      [129.49618582139084, 32.87353422943014, -8298.034938773293],
      [129.52974108233184, 33.06010123305364, -1107.5840439907822],
      [129.63123254199243, 33.13720882465157, 1368.7269479257327],
      [129.76780494328574, 33.191683731770404, 13319.926498902401],
      [129.86239208421114, 33.19567056925972, 5756.341283108776],
      [129.96369624078727, 33.13129558948928, 4362.826506188097],
      [129.92008053059556, 32.93752982560214, 2833.870244769716],
    ].map((p) => [p[0], p[1], HEIGHT]);
    points.unshift([145.6, 15.0, 0]);
    const smoothedPoints = smoothPoints(viewer, points);
    const start = smoothedPoints[0];
    const end = smoothedPoints.at(-1);
    const wayPoints = smoothedPoints.slice(1, -1);
    const modelEntity = context.current.viewer.entities.add({
      position: Cartesian3.fromDegrees(...start),
      show: true,
      model: {
        uri: 'assets/models/battleplane3.glb', // 替换为实际模型路径
        // minimumPixelSize: 256 * 16,
        // maximumScale: 1280,
        scale: 50000 / 2,
        imageBasedLightingFactor: new Cartesian3(1.0, 1.0, 1.0),
        lightColor: Color.WHITE,
      },
      orientation: Transforms.headingPitchRollQuaternion(
        Cartesian3.fromDegrees(...start),
        new HeadingPitchRoll(Math.PI, 0, 0)
      ),
    });
    const lineEntity = viewer.entities.add({
      name: 'Path',
      show: false,
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

    // ----------------------阶段1:从琉球群岛到小仓市
    const target = new PointRoamingAnimationTarget(modelEntity, lineEntity, {
      heading: -Math.PI / 2,
      onBefore: () => {
        modelEntity.show = true;
        if (!context.current.viewer?.trackedEntity) {
          context.current.viewer.trackedEntity = modelEntity;

          const distance = 107953 * 4; // 设置你想要的固定距离
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
    track.addKeyframe(0, start);
    track.addKeyframe(20000, end);

    aniCtr.addTrack(track);
    // ----------------------阶段2:小仓市盘旋一圈，继续往长崎市出发
    // ----------------------阶段3:到达长崎市后投掷原子弹
    const start2 = smoothedPoints.at(-1);
    const end2 = [129.846270998901, 32.73767996332364, -100];
    const modelEntity2 = context.current.viewer.entities.add({
      position: Cartesian3.fromDegrees(...start2),
      show: false,
      model: {
        uri: 'assets/models/ballistic1.glb', // 替换为实际模型路径
        // minimumPixelSize: 256 * 16,
        // maximumScale: 1280,
        scale: 10000,
        imageBasedLightingFactor: new Cartesian3(1.0, 1.0, 1.0),
        lightColor: Color.WHITE,
      },
      orientation: Transforms.headingPitchRollQuaternion(
        Cartesian3.fromDegrees(...start),
        new HeadingPitchRoll(0, Math.PI / 2, 0)
      ),
    });
    const lineEntity2 = viewer.entities.add({
      name: 'Path',
      show: false,
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
    const target2 = new PointRoamingAnimationTarget(modelEntity2, lineEntity2, {
      // heading: -Math.PI / 2,
      onBefore: () => {
        modelEntity2.show = true;
      },
    });
    const track2 = new AnimationTrack(target2, {
      interpolationFn: createPointRoamingSlerp([]),
    });
    track2.addKeyframe(20000, start2);
    track2.addKeyframe(25000, end2);

    aniCtr.addTrack(track2);
    // ----------------------阶段4:最后迫降冲绳岛
    const primitive = createCirclePrimitive(
      [129.846270998901, 32.73767996332364, 1],
      { radius: 10000, color: '#FF0' }
    );
    const circleTarget = new PointHaloAnimationTarget(primitive, {
      onBefore: () => {
        circleTarget.innerPrimitive.show = true;
        circleTarget.outPrimitive.show = true;
        modelEntity2.show = false;
      },
    });
    circleTarget.innerPrimitive.show = false;
    circleTarget.outPrimitive.show = false;
    viewer.scene.primitives.add(circleTarget.innerPrimitive);
    viewer.scene.primitives.add(circleTarget.outPrimitive);
    const track3 = new AnimationTrack(circleTarget);
    track3.addKeyframe(25000, 0, { repeat: true, duration: 3000 });
    track3.addKeyframe(25000 * 200, 1);
    aniCtr.addTrack(track3);

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

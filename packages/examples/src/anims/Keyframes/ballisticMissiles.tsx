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
  TextAnimationTarget,
} from '@hztx/animations';
import {
  Cartesian3,
  Color,
  DirectionalLight,
  HeadingPitchRoll,
  Math as CMath,
  PolylineGlowMaterialProperty,
  SceneMode,
  Transforms,
  UrlTemplateImageryProvider,
  Viewer,
  JulianDate,
} from 'cesium';
import { createCirclePrimitive, HZViewer } from '@hztx/core';
import PathGeoJSONData from '../assets/pathForBike.json';
import { smoothPoints } from '../../utils';
import { AnimationTarget } from '@hztx/animations/src/types';
import { TextAnimationType, TextEntity } from '../../addon_entities/Text';

const HEIGHT = 9000;

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

    // 停止时间自动推进
    viewer.clock.multiplier = 0; // 或设置 shouldAnimate: false

    // 启用基于太阳的光照（默认通常已开启，显式设置确保生效）
    viewer.scene.globe.enableLighting = true;

    viewer.resolutionScale = 2;

    const chinaTiles = new UrlTemplateImageryProvider({
      url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', // 'https://tiles2.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=fa74f216c7265ac713a224dcd0a4d0f20e27b61051ed729b587111b4c410528b', // 替换为中国行政区级别瓦片的URL
    });
    viewer.imageryLayers.addImageryProvider(chinaTiles);
    // const topoTiles = new UrlTemplateImageryProvider({
    //   url: 'https://tiles1.geovisearth.com/base/v1/cia/{z}/{x}/{y}?format=webp&tmsIds=w&token=fa74f216c7265ac713a224dcd0a4d0f20e27b61051ed729b587111b4c410528b', // 替换为中国行政区级别瓦片的URL
    // });
    // viewer.imageryLayers.addImageryProvider(topoTiles);

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

    [
      {
        name: '提尼安岛(美军战略基地)',
        position: [145.62600142210317, 15.012452265638219],
      },
      {
        name: '小仓市',
        position: [130.425498751695, 33.579439764868965],
      },
      {
        name: '长崎市',
        position: [129.75774189303715, 32.592941189034256],
      },
      {
        name: '冲绳岛',
        position: [127.69772816393342, 26.14176359048973],
      },
    ].forEach((l) => {
      const textStyle = {
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', // 使用现代感的字体
        fontSize: 28, // 设置较大的字体大小
        color: '#FF0', // 设置颜色
        opacity: 0,
        textAlign: 'center', // 文字居中对齐
        fontWeight: '700', // 设置粗体
        fontStyle: 'normal', // 设置斜体
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: '#fff',
        // borderWidth: 1,
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
      tagTrack.addKeyframe(0, 0);
      tagTrack.addKeyframe(500, 1);
      aniCtr.addTrack(tagTrack);
    });

    const aniList: {
      points: number[][];
      startTime: number;
      endTime: number;
      emitSmooth?: boolean;
      cast?: any;
    }[] = [
      {
        points: [
          [145.6648707385317, 15.006060067498568, -55099.13811970337],
          [145.64010965575076, 15.001852625025991, -60432.57899784642],
          [145.6127704722908, 14.99690272443037, -66212.1780142463],
          [145.59502957382557, 14.995995207550548, -70160.60070195422],
          [145.5753186418053, 15.094911664577948, -84387.1524158446],
        ].map((p, i) => [p[0], p[1], Math.min((i * HEIGHT) / 10, HEIGHT)]),
        startTime: 0,
        endTime: 10 * 1000,
        cast: false,
      },
      {
        startTime: 10 * 1000,
        endTime: 30 * 1000,
        points: [
          [145.5753186418053, 15.094911664577948, HEIGHT],
          [130.7094788834262, 33.3258519594011, HEIGHT],
        ],
        emitSmooth: true,
      },
      {
        points: [
          [130.7094788834262, 33.3258519594011, 12752.560018352891],
          [130.7493975914243, 33.427305085934975, 20066.167865370877],
          [130.73791606788453, 33.5416042178028, 5203.118693094121],
          [130.68728928036623, 33.64402130228695, 2128.3978362486114],
          [130.60515304150817, 33.701109346278486, 15810.002245735237],
          [130.47967213765486, 33.72775794176956, 1730.8686185111371],
          [130.37172981418828, 33.71982355006278, -1471.689112463813],
          [130.23574585364176, 33.67866863349866, -1710.197184163101],
          [130.19584132634827, 33.63259353917812, -809.9694903194084],
          [130.16247883879504, 33.5605489808961, 4309.662713019298],
          [130.15404973540578, 33.516650684490685, 11395.238291507712],
          [130.14945563277558, 33.43957390242387, 22237.876672824634],
          [130.17800309692439, 33.36287613827266, 31850.137221308727],
          [130.2401070593311, 33.30289226012824, 3059.18349543195],
          [130.29861536221895, 33.27459954887271, 468.40708839806285],
          [130.3720575247297, 33.262236737812756, 265.0454321123184],
          [130.44057234702527, 33.267558862419726, 372.94337224685256],
          [130.55439989197583, 33.2963687920708, 1687.593033024089],
          [130.6225380537739, 33.351746188014964, 3804.6220947390802],
          [130.66244534246815, 33.43509748950936, 4798.109335971908],
          [130.6642082745441, 33.51012340681629, 16954.571138892006],
          [130.63154849200455, 33.583106074921155, 11420.912590338883],
          [130.5825865105378, 33.62440561041808, 14759.844029636974],
          [130.50529471391422, 33.64982280347681, 6834.1246558108605],
          [130.423414044987, 33.66303114875332, -678.5055866469497],
          [130.34496301261208, 33.6517440294469, -441.7940575611355],
          [130.26428477123727, 33.62124507131979, -724.2838110585249],
          [130.21987293981564, 33.565606189781015, 1044.2763155037826],
          [130.2113943890253, 33.514243894955726, 6826.563595939114],
          [130.21560506802766, 33.43733737558496, 23968.32191971826],
          [130.23955341693693, 33.37883017010992, 21753.615320593985],
          [130.30760546307187, 33.33577985189551, 8748.671838902319],
          [130.38886174260404, 33.32437005412781, 5636.484447923278],
          [130.49555794854948, 33.351165812145844, 3138.4762661021814],
          [130.56254191737193, 33.42430398389737, 3165.5868330320795],
          [130.55612568107034, 33.516722972912824, 10248.94053504775],
          [130.5295464393693, 33.56338278679766, 5366.349822462241],
          [130.47792765275048, 33.59262117181973, 2734.6626807780176],
          [130.39950601176184, 33.5984248664525, 300.40130205442415],
          [130.33010683147884, 33.555198531260075, 3997.339627142696],
          [130.30433937538947, 33.49115203187315, 16777.5851413799],
          [130.27412236800004, 33.43361460922195, 28050.199986121683],
          [130.23750561210588, 33.34532602154642, 18978.106876498816],
          [130.18770212605892, 33.271707053807454, 7009.136191701808],
          [130.08823388126095, 33.19262419353421, 3935.1660475471886],
          [130.0260410368031, 33.14308562295257, 5192.88215728433],
          [129.94490593471656, 33.06719459210352, 5629.610354819906],
          [129.87583507641634, 32.99004822834661, 2107.270705224475],
          [129.82265242740974, 32.94234009132703, 936.4399095861514],
          [129.77544785877194, 32.89661117569881, 14264.226804747736],
          [129.7219455693887, 32.832918952794095, 5149.888688161995],
          [129.6861677164091, 32.78227823081385, -3874.217061152754],
          [129.65746191516308, 32.73128090756595, -4682.37632850496],
          [129.6397488639478, 32.6889577549816, -5306.363711766311],
          [129.637438894403, 32.63616239595277, -5163.383731345585],
          [129.65018613835002, 32.59768037553042, -4828.454248577996],
          [129.6686717021247, 32.561068201977626, -4834.544222216603],
          [129.69326173661577, 32.53101974561815, -4547.538662475652],
          [129.7287136742091, 32.52350023667317, -3609.2539969795876],
          [129.78009666975157, 32.52411924201598, -3525.2355214485397],
          [129.8358831858066, 32.543074363172565, -4043.3345750414637],
          [129.88525528366412, 32.57589955305703, -3908.6664142955087],
          [129.94002189665952, 32.6184937671101, -3156.070221299383],
          [130.0041263983331, 32.67629457553835, 113.77546582810595],
          [130.0701915365233, 32.75058713453187, 1363.5481828576264],
          [130.098301070295, 32.81713862913167, 3554.876296852291],
          [130.08178986236186, 32.89360641027348, 13907.515525573883],
          [130.01001668086758, 32.932036101653, 13213.312333820386],
          [129.9292609508544, 32.92836967312935, 4105.284444411365],
          [129.85999306582318, 32.889685837029646, 50.73359511361083],
          [129.81850266262427, 32.82868324288799, -1805.6421237800957],
          [129.81665054067184, 32.74834923970985, -1041.6046406454645],
        ].map((p, i) => [p[0], p[1], HEIGHT]),
        startTime: 30 * 1000,
        endTime: 50 * 1000,
        cast: {
          startTime: 50 * 1000,
          endTime: 54 * 1000,
          points: [
            [129.81665054067184, 32.74834923970985, HEIGHT],
            [129.75774189303715, 32.592941189034256, 1],
          ],
        },
      },
      {
        startTime: 50 * 1000,
        endTime: 60 * 1000,
        points: [
          [129.81665054067184, 32.74834923970985, HEIGHT],
          [129.53895100544423, 32.29888609445076, HEIGHT],
        ],
      },
      {
        startTime: 60 * 1000,
        endTime: 75 * 1000,
        points: [
          [129.53895100544423, 32.29888609445076, HEIGHT],
          [127.69772816393342, 26.14176359048973, 0],
        ],
      },
    ];
    const modelEntity = context.current.viewer.entities.add({
      position: Cartesian3.fromDegrees(...aniList[0].points[0]),
      show: true,
      model: {
        uri: 'assets/models/battleplane3.glb', // 替换为实际模型路径
        // minimumPixelSize: 256 * 16,
        // maximumScale: 1280,
        scale: 5000,
        imageBasedLightingFactor: new Cartesian3(1.0, 1.0, 1.0),
        lightColor: Color.WHITE,
      },
      orientation: Transforms.headingPitchRollQuaternion(
        Cartesian3.fromDegrees(...aniList[0].points[0]),
        new HeadingPitchRoll(CMath.PI / 2, 0, 0)
      ),
    });
    viewer.trackedEntity = modelEntity;

    let prevTarget: AnimationTarget | undefined = undefined;
    aniList.forEach((item) => {
      const { startTime, endTime, points, cast, emitSmooth } = item;
      const smoothedPoints = !emitSmooth
        ? smoothPoints(viewer, points)
        : points;
      const start = smoothedPoints[0];
      const end = smoothedPoints.at(-1);
      const wayPoints = smoothedPoints.slice(1, -1);
      const lineEntity = viewer.entities.add({
        name: 'Path',
        show: true,
        polyline: {
          // positions: Cartesian3.fromDegreesArrayHeights(coordinates.flat()),
          positions: [],
          width: 3,
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
      // ----------------------阶段1:从琉球群岛到小仓市
      const target = new PointRoamingAnimationTarget(modelEntity, lineEntity, {
        heading: -CMath.PI / 2,
        onBefore: () => {
          target?.prevTarget?.reset();
          modelEntity.show = true;
          const distance = 107953 * 4; // 设置你想要的固定距离
          context.current.viewer.trackedEntity.viewFrom = new Cartesian3(
            distance / 2,
            -distance,
            distance * 1.2
          );
        },
      });
      target.prevTarget = prevTarget;
      prevTarget = target;
      const track = new AnimationTrack(target, {
        interpolationFn: createPointRoamingSlerp(wayPoints),
      });
      track.addKeyframe(startTime, start);
      track.addKeyframe(endTime, end);

      aniCtr.addTrack(track);

      if (cast) {
        const {
          startTime: cStartTime,
          endTime: cEndTime,
          points: cPoints,
        } = cast;
        const start2 = cPoints[0];
        const end2 = cPoints[1];
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
            Cartesian3.fromDegrees(...start2),
            new HeadingPitchRoll(0, CMath.PI / 2, 0)
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
        const target2 = new PointRoamingAnimationTarget(
          modelEntity2,
          lineEntity2,
          {
            // heading: -CMath.PI / 2,
            onBefore: () => {
              modelEntity2.show = true;
            },
          }
        );
        const track2 = new AnimationTrack(target2, {
          interpolationFn: createPointRoamingSlerp(),
        });
        track2.addKeyframe(cStartTime, start2);
        track2.addKeyframe(cEndTime, end2);

        aniCtr.addTrack(track2);
        // ----------------------阶段4:最后迫降冲绳岛
        const primitive = createCirclePrimitive(end2, {
          radius: 10000,
          color: '#FF0',
        });
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
        track3.addKeyframe(cEndTime, 0, { repeat: true, duration: 3000 });
        track3.addKeyframe(cEndTime + 6000, 1);
        aniCtr.addTrack(track3);
      }
    });

    // const points = [
    //   [130.8135478417313, 33.20052975176603, 32170.22533348005],
    //   [130.67987736361252, 33.43495751891457, 9320.947425960609],
    //   [130.6029356214408, 33.585781262209785, 15309.057059954363],
    //   [130.55352806200335, 33.68321446762636, 23937.26870703247],
    //   [130.43656397311153, 33.72910569418493, -411.2774906304669],
    //   [130.32223601164898, 33.72505635322353, -1592.5013419044935],
    //   [130.2293379984599, 33.658608342445994, -232.1825237666705],
    //   [130.2215521440263, 33.56549129308717, 823.9634367971864],
    //   [130.26808741066634, 33.491881710527146, 32138.100151848455],
    //   [130.3888821257156, 33.47061600962125, 23909.13314403784],
    //   [130.46078552817315, 33.47194758698993, 13514.451395660219],
    //   [130.53684057119182, 33.548800681833995, 7291.839674913327],
    //   [130.5303809737017, 33.62535979091186, 7029.418301092995],
    //   [130.52081195757606, 33.66811662700433, 6065.08659129618],
    //   [130.4909052121885, 33.740680797515125, 1237.7014846219515],
    //   [130.445877077487, 33.765924335042335, -535.433252863605],
    //   [130.39017095225623, 33.76827835159619, -1697.0197118576186],
    //   [130.2885209790717, 33.73700543810051, -1956.70666185106],
    //   [130.2003916669964, 33.678721166521335, -1418.7220814678444],
    //   [130.1741121552507, 33.60875789699173, 6475.449692748351],
    //   [130.15690596739577, 33.53572082333239, 1293.043704349697],
    //   [130.152923354461, 33.48578652447052, 22693.288021953318],
    //   [130.05402472954538, 32.88899212310058, 9960.170621356765],
    //   [130.02600392170388, 32.73081466982091, 4734.967704841674],
    //   [129.87830924132976, 32.581112727258095, -2229.296249413881],
    //   [129.69240023608455, 32.53749996778599, -7474.131521394396],
    //   [129.5886265360641, 32.71470502926885, -9065.152114751534],
    //   [129.60275353186663, 32.834703531840766, -6258.442636184966],
    //   [129.61962183197898, 32.95091677582941, -2362.5120394392043],
    //   [129.75123201732896, 33.03560768685354, 4517.075223281446],
    //   [129.87891915162658, 33.06600783819007, 1866.8784506382785],
    //   [129.97051774580123, 33.032628146540624, 15292.225318906114],
    //   [130.03116867392453, 32.98349667277258, 28828.002284458227],
    //   [130.15408016151028, 32.8313591496204, 1186.661070050469],
    //   [130.10469982974615, 32.672251355273886, -1848.125874279151],
    //   [129.89202114485812, 32.50989019007662, -4436.737718074537],
    //   [129.6312555367825, 32.50547287416594, -9211.238422686522],
    //   [129.4916390878864, 32.660269589240755, -12483.526662287422],
    //   [129.49618582139084, 32.87353422943014, -8298.034938773293],
    //   [129.52974108233184, 33.06010123305364, -1107.5840439907822],
    //   [129.63123254199243, 33.13720882465157, 1368.7269479257327],
    //   [129.76780494328574, 33.191683731770404, 13319.926498902401],
    //   [129.86239208421114, 33.19567056925972, 5756.341283108776],
    //   [129.96369624078727, 33.13129558948928, 4362.826506188097],
    //   [129.92008053059556, 32.93752982560214, 2833.870244769716],
    // ].map((p) => [p[0], p[1], HEIGHT]);
    // points.unshift(
    //   ...[
    //     [145.64582792642395, 15.003834349608912, -59311.61721285998],
    //     [145.62954861006563, 15.00069929595405, -62753.509375681984],
    //     [145.60945886049876, 14.996471377434695, -66924.38342340436],
    //     [145.5991297457626, 14.996073727484115, -69237.28310679115],
    //     [145.58795449012797, 15.006483926898794, -72851.76031964151],
    //     [145.58830365615978, 15.023724230273189, -74534.47621366917],
    //     [145.5952287393542, 15.031236968430514, -73722.69180216103],
    //     [145.60774959555468, 15.038324447661438, -71581.87627254399],
    //     [145.63588589561132, 15.043773063804714, -65657.05415115695],
    //     [145.65188833735255, 15.044897547355188, -62052.47782050271],
    //     [145.66119732843808, 15.044353995033973, -59825.070862773944],
    //     [145.66759990132078, 15.037853482963948, -57680.01291396551],
    //     [145.6652705810977, 15.023616260563534, -56797.818060986785],
    //     [145.65785606781307, 15.009519280912885, -57096.78497694475],
    //     [145.65508329860043, 15.00741617632387, -57527.82533819329],
    //     [145.6485849207115, 15.007498780495581, -59049.50159992882],
    //     [145.631339810553, 15.008566167933424, -63153.786733084344],
    //     [145.62019005142204, 15.012133435819266, -66086.40738396722],
    //     [145.6134343730316, 15.018654025953568, -68301.2033862245],
    //     [145.6065042491116, 15.02495206761567, -70523.75341667312],
    //     [145.58784421739733, 15.050482367825026, -77307.54854125895],
    //   ].map((p, i) => [p[0], p[1], i * 200])
    // );
    // const smoothedPoints = smoothPoints(viewer, points);
    // const start = smoothedPoints[0];
    // const end = smoothedPoints.at(-1);
    // const wayPoints = smoothedPoints.slice(1, -1);
    // const modelEntity = context.current.viewer.entities.add({
    //   position: Cartesian3.fromDegrees(...start),
    //   show: true,
    //   model: {
    //     uri: 'assets/models/battleplane3.glb', // 替换为实际模型路径
    //     // minimumPixelSize: 256 * 16,
    //     // maximumScale: 1280,
    //     scale: 5000,
    //     imageBasedLightingFactor: new Cartesian3(1.0, 1.0, 1.0),
    //     lightColor: Color.WHITE,
    //   },
    //   orientation: Transforms.headingPitchRollQuaternion(
    //     Cartesian3.fromDegrees(...start),
    //     new HeadingPitchRoll(CMath.PI, 0, 0)
    //   ),
    // });
    // const lineEntity = viewer.entities.add({
    //   name: 'Path',
    //   show: false,
    //   polyline: {
    //     // positions: Cartesian3.fromDegreesArrayHeights(coordinates.flat()),
    //     positions: [],
    //     width: 20,
    //     material: new PolylineGlowMaterialProperty({
    //       glowPower: 0.2,
    //       taperPower: 0.25,
    //       color: Color.fromCssColorString('#FF0000'),
    //     }),
    //     //箭头
    //     // material: new PolylineArrowMaterialProperty(Color.ORANGE),
    //     // clampToGround: true,
    //   },
    // });
    // viewer.trackedEntity = modelEntity;

    // // ----------------------阶段1:从琉球群岛到小仓市
    // const target = new PointRoamingAnimationTarget(modelEntity, lineEntity, {
    //   heading: -CMath.PI / 2,
    //   onBefore: () => {
    //     modelEntity.show = true;
    //     if (!context.current.viewer?.trackedEntity) {
    //       context.current.viewer.trackedEntity = modelEntity;

    //       const distance = 107953 * 4; // 设置你想要的固定距离
    //       context.current.viewer.trackedEntity.viewFrom = new Cartesian3(
    //         distance / 2,
    //         -distance,
    //         distance * 1.2
    //       );
    //     }
    //   },
    // });
    // const track = new AnimationTrack(target, {
    //   interpolationFn: createPointRoamingSlerp(wayPoints),
    // });
    // track.addKeyframe(0, start);
    // track.addKeyframe(40000, end);

    // aniCtr.addTrack(track);
    // // ----------------------阶段2:小仓市盘旋一圈，继续往长崎市出发
    // // ----------------------阶段3:到达长崎市后投掷原子弹
    // const start2 = smoothedPoints.at(-1);
    // const end2 = [129.846270998901, 32.73767996332364, -100];
    // const modelEntity2 = context.current.viewer.entities.add({
    //   position: Cartesian3.fromDegrees(...start2),
    //   show: false,
    //   model: {
    //     uri: 'assets/models/ballistic1.glb', // 替换为实际模型路径
    //     // minimumPixelSize: 256 * 16,
    //     // maximumScale: 1280,
    //     scale: 10000,
    //     imageBasedLightingFactor: new Cartesian3(1.0, 1.0, 1.0),
    //     lightColor: Color.WHITE,
    //   },
    //   orientation: Transforms.headingPitchRollQuaternion(
    //     Cartesian3.fromDegrees(...start),
    //     new HeadingPitchRoll(0, CMath.PI / 2, 0)
    //   ),
    // });
    // const lineEntity2 = viewer.entities.add({
    //   name: 'Path',
    //   show: false,
    //   polyline: {
    //     // positions: Cartesian3.fromDegreesArrayHeights(coordinates.flat()),
    //     positions: [],
    //     width: 20,
    //     material: new PolylineGlowMaterialProperty({
    //       glowPower: 0.2,
    //       taperPower: 0.25,
    //       color: Color.fromCssColorString('#FF0000'),
    //     }),
    //     //箭头
    //     // material: new PolylineArrowMaterialProperty(Color.ORANGE),
    //     // clampToGround: true,
    //   },
    // });
    // const target2 = new PointRoamingAnimationTarget(modelEntity2, lineEntity2, {
    //   // heading: -CMath.PI / 2,
    //   onBefore: () => {
    //     modelEntity2.show = true;
    //   },
    // });
    // const track2 = new AnimationTrack(target2, {
    //   interpolationFn: createPointRoamingSlerp([]),
    // });
    // track2.addKeyframe(20000, start2);
    // track2.addKeyframe(23000, end2);

    // aniCtr.addTrack(track2);
    // // ----------------------阶段4:最后迫降冲绳岛
    // const primitive = createCirclePrimitive(
    //   [129.846270998901, 32.73767996332364, 1],
    //   { radius: 10000, color: '#FF0' }
    // );
    // const circleTarget = new PointHaloAnimationTarget(primitive, {
    //   onBefore: () => {
    //     circleTarget.innerPrimitive.show = true;
    //     circleTarget.outPrimitive.show = true;
    //     modelEntity2.show = false;
    //   },
    // });
    // circleTarget.innerPrimitive.show = false;
    // circleTarget.outPrimitive.show = false;
    // viewer.scene.primitives.add(circleTarget.innerPrimitive);
    // viewer.scene.primitives.add(circleTarget.outPrimitive);
    // const track3 = new AnimationTrack(circleTarget);
    // track3.addKeyframe(23000, 0, { repeat: true, duration: 3000 });
    // track3.addKeyframe(25000 * 200, 1);
    // aniCtr.addTrack(track3);

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

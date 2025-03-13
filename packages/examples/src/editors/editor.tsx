import {
  AnimationController,
  AnimationTrack,
  CameraAnimationTarget,
  cameraFlyInterpolate,
} from '@hztx/animations';
import { HZViewer } from '@hztx/core';
import {
  CallbackProperty,
  CesiumTerrainProvider,
  Color,
  SceneMode,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Viewer,
  CatmullRomSpline,
  Cartographic,
  Math as CMath,
  UrlTemplateImageryProvider,
} from 'cesium';
import React, { useEffect, useRef } from 'react';
import MapContainer from '../components/map-container';
import { Button } from 'antd';

function Editor() {
  const aniCtr = new AnimationController();
  const context = useRef<{ viewer: Viewer }>({
    viewer: null,
  });
  useEffect(() => {
    const hz = new HZViewer('map', { sceneMode: SceneMode.SCENE3D });
    const { viewer }: { viewer: Viewer } = hz;
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

    viewer.resolutionScale = 2;

    const chinaTiles = new UrlTemplateImageryProvider({
      url: 'https://tiles2.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=fa74f216c7265ac713a224dcd0a4d0f20e27b61051ed729b587111b4c410528b', // 替换为中国行政区级别瓦片的URL
    });
    viewer.imageryLayers.addImageryProvider(chinaTiles);
    const topoTiles = new UrlTemplateImageryProvider({
      url: 'https://tiles1.geovisearth.com/base/v1/cia/{z}/{x}/{y}?format=webp&tmsIds=w&token=fa74f216c7265ac713a224dcd0a4d0f20e27b61051ed729b587111b4c410528b', // 替换为中国行政区级别瓦片的URL
    });
    viewer.imageryLayers.addImageryProvider(topoTiles);

    const cameraTarget = new CameraAnimationTarget(viewer.camera);
    const track1 = new AnimationTrack(cameraTarget, {
      interpolationFn: cameraFlyInterpolate,
    });

    track1.addKeyframe(0, {
      position: [-75.4204237390705, 33.85698238168112, 8567977.849840268],
      direction: [5.088887, -89.9190563526215],
    });
    track1.addKeyframe(500, {
      position: [104.297364, 30.549396, 1000.025086346157],
      direction: [0, -90],
    });
    aniCtr.addTrack(track1);

    let activeShapePoints = []; // 存储线段顶点
    let activeShape; // 线段实体
    let floatingPoint; // 鼠标移动时的临时点

    // 启动绘制模式
    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    // 监听左键点击添加点
    handler.setInputAction((event) => {
      // 通过射线检测获取地形表面坐标
      const ray = viewer.camera.getPickRay(event.position);
      const position = viewer.scene.globe.pick(ray, viewer.scene);

      if (position) {
        if (activeShapePoints.length === 0) {
          // 创建浮动点（跟随鼠标）
          floatingPoint = createPoint(position);
          activeShapePoints.push(position);
          // 创建线段
          activeShape = createPolyline(activeShapePoints);
        }
        // 添加固定点
        activeShapePoints.push(position);
        createPoint(position);

        console.log(
          'line points: ',
          JSON.stringify(
            activeShapePoints?.map((p) => {
              const cartographic = Cartographic.fromCartesian(p);

              return [
                CMath.toDegrees(cartographic.longitude),
                CMath.toDegrees(cartographic.latitude),
                CMath.toDegrees(cartographic.height),
              ];
            })
          )
        );
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    // 监听左键双击结束绘制
    handler.setInputAction(() => {
      if (activeShapePoints.length > 0) {
        // 移除浮动点
        if (floatingPoint) {
          viewer.entities.remove(floatingPoint);
          floatingPoint = null;
        }
        // 重置绘制状态
        activeShapePoints = [];
        activeShape = null;
      }
    }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    // 监听鼠标移动更新浮动点
    handler.setInputAction((event) => {
      if (activeShapePoints.length > 0) {
        const ray = viewer.camera.getPickRay(event.endPosition);
        const position = viewer.scene.globe.pick(ray, viewer.scene);
        if (position) {
          floatingPoint.position.setValue(position);
          // 更新线段的最后一个点
          activeShapePoints[activeShapePoints.length - 1] = position;
          // 使用平滑曲线更新polyline
          if (activeShapePoints.length > 1) {
            const spline = new CatmullRomSpline({
              times: activeShapePoints.map((_, i) => i),
              points: activeShapePoints,
            });
            const smoothPoints = [];
            for (let i = 0; i <= activeShapePoints.length * 10; i++) {
              const time =
                (i / (activeShapePoints.length * 10)) *
                (activeShapePoints.length - 1);
              smoothPoints.push(spline.evaluate(time));
            }
            activeShape.polyline.positions = smoothPoints;
          } else {
            activeShape.polyline.positions = activeShapePoints;
          }
        }
      }
    }, ScreenSpaceEventType.MOUSE_MOVE);

    // 创建点实体
    function createPoint(position) {
      const cartographic = Cartographic.fromCartesian(position);
      console.log(
        'lng, lat, height',
        CMath.toDegrees(cartographic.longitude),
        ',',
        CMath.toDegrees(cartographic.latitude),
        ',',
        CMath.toDegrees(cartographic.height),
        ',',
        cartographic.height
      );

      return viewer.entities.add({
        position: position,
        point: { pixelSize: 8, color: Color.YELLOW },
      });
    }

    // 创建线实体
    function createPolyline(positions) {
      return viewer.entities.add({
        polyline: {
          positions: new CallbackProperty(() => {
            if (positions.length < 2) return positions;
            // 使用CatmullRomSpline生成平滑曲线
            const spline = new CatmullRomSpline({
              times: positions.map((_, i) => i),
              points: positions,
            });
            const smoothPoints = [];
            for (let i = 0; i <= positions.length * 10; i++) {
              const time =
                (i / (positions.length * 10)) * (positions.length - 1);
              smoothPoints.push(spline.evaluate(time));
            }
            return smoothPoints;
          }, false),
          width: 3,
          material: Color.CYAN,
        },
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
          <div>
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
          <div>
            <Button className="hz-btn">添加点</Button>
            <Button className="hz-btn">添加线</Button>
          </div>
        </div>
        <div className="hz-style"></div>
      </div>
    </MapContainer>
  );
}

export default Editor;

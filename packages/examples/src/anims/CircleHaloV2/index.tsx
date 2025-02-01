import { HZViewer } from '@hztx/core';
import { useEffect, useState } from 'react';
import MapContainer from '../../components/map-container';
import {
  Cartesian3,
  Color,
  KmlDataSource,
  PolylineDashMaterialProperty,
  HeightReference,
  Math as CesiumMath,
  CallbackProperty,
  Rectangle,
  MaterialProperty,
  Material,
  Viewer,
  Entity,
  JulianDate,
  Cartesian2,
  ImageMaterialProperty,
  PostProcessStage,
  SceneTransforms,
  PointPrimitive,
  Primitive,
  EllipsoidSurfaceAppearance,
  CircleGeometry,
  GeometryInstance,
  MaterialAppearance,
  PerInstanceColorAppearance,
  ColorMaterialProperty,
  CircleOutlineGeometry,
  VertexFormat,
  ColorGeometryInstanceAttribute,
} from 'cesium';
import { Button, ColorPicker, Input, InputNumber } from 'antd';
// import Cesium from 'cesium';

interface IPlayer {
  play: () => void;
  pause: () => void;
  replay: () => void;
  destroy: () => void;
}

type CircleStyle = {
  color: string; // 光圈颜色
};

// 光圈效果的选项
type CircleHaloOptions = {
  image: string; // 图片
  color: string;
  minAlpha: number; // 最小透明度
  maxAlpha: number; // 最大透明度
  initialRadius: number; // 初始半径
  maxScale: number; // 最大缩放
  duration: number; // 动画运行时间、从初始状态到放大到最大、需要的时间,浩淼
};

const DefaultOptions: CircleHaloOptions = {
  color: '#00F',
  duration: 3000,
  initialRadius: 3000,
  maxScale: 2,
  minAlpha: 1,
  maxAlpha: 1,
  image: 'assets/circle-halo1.png',
};

function calculateRectangleBounds(longitude, latitude, radius) {
  // 地球半径（单位：米）
  const earthRadius = 6378137.0;

  // 将经纬度转换为弧度
  const latRad = latitude * (Math.PI / 180);
  const lonRad = longitude * (Math.PI / 180);

  // 计算纬度的变化量
  const deltaLat = radius / earthRadius;
  // 计算经度的变化量，考虑纬度的影响
  const deltaLon = radius / (earthRadius * Math.cos(latRad));

  // 计算边界
  const west = (lonRad - deltaLon) * (180 / Math.PI);
  const south = (latRad - deltaLat) * (180 / Math.PI);
  const east = (lonRad + deltaLon) * (180 / Math.PI);
  const north = (latRad + deltaLat) * (180 / Math.PI);

  return { west, south, east, north };
}

class CircleHaloPlayer implements IPlayer {
  private coordinates: any[];
  private viewer: Viewer;
  private ety: Entity;
  private options: CircleHaloOptions;
  private startTime: any;
  private isPlaying: boolean;

  private pausing = true;

  constructor(viewer: Viewer, coordinates: any[], options?: CircleHaloOptions) {
    this.viewer = viewer;
    this.coordinates = coordinates;

    const {
      image,
      color,
      duration,
      minAlpha,
      maxAlpha,
      maxScale,
      initialRadius,
    } = (this.options = {
      ...DefaultOptions,
      ...options,
    });

    this.startTime = null; // 动画开始时间
    this.isPlaying = false; // 动画状态

    const [longitude, latitude] = coordinates;
    const maxRadius = maxScale * initialRadius;

    const initialBounds = calculateRectangleBounds(
      longitude,
      latitude,
      initialRadius
    );

    this.ety = viewer.entities.add({
      rectangle: {
        coordinates: new CallbackProperty((time, result) => {
          // 动态计算边界
          if (!this.startTime || !this.isPlaying) {
            return Rectangle.fromDegrees(
              initialBounds.west,
              initialBounds.south,
              initialBounds.east,
              initialBounds.north
            );
          }
          // 计算动画进度
          const elapsedTime = JulianDate.secondsDifference(
            time,
            this.startTime
          );
          const progress = Math.abs(
            Math.sin((elapsedTime / (duration / 1000)) * Math.PI)
          ); // 正弦波动画
          const currentRadius =
            initialRadius + (maxRadius - initialRadius) * progress;

          const bounds = this._calculateBounds(currentRadius);

          // 计算当前透明度
          const currentAlpha = minAlpha + (maxAlpha - minAlpha) * progress;
          // 更新透明度
          if (this?.ety?.rectangle) {
            this.ety.rectangle.material.color =
              Color.fromCssColorString(color).withAlpha(currentAlpha);
          }

          return Rectangle.fromDegrees(
            bounds.west,
            bounds.south,
            bounds.east,
            bounds.north
          );
        }, false),
        material: new ImageMaterialProperty({
          image: image, // 替换为你的图片 URL
          transparent: true, // 如果需要透明背景
          color: Color.fromCssColorString(color).withAlpha(minAlpha),
        }),
      },
    });
  }

  // 计算矩形边界
  _calculateBounds(radius) {
    const earthRadius = 6378137.0;
    const latRad = this.coordinates[1] * (Math.PI / 180);
    const lonRad = this.coordinates[0] * (Math.PI / 180);

    const deltaLat = radius / earthRadius;
    const deltaLon = radius / (earthRadius * Math.cos(latRad));

    return {
      west: (lonRad - deltaLon) * (180 / Math.PI),
      south: (latRad - deltaLat) * (180 / Math.PI),
      east: (lonRad + deltaLon) * (180 / Math.PI),
      north: (latRad + deltaLat) * (180 / Math.PI),
    };
  }

  // 播放动画
  play() {
    if (!this.isPlaying) {
      this.startTime = this.viewer.clock.currentTime;
      this.isPlaying = true;
      this.viewer.clock.shouldAnimate = true;
    }
  }

  // 暂停动画
  pause() {
    this.isPlaying = false;
    this.viewer.clock.shouldAnimate = false;
  }

  // 重新播放动画
  replay() {
    this.startTime = this.viewer.clock.currentTime;
    this.isPlaying = true;
    this.viewer.clock.shouldAnimate = true;
  }

  // 销毁矩形实体
  destroy() {
    this.viewer.entities.remove(this.ety);
  }
}

function createCircleHalo(viewer, coordinate, radius, color) {
  const center = Cartesian3.fromDegrees(...coordinate);
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

  // 定义材质（光晕效果）
  const haloMaterial = new Material({
    fabric: {
      type: 'Glow',
      uniforms: {
        color: color,
        glowPower: 0.8,
        radius1: 0.3, // 第一个圆环的半径
        radius2: 0.5, // 第二个圆环的半径
      },
      source: `
        uniform vec4 color;
        uniform float glowPower;
        uniform float radius1; // 第一个圆环的半径
        uniform float radius2; // 第二个圆环的半径
        
        czm_material czm_getMaterial(czm_materialInput materialInput) {
            czm_material material = czm_getDefaultMaterial(materialInput);
            vec2 st = materialInput.st;
            float dist = distance(st, vec2(0.5)); // 计算当前点到中心的距离
            
            // 计算第一个圆环的发光效果
            float glow1 = smoothstep(radius1, radius1 + 0.1, dist);
            float glow2 = smoothstep(radius1 + 0.1, radius1 + 0.2, dist);
            float glowRing1 = (glow1 - glow2); // 第一个圆环的淡入效果
            
            // 计算第二个圆环的发光效果
            float glow3 = smoothstep(radius2, radius2 + 0.1, dist);
            float glow4 = smoothstep(radius2 + 0.1, radius2 + 0.2, dist);
            float glowRing2 = (glow3 - glow4); // 第二个圆环的淡入效果
            
            // 将两个圆环的发光效果叠加
            float glow = glowRing1 + glowRing2;
            
            material.diffuse = color.rgb; // 根据距离调整颜色
            material.alpha = glow * glowPower; // 根据距离调整透明度
            return material;
        }
        `,
    },
  });

  // 创建外观
  const appearance = new MaterialAppearance({
    material: haloMaterial,
    aboveGround: true,
    flat: true,
  });

  // 创建Primitive并添加到场景中
  const circlePrimitive = new Primitive({
    geometryInstances: circleInstance,
    appearance: appearance,
    asynchronous: false,
  });

  viewer.scene.primitives.add(circlePrimitive);

  let time = 0.0;
  viewer.scene.preUpdate.addEventListener(() => {
    time += 0.01; // 控制淡入淡出的速度
    if (time > 1.0) {
      time = 0.0; // 重置时间
    }
    circlePrimitive.appearance.material.uniforms.radius1 = time;
    circlePrimitive.appearance.material.uniforms.radius2 = time + 0.2;
  });

  return circlePrimitive;
}

function CircleHalo() {
  let player: IPlayer;

  const [color, setColor] = useState('#F00');
  const [image, setImage] = useState('assets/circle-halo1.png');
  const [radius, setRadius] = useState(50000);
  const [duration, setDuration] = useState(3000);
  const [maxScale, setMaxScale] = useState(1);
  const [minAlpha, setMinAlpha] = useState(0.5);
  const [maxAlpha, setMaxAlpha] = useState(1);

  useEffect(() => {
    const hz = new HZViewer('map');
    const { viewer } = hz;

    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(
        104.167869626642999,
        30.758956896017201,
        10000
      ),
    });

    createCircleHalo(
      viewer,
      [104.167869626642999, 30.7580568960172],
      50,
      Color.RED
    );
    createCircleHalo(
      viewer,
      [104.167569626642999, 30.7584568960172],
      50,
      Color.YELLOW
    );
    createCircleHalo(
      viewer,
      [104.167869626642999, 30.7539568960172],
      50,
      Color.BROWN
    );
    createCircleHalo(
      viewer,
      [104.164869626642999, 30.7529568960172],
      50,
      Color.GREEN
    );

    return () => {
      viewer.destroy();
    };
  }, []);

  const play = () => {
    player.play();
  };

  const pause = () => {
    player.pause();
  };

  const replay = () => {
    player.replay();
  };

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

export default CircleHalo;

import { HZViewer } from "@hztx/core";
import { useEffect, useState } from "react";
import MapContainer from '../../components/map-container';
import { Cartesian3, Color, KmlDataSource, PolylineDashMaterialProperty, HeightReference, Math as CesiumMath, CallbackProperty, Rectangle, MaterialProperty, Material, Viewer, Entity, JulianDate, Cartesian2, ImageMaterialProperty } from "cesium";
import { Button, ColorPicker, Input, InputNumber } from "antd";
// import Cesium from 'cesium';


interface IPlayer {
  play: () => void;
  pause: () => void;
  replay: () => void;
  destroy: () => void;
}

type CircleStyle = {
  color: string; // 光圈颜色
}

// 光圈效果的选项
type CircleHaloOptions = {
  image: string; // 图片
  color: string;
  minAlpha: number; // 最小透明度
  maxAlpha: number; // 最大透明度
  initialRadius: number; // 初始半径
  maxScale: number; // 最大缩放
  duration: number; // 动画运行时间、从初始状态到放大到最大、需要的时间,浩淼
}


const DefaultOptions: CircleHaloOptions = {
  color: '#00F',
  duration: 3000,
  initialRadius: 30,
  maxScale: 200,
  minAlpha: 1,
  maxAlpha: 1,
  image: 'assets/circle-halo1.png'
}

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


    const { image, color, duration, minAlpha, maxAlpha, maxScale, initialRadius } = this.options = {
      ...DefaultOptions,
      ...options,
    };

    this.startTime = null; // 动画开始时间
    this.isPlaying = false; // 动画状态

    const [longitude, latitude] = coordinates;
    const maxRadius = maxScale * initialRadius;

    const initialBounds = calculateRectangleBounds(longitude, latitude, initialRadius);

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
          const elapsedTime = JulianDate.secondsDifference(time, this.startTime);
          const progress = Math.abs(Math.sin((elapsedTime / (duration / 1000)) * Math.PI)); // 正弦波动画
          const currentRadius = initialRadius + (maxRadius - initialRadius) * progress;

          const bounds = this._calculateBounds(currentRadius);

          // 计算当前透明度
          const currentAlpha = minAlpha + (maxAlpha - minAlpha) * progress;
          // 更新透明度
          if (this?.ety?.rectangle) {
            this.ety.rectangle.material.color = Color.fromCssColorString(color).withAlpha(currentAlpha);
          }

          return Rectangle.fromDegrees(bounds.west, bounds.south, bounds.east, bounds.north);
      }, false),
        material: new ImageMaterialProperty({
          image: image, // 替换为你的图片 URL
          transparent: true, // 如果需要透明背景
          color: Color.fromCssColorString(color).withAlpha(minAlpha)
        })
      },
    })
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

function CircleHalo() {
  let player: IPlayer;

  const [color, setColor] = useState('#F00');
  const [image, setImage] = useState('assets/circle-halo1.png');
  const [radius, setRadius] = useState(50);
  const [duration, setDuration] = useState(3000);
  const [maxScale, setMaxScale] = useState(2000);
  const [minAlpha, setMinAlpha] = useState(0.5);
  const [maxAlpha, setMaxAlpha] = useState(1);

  useEffect(() => {
    const hz = new HZViewer('map');
    const { viewer } = hz;

    /**
    // 方案1，用一个矩形、然后加一个图片填充矩形、动态调整矩形大小实现波动效果
    // 定义图片的初始区域
    // const west = Math.toRadians(-100.0);
    // const south = Math.toRadians(20.0);
    // const east = Math.toRadians(-90.0);
    // const north = Math.toRadians(30.0);

    // // 添加图片实体
    // const imageEntity = viewer.entities.add({
    //     rectangle: {
    //         coordinates: new CallbackProperty(() => rectangleCoordinates, false), // 动态更新坐标
    //         material: "/circle-halo1.png", // 替换为你的图片 URL
    //     },
    // });

    // // 初始矩形区域
    // let 
    //  = new Rectangle(west, south, east, north);

    // // 动画参数
    // let scaleFactor = 0.005; // 缩放因子
    // let expanding = true; // 控制放大或缩小

    // // 动画控制
    // viewer.clock.onTick.addEventListener(() => {
    //     // 计算中心点
    //     const centerLon = (rectangleCoordinates.west + rectangleCoordinates.east) / 2;
    //     const centerLat = (rectangleCoordinates.south + rectangleCoordinates.north) / 2;

    //     // 调整边界，实现缩放
    //     const width = (rectangleCoordinates.east - rectangleCoordinates.west) / 2;
    //     const height = (rectangleCoordinates.north - rectangleCoordinates.south) / 2;

    //     if (expanding) {
    //         // 放大
    //         rectangleCoordinates = new Rectangle(
    //             centerLon - width * (1 + scaleFactor),
    //             centerLat - height * (1 + scaleFactor),
    //             centerLon + width * (1 + scaleFactor),
    //             centerLat + height * (1 + scaleFactor)
    //         );
    //     } else {
    //         // 缩小
    //         rectangleCoordinates = new Rectangle(
    //             centerLon - width * (1 - scaleFactor),
    //             centerLat - height * (1 - scaleFactor),
    //             centerLon + width * (1 - scaleFactor),
    //             centerLat + height * (1 - scaleFactor)
    //         );
    //     }

    //     console.log(width)
    //     // 控制缩放范围
    //     if (width > 0.2 || height > 0.2) {
    //         expanding = false; // 达到最大范围后缩小
    //     } else {
    //         expanding = true;
    //     }
    // });

    // 方案2 billboard实现，需要素材
    // 添加扩散圆光环
    // const glowRing = viewer.entities.add({
    //   position: Cartesian3.fromDegrees(-75.59777, 40.03883),
    //   billboard: {
    //     width: 50,
    //     height: 50,
    //     image: "/circle-halo1.png", // 替换为你的光环纹理
    //     scale: 1.0,
    //     color: Color.YELLOW.withAlpha(0.8),
    //   },
    // });

    // // 动画参数
    // let scale = 1.0;
    // let expanding = true;

    // // 动态更新扩散动画
    // viewer.clock.onTick.addEventListener(() => {
    //   // 扩散逻辑
    //   if (expanding) {
    //     scale += 0.01; // 放大
    //     if (scale > 1.5) expanding = false;
    //   } else {
    //     scale -= 0.2; // 缩小
    //     if (scale < 1) expanding = true;
    //   }

    //   // 更新光环的 scale 和透明度
    //   glowRing.billboard.scale = scale;
    //   glowRing.billboard.color = Color.ORANGE.withAlpha(1.0 - (scale - 1.0) / 2.0);
    // });


    // 方案3： 用shader实现，无需素材、
    // const glowMaterial = new Material({
    //     fabric: {
    //         type: 'Glow',
    //         uniforms: {
    //             color: new Color(1.0, 1.0, 0.0, 1.0), // 光晕颜色
    //             speed: 1.0, // 光晕速度
    //         },
    //         source: `
    //             uniform vec4 color;
    //             uniform float speed;
    //             czm_material czm_getMaterial(czm_materialInput materialInput) {
    //                 czm_material material = czm_getDefaultMaterial(materialInput);
    //                 float time = czm_frameNumber * speed * 0.01;
    //                 float glow = sin(time) * 0.5 + 0.5;
    //                 material.diffuse = color.rgb * glow;
    //                 material.alpha = color.a * glow;
    //                 return material;
    //             }
    //         `,
    //     },
    // });

    // const point = viewer.entities.add({
    //     position: Cartesian3.fromDegrees(-75.59777, 40.03883),
    //     point: {
    //         pixelSize: 50,
    //         material: glowMaterial,
    //     },
    // });

    // let size = 10;
    // let alpha = 1.0;
    // let growing = true;

    // viewer.clock.onTick.addEventListener(function(clock) {
    //     if (growing) {
    //         size += 1;
    //         alpha -= 0.02;
    //         if (size >= 50) {
    //             growing = false;
    //         }
    //     } else {
    //         // size -= 1;
    //         size = 10;
    //         alpha = 1;
    //         // alpha += 0.02;
    //         if (size <= 10) {
    //             growing = true;
    //         }
    //     }

    //     point.point.pixelSize = size;
    //     point.point.color = Color.YELLOW.withAlpha(alpha);
    // });
     */

    player = new CircleHaloPlayer(viewer, [-75.59777, 40.03883], {
      color,
      initialRadius: radius,
      image,
      duration,
      maxScale,
      minAlpha,
      maxAlpha,
    })

    return () => {
      player.destroy()
      viewer.destroy();
    };
  }, [color, image, radius, duration, maxScale, minAlpha, maxAlpha]);

  const play = () => {
    player.play();
  }

  const pause = () => {
    player.pause();
  }

  const replay = () => {
    player.replay();
  }

  return (
    <MapContainer>
      <div style={{ width: '100%', height: '100%' }} id="map"></div>
      <div>
        <div className="hz-player">
          <Button className='hz-btn' onClick={play}>播放</Button>
          <Button className='hz-btn' onClick={pause}>暂停</Button>
          <Button className='hz-btn' onClick={replay}>重新播放</Button>
        </div>
        <div className="hz-style">
          <div className="hz-style-item">
            <InputNumber addonBefore="动画时长" defaultValue={duration} onBlur={(e) => setDuration(Number(e.target.value))} />
          </div>
          <div className="hz-style-item">
            <label>光圈颜色</label>
            <ColorPicker showText defaultValue={color} onChange={(e) => setColor(`#${e.toHex()}`)} />
          </div>
          <div className="hz-style-item">
            <InputNumber addonBefore="最大透明度" defaultValue={maxAlpha} onBlur={(e) => setMaxAlpha(Number(e.target.value))} />
          </div>
          <div className="hz-style-item">
            <InputNumber addonBefore="最小透明度" defaultValue={minAlpha} onBlur={(e) => setMinAlpha(Number(e.target.value))} />
          </div>
          <div className="hz-style-item">
            <InputNumber addonBefore="半径" defaultValue={radius} onBlur={(e) => setRadius(Number(e.target.value))} />
          </div>
          <div className="hz-style-item">
            <InputNumber addonBefore="最大缩放" defaultValue={maxScale} onBlur={(e) => setMaxScale(Number(e.target.value))} />
          </div>
          <div className="hz-style-item">
            <Input addonBefore="图片地址" defaultValue={image} onBlur={(e) => setImage(e.target.value)} />
          </div>
        </div>
      </div>
    </MapContainer>
  )
}

export default CircleHalo
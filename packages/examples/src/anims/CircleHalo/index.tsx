import { HZViewer } from "@hztx/core";
import { useEffect, useState } from "react";
import MapContainer from '../../components/map-container';
import { Cartesian3, Color, KmlDataSource, PolylineDashMaterialProperty, CallbackProperty, Rectangle, MaterialProperty, Material, Viewer, Entity, JulianDate } from "cesium";
import { Button, ColorPicker, Input, InputNumber } from "antd";



interface IPlayer {
  play: () => void;
  pause: () => void;
  replay: () => void;
}

type CircleStyle = {
  color: string; // 光圈颜色
  radius: number; // 光圈半径：米为单位
}

// 光圈效果的选项
type CircleHaloOptions = {
  image?: string; // 图片
  style: CircleStyle;
  frameRate?: number; // 动画帧率
  minAlpha?: number; // 最小透明度
  maxAlpha?: number; // 最大透明度
  maxScale: number; // 最大缩放倍数
  duration: number; // 动画运行时间、从初始状态到放大到最大、需要的时间
}


const DefaultOptions: CircleHaloOptions = {
  style: {
    color: '#00F',
    radius: 50,
  },
  duration: 3,
  maxScale: 2,
  frameRate: 60,
  minAlpha: 1,
  maxAlpha: 1,
  image: 'assets/circle-halo1.png'
}
class CircleHaloPlayer implements IPlayer {
  private coordinates: any[];
  private viewer: Viewer;
  private ety: Entity;
  private options: CircleHaloOptions;

  private currentTime: JulianDate;

  private pausing = true;

  private scaleCallbackProperty: CallbackProperty;

  constructor(viewer: Viewer, coordinates: any[], options?: CircleHaloOptions) {
    this.viewer = viewer;
    this.coordinates = coordinates;


    const { image, style: { color, radius } } = this.options = {
      ...DefaultOptions,
      ...options,
    };

    this.ety = viewer.entities.add({
      position: Cartesian3.fromDegrees(coordinates[0], coordinates[1]),
      billboard: {
        width: radius, // 宽高根据radio算
        height: radius,
        image: image,
        scale: this.options.maxScale === 1 ? 1 : this.getScaleCallbackProperty(),
        color: this.options.minAlpha === this.options.maxAlpha ? Color.fromCssColorString(this.options.style.color).withAlpha(this.options.maxAlpha) : this.getOpcityCallbackProperty()
      },
    });
  }

  // 控制缩放的callback属性
  private getScaleCallbackProperty() {
    let reset = true, result = 1;
    return (this.scaleCallbackProperty = new CallbackProperty((time) => {
      if (this.pausing) return result;
      if (reset) {
        result = 1;
        reset = false;
      }

      const elapsed = (Date.now() % (this.options.duration * 1000)) / 1000; // 已过去的时间（秒），范围 [0, duration]
      const normalizedTime = elapsed / this.options.duration; // 归一化时间，范围 [0, 1]

      // 通过正弦函数让 scale 在 [1, maxScale] 之间变化
      result = 1 + (this.options.maxScale - 1) * Math.sin(normalizedTime * Math.PI);
      return result;
    }, false))
  }

  private getOpcityCallbackProperty() {
    let reset = true, result = Color.fromCssColorString(this.options.style.color);
    const baseColor = Color.fromCssColorString(this.options.style.color);
    const duration = this.options.duration;
    const minAlpha = this.options.minAlpha;
    const maxAlpha = this.options.maxAlpha;
    return (this.scaleCallbackProperty = new CallbackProperty(() => {
      if (this.pausing) return result;
      if (reset) {
        result = baseColor;
        reset = false;
      }
      const elapsed = (Date.now() % (duration * 1000)) / 1000; // 当前周期内已过去的秒数
      const normalizedTime = elapsed / duration; // 归一化时间，范围 [0, 1]

      console.log(minAlpha, maxAlpha);
      // 使用正弦函数控制透明度在 [minAlpha, maxAlpha] 之间变化
      const alpha =
        minAlpha +
        (maxAlpha - minAlpha) * (0.5 + 0.5 * Math.sin(normalizedTime * Math.PI * 2));

      result = baseColor.withAlpha(alpha);
      // 返回动态颜色（保持其他颜色不变，仅动态控制 alpha）
      return result;
    }, false))
  }

  play() {
    this.pausing = false;
    this.currentTime = JulianDate.now();
  }
  pause() {
    this.pausing = true;
  }
  replay() {
    this.ety.billboard!.scale = this.getScaleCallbackProperty();
    this.play();
  }
}


function CircleHalo() {
  let player: IPlayer;

  const [color, setColor] = useState('#F00');
  const [image, setImage] = useState('assets/circle-halo1.png');
  const [radius, setRadius] = useState(50);
  const [duration, setDuration] = useState(3);
  const [maxScale, setMaxScale] = useState(2);
  const [minAlpha, setMinAlpha] = useState(1);
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
    // let rectangleCoordinates = new Rectangle(west, south, east, north);

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

    console.log(color, image, radius, duration)
    player = new CircleHaloPlayer(viewer, [-75.59777, 40.03883], {
      style: {
        color,
        radius,
      },
      image,
      duration,
      maxScale,
      minAlpha,
      maxAlpha,
    })

    return () => {
      viewer.destroy();
    };
  }, [color, image, radius, duration, maxScale]);

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
import './style.css';


import { HZViewer } from "@hztx/core";
import { useContext, useEffect, useRef, useState } from "react";
import MapContainer from '../../components/map-container';
import { Cartesian3, Color, PolylineDashMaterialProperty, Math as CMath, Viewer, HeadingPitchRange, CallbackPositionProperty, CallbackProperty, Ellipsoid, Material, PolylineGlowMaterialProperty, PolylineOutlineMaterialProperty, PolylineArrowMaterialProperty, Entity, JulianDate } from "cesium";
import PathGeoJSONData from '../assets/pathForBike.json';
import { interpolateCoordinates } from "./tween";
import { Button, ColorPicker, Input, InputNumber, Select, Switch } from "antd";
import { IPlayer } from '../../types';

type PolyLineStyle = {
  lineType?: 'full' | 'dash' | 'glow' | 'outline';
  color?: string;
  outlineColor?: string;
  width?: number;
  outlineWidth?: number;
}
 
type PathOptions = {
  duration?: number;
  frameRate?: number;
  cameraTrack?: boolean;
  style?: PolyLineStyle;
  image?: {
    url: string;
    width?: number;
    height?: number;
    calcAngle?: boolean;
  }
}

class PathPlayer implements IPlayer {
  private lineEntity: Entity;
  private imageEntity: Entity;
  private coordinates: any[];
  private pausing = false;
  private callbackProperty: CallbackProperty;
  private currentTime: JulianDate = JulianDate.now();
  private calcAngle = true;

  constructor(private viewer: Viewer, coordinates: any[], options?: PathOptions) {
    const { duration = 5000, cameraTrack = false, frameRate = 60, style, image } = options || ({} as PathOptions);
    const { lineType = 'full', width = 5, outlineWidth = 3, color = '#00F', outlineColor = '#F00' } = style || ({} as PolyLineStyle);
    const { width: imageWidth = 32, height: imageHeight = 32, calcAngle = false, url: imageUrl } = image || ({} as any);
    this.calcAngle = calcAngle;
    

    let material;
    switch (lineType) {
        case 'dash':
            material = new PolylineDashMaterialProperty({
                color: Color.fromCssColorString(color),
                dashLength: 8.0, // 虚线长度
            });
            break;
        case 'glow':
            material = new PolylineGlowMaterialProperty({
                glowPower: 0.2,
                color: Color.fromCssColorString(color),
            });
            break;
        case 'outline':
            material = new PolylineOutlineMaterialProperty({
                color: Color.fromCssColorString(color),
                outlineColor: Color.fromCssColorString(outlineColor),
                outlineWidth: outlineWidth,
            });
            break;
        default:
            material = Color.fromCssColorString(color); // 默认实线
    }

    this.coordinates = interpolateCoordinates(coordinates, duration, frameRate);

    if (imageUrl) {
      this.imageEntity = this.viewer.entities.add({
        name: "Moving Image",
        position: Cartesian3.fromDegrees(coordinates[0][0], coordinates[0][1], coordinates[0][2]),
        billboard: {
            image: imageUrl, // 'assets/airplane.png', // 替换为你的图片路径
            width: imageWidth,
            height: imageHeight,
       },
      }); 
      if (cameraTrack) {
        viewer.trackedEntity = this.imageEntity;
      }
    }

    this.lineEntity = this.viewer.entities.add({
        name: "Path",
        polyline: {
          // positions: Cartesian3.fromDegreesArrayHeights(coordinates.flat()),
          positions: this.getCallbackProperty(),
          width: width,
          material,
          //箭头
          // material: new PolylineArrowMaterialProperty(Color.ORANGE),
          clampToGround: true,
        },
      });
  }

  play() {
    this.pausing = false;
    this.currentTime = JulianDate.now();
  }
  pause() {
    this.pausing = true;
  }
  replay() {
    this.lineEntity.polyline!.positions = this.getCallbackProperty();
    this.play();
  }

  private getCallbackProperty() {
    let i = 1, reset = true;
    return (this.callbackProperty = new CallbackProperty((e, result) => {
      if (this.pausing) return result;
      if (reset) {
        result.length = 0;
        reset = false;
      }
      if (i >= this.coordinates.length) { 
        return result;
      }
      // const diff = JulianDate.secondsDifference(this.currentTime!, JulianDate.now()!);
      // console.log('diff seceonds', diff);
      // const frameCount = Math.max(Math.floor(diff * 1000 / 60), 1);
      // console.log('result', result);
      
      if (!result?.length) {
        result.push(...this.coordinates.slice(0, 1).map(c => Cartesian3.fromDegrees(c[0], c[1], c[2])))
      }
      // console.log('frameCount', frameCount);
      if (this.imageEntity) {
        const position = Cartesian3.fromDegrees(this.coordinates[i][0], this.coordinates[i][1], this.coordinates[i][2]);
        this.imageEntity.position = position;
        if (this.calcAngle) {
          const prePosition = Cartesian3.fromDegrees(this.coordinates[i - 1][0], this.coordinates[i - 1][1], this.coordinates[i - 1][2]);
          const direction = Cartesian3.subtract(prePosition, position, new Cartesian3());
          this.imageEntity.billboard.rotation = Math.atan2(direction.y, direction.x) - Math.PI / 2;             
        }
      }

      if (i < this.coordinates.length) {
        const position = Cartesian3.fromDegrees(this.coordinates[i][0], this.coordinates[i][1], this.coordinates[i][2]);
        result.push(position);
        i++;
      }

      return result;
    }, false))
  }
}

// 自定义渐变Shader
const gradientShader = `
uniform vec4 color;
uniform float speed;
varying float v_distance;

czm_material czm_getMaterial(czm_materialInput materialInput) {
    czm_material material = czm_getDefaultMaterial(materialInput);

    // 计算渐变效果
    float gradient = sin(v_distance * speed) * 0.5 + 0.5;
    material.diffuse = color.rgb * gradient;
    material.alpha = color.a * gradient;

    return material;
}
`;

// 创建自定义材质
const gradientMaterial = new Material({
    fabric: {
        type: 'GradientLine',
        uniforms: {
            color: Color.ORANGE, // 线的颜色
            speed: 0.1 // 渐变速度
        },
        source: gradientShader
    },
    translucent: true // 允许透明
});

function animate(coordinates, viewer: Viewer) {
  let index = 0;
    const totalPoints = coordinates.length;

    const updatePosition = (entity) => {
        if (index < totalPoints) {
            const position = Cartesian3.fromDegrees(coordinates[index][0], coordinates[index][1], coordinates[index][2]);
            entity.position = position;
  
            index++;
        } else {
            index = 0; // 重置索引以循环动画
        }
    };

    return updatePosition;
}


function Path() {
    let player: IPlayer;
    const [lineType, setLineType] = useState('full');
    const [lineColor, setLineColor] = useState('#FFF');
    const [lineWidth, setLineWidth] = useState(10);
    const [outlineWidth, setOutlineWidth] = useState(5);
    const [outlineColor, setOutlineColor] = useState('#F00');
    const [calcAngle, setCalcAngle] = useState(false);
    const [image, setImage] = useState('assets/airplane.png');
    const [imageWidth, setImageWidth] = useState(100);
    const [imageHeight, setImageHeight] = useState(100);
    const [duration, setDuration] = useState(10 * 1000);

    useEffect(() => {
        const hz = new HZViewer('map');
        const { viewer } = hz;
        // viewer.camera.changed.addEventListener((e) => {
        //   const { heading, pitch, roll } = viewer.camera
        //   console.log('摄像头方向', CMath.toDegrees(heading), CMath.toDegrees(pitch), CMath.toDegrees(roll))
        // })
        const coordinates: any = PathGeoJSONData.features[0].geometry.coordinates.map((c) => [...c, 0]);
        player = new PathPlayer(
          viewer, coordinates, 
          { 
            cameraTrack: true, 
            duration: duration, 
            style: { lineType, color: lineColor, outlineColor, width: lineWidth, outlineWidth },
            image: { url: image, width: imageWidth, height: imageHeight, calcAngle }
      });

        return () => {
            viewer.destroy();
        };
      }, [lineType, lineColor, outlineColor, lineWidth, outlineWidth, calcAngle, image, imageWidth, imageHeight, duration ]);

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
            <div style={{ width: '100%', height: '100%' }} id="map">
            </div>   
            <div>
              <div className="hz-player">
                <Button className='hz-btn' onClick={play}>播放</Button>
                <Button className='hz-btn'  onClick={pause}>暂停</Button>
                <Button className='hz-btn'  onClick={replay}>重新播放</Button>
              </div>
              <div className="hz-style">
                <div className="hz-style-item">
                  <Select
                    defaultValue="lineType"
                    style={{ width: 120 }}
                    onChange={(e) => setLineType(e)}
                    options={[
                      { value: 'full', label: '实现' },
                      { value: 'outline', label: '边缘线' },
                      { value: 'glow', label: '外发光' },
                      { value: 'dash', label: '虚线' }
                    ]}
                  />
                </div>

                <div className="hz-style-item">
                  <InputNumber addonBefore="执行周期" defaultValue={duration} onChange={(e) => setDuration(e)} />
                </div>
                <div className="hz-style-item">
                  <span>线颜色：</span>
                  <ColorPicker showText defaultValue={lineColor} onChange={(e) => setLineColor(`#${e.toHex()}`)} />
                </div>
                <div className="hz-style-item">
                  <InputNumber addonBefore="线宽" defaultValue={lineWidth} onChange={(e) => setLineWidth(e)} />
                </div>
                <div className="hz-style-item">
                  <span>边线颜色：</span>
                  <ColorPicker showText defaultValue={outlineColor} onChange={(e) => setOutlineColor(`#${e.toHex()}`)} />
                </div>
                <div className="hz-style-item">
                  <InputNumber addonBefore="边宽" defaultValue={lineWidth} onChange={(e) => setLineWidth(e)} />
                </div>
                <div className="hz-style-item">
                  <Input addonBefore="图片地址" defaultValue={image} onChange={(e) => setImage(e)} />
                </div>
                <div className="hz-style-item">
                  <InputNumber addonBefore="图片宽度" defaultValue={imageWidth} onChange={(e) => setImageWidth(e)} />
                </div>
                <div className="hz-style-item">
                  <InputNumber addonBefore="图片高度" defaultValue={imageHeight} onChange={(e) => setImageHeight(e)} />
                </div>
                <div className="hz-style-item">
                  <span>图片是否旋转</span>
                  <Switch defaultValue={calcAngle} onChange={(e) => { setCalcAngle(e) }} />
                </div>
              </div>
            </div>    
        </MapContainer>
    )
}

export default Path
// 文字的动画帧
import React, { useEffect, useRef } from 'react';
import MapContainer from '../../components/map-container';
import { Button } from 'antd';
import {
  AnimationController,
  AnimationTrack,
  CameraAnimationTarget,
  cameraFlyInterpolate,
  PointHaloAnimationTarget,
  TextAnimationTarget,
  TextTagAnimationTarget,
} from '@hztx/animations';
import {
  Cartesian3,
  CircleGeometry,
  Color,
  Entity,
  GeometryInstance,
  Material,
  MaterialAppearance,
  Primitive,
  SceneMode,
  Viewer,
} from 'cesium';
import { HZViewer } from '@hztx/core';
import { TextAnimationType, TextEntity } from '../../addon_entities/Text';

function TextKeyframe() {
  const aniCtr = new AnimationController();
  const context = useRef<{ viewer: Viewer }>({
    viewer: null,
  });

  useEffect(() => {
    const hz = new HZViewer('map', { sceneMode: SceneMode.SCENE3D });
    const { viewer }: { viewer: Viewer } = hz;
    context.current.viewer = viewer;

    // 实现一个简单动画，从全球场景飞到成都市
    const cameraTarget = new CameraAnimationTarget(viewer.camera);

    const data = [
      {
        cameraFly: {
          start: 0,
          end: 1000,
          fly: {
            end: {
              position: [
                116.3333, 39.9333, 56252.302494599673,
              ],
              direction: [5.088887, -89.9190563526215],
            },
            start: {
              position: [
                -75.4204237390705, 33.85698238168112, 8567977.849840268,
              ],
              direction: [5.088887, -89.9190563526215],
            },
          },
        },
        pois: {
          positions: [
            {
              position: [116.42, 39.93], // 东城区政府驻地坐标
              color: '#FF0000',
              duration: 1500,
              name: '东城区',
            },
            {
              position: [116.37, 39.92], // 西城区政府驻地坐标
              color: '#00FF00',
              duration: 1500,
              name: '西城区',
            },
            {
              position: [116.49, 39.94], // 朝阳区政府驻地坐标
              color: '#0000FF',
              duration: 1500,
              name: '朝阳区',
            },
            {
              position: [116.28, 39.85], // 丰台区政府驻地坐标
              color: '#FFFF00',
              duration: 1500,
              name: '丰台区',
            },
            {
              position: [116.22, 39.90], // 石景山区政府驻地坐标
              color: '#FF00FF',
              duration: 1500,
              name: '石景山区',
            },
            {
              position: [116.30, 39.99], // 海淀区政府驻地坐标
              color: '#00FFFF',
              duration: 1500,
              name: '海淀区',
            },
            {
              position: [116.10, 39.94], // 门头沟区政府驻地坐标
              color: '#800080',
              duration: 1500,
              name: '门头沟区',
            },
            {
              position: [116.14, 39.72], // 房山区政府驻地坐标
              color: '#008000',
              duration: 1500,
              name: '房山区',
            },
            {
              position: [116.66, 39.91], // 通州区政府驻地坐标
              color: '#FFA500',
              duration: 1500,
              name: '通州区',
            },
            {
              position: [116.65, 40.13], // 顺义区政府驻地坐标
              color: '#A52A2A',
              duration: 1500,
              name: '顺义区',
            },
            {
              position: [116.20, 40.22], // 昌平区政府驻地坐标
              color: '#FF0',
              duration: 1500,
              name: '昌平区',
            },
            {
              position: [116.33, 39.73], // 大兴区政府驻地坐标
              color: '#808000',
              duration: 1500,
              name: '大兴区',
            },
            {
              position: [116.62, 40.32], // 怀柔区政府驻地坐标
              color: '#800000',
              duration: 1500,
              name: '怀柔区',
            },
            {
              position: [117.10, 40.13], // 平谷区政府驻地坐标
              color: '#008080',
              duration: 1500,
              name: '平谷区',
            },
            {
              position: [116.85, 40.37], // 密云区政府驻地坐标
              color: '#000080',
              duration: 1500,
              name: '密云区',
            },
            {
              position: [115.97, 40.47], // 延庆区政府驻地坐标
              color: '#C0C0C0',
              duration: 1500,
              name: '延庆区',
            }
          ],
          start: 1000,
          end: 300000,
        },
      },
    ];

    for (let i = 0; i < data.length; i++) {
      const { cameraFly, pois } = data[i];
      const { start, end, fly } = cameraFly;
      const { start: s, end: e } = fly;

      // 相机加入关键帧
      const flyTrack = new AnimationTrack(cameraTarget, {
        interpolationFn: cameraFlyInterpolate,
      });
      flyTrack.addKeyframe(start, s);
      flyTrack.addKeyframe(end, e);
      aniCtr.addTrack(flyTrack);

      // 处理文字的关键帧
      const { positions, start: cStart, end: cEnd } = pois;
      positions.forEach((p, index) => {
        const { position, name, color } = p;

        const textStyle = {
            fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', // 使用现代感的字体
            fontSize: 16, // 设置较大的字体大小
            color: color, // 设置颜色
            opacity: 0,
            textAlign: 'center', // 文字居中对齐
            fontWeight: '300', // 设置粗体
            fontStyle: 'normal', // 设置斜体
            backgroundColor: 'rgba(0, 0, 0, 0)', 
            borderColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 1,
            lineHeight: 1.5, // 设置合理的行高
            underline: false, // 添加下划线效果
            // shadow: { color: 'rgba(249, 58, 15, 0.4)', offsetX: 4, offsetY: 4, blur: 1 }// 设置轻微的阴影效果
          }
        // 创建文字
        const textEntity = new TextEntity(position, { text: name, textStyle, animationType: TextAnimationType.FADE})

        // 给文字添加动画
        const textTarget = new TextAnimationTarget(textEntity.entity);
        viewer.entities.add(textEntity.entity);
        const tagTrack = new AnimationTrack(textTarget);
        console.log('帧开始时间', cStart + index * 1000);
        console.log('帧结束时间', cStart + index * 1000 + 1000);
        tagTrack.addKeyframe(cStart, 0);
        tagTrack.addKeyframe(cStart + 1000, 1);
        aniCtr.addTrack(tagTrack);
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

export default TextKeyframe;

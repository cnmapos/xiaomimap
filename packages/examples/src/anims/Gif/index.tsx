/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react';
import MapContainer from '../../components/map-container';
import {
  CallbackProperty,
  Cartesian2,
  Cartesian3,
  CircleEmitter,
  Math as CMath,
  Color,
  HorizontalOrigin,
  Matrix4,
  ParticleBurst,
  ParticleSystem,
  SphereEmitter,
  VerticalOrigin,
  Viewer,
} from 'cesium';
import { HZViewer } from '@hztx/core';
import { Button, ColorPicker, Input, InputNumber, Radio } from 'antd';
import SuperGif from 'libgif';

const Gif = () => {
  useEffect(() => {
    const hz = new HZViewer('map');
    const { viewer }: { viewer: Viewer } = hz;

    const coordinate = [104.167869626642999, 30.758956896017201];

    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(...coordinate, 2990),
    });

    // 加载GIF文件并解析
    const gifUrl = 'assets/gifs/star.gif'; // 替换为你的GIF文件路径
    const gifDiv = document.createElement('div');
    const gifImg = document.createElement('img');

    // gif库需要img标签配置下面两个属性
    gifImg.setAttribute('rel:animated_src', gifUrl);
    gifImg.setAttribute('rel:auto_play', '1'); // 设置自动播放属性
    gifDiv.appendChild(gifImg);

    // 使用libgif.js解析GIF
    const superGif = new SuperGif({
      gif: gifImg,
    });
    superGif.load(function () {
      for (let i = 0; i < 10; i++) {
        viewer.entities.add({
          position: Cartesian3.fromDegrees(
            coordinate[0] + i * 0.009,
            coordinate[1],
            0
          ),
          billboard: {
            image: new CallbackProperty(() => {
              // 转成base64,直接加canvas理论上是可以的，这里设置有问题
              return superGif.get_canvas().toDataURL();
            }, false),
            width: 300,
            height: 300,
            scale: 0.5,
            verticalOrigin: VerticalOrigin.BOTTOM,
            horizontalOrigin: HorizontalOrigin.LEFT,
          },
        });
      }
    });
    return () => {
      viewer.destroy();
    };
  }, []);

  const play = () => {};

  const pause = () => {};

  const replay = () => {};

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
};

export default Gif;

/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react';
import MapContainer from '../../components/map-container';
import {
  CallbackProperty,
  Cartesian2,
  Cartesian3,
  Math as CMath,
  Color,
  HorizontalOrigin,
  Property,
  VerticalOrigin,
  Viewer,
} from 'cesium';
import { HZViewer } from '@hztx/core';
import { Button, ColorPicker, Input, InputNumber, Radio } from 'antd';
import { IPlayer } from '../../types';
import { pixel2Coordinates } from '../../utils';
import { TagsPlayer } from './Player';

const Tags = () => {
  const [align, setAlign] = useState<string>('top');
  const [title, setTitle] = useState<string | undefined>('我是大航母');
  const [offestX, setOffestX] = useState<number>(50);
  const [offestY, setOffestY] = useState<number>(-50);
  const [imageUrl, setImageUrl] = useState<string>('assets/hangmu.png');
  const [color, setColor] = useState<string>('#ffffff');
  let viewer: any;

  useEffect(() => {
    const hz = new HZViewer('map');
    viewer = hz.viewer;

    const coordinate = [104.167869626642999, 30.758956896017201];

    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(
        ...[104.167869626642999, 30.758956896017201],
        2990000
      ),
    });

    setTimeout(() => {
      player = new TagsPlayer(viewer, coordinate, {
        imageUrl,
        offset: { x: offestX, y: offestY },
        align: align,
        title: title,
        color: color,
        fontColor: color,
      });
    }, 3000);

    return () => {
      viewer.destroy();
    };
  }, [align, title, offestX, offestY, color]);

  let capturer, removeEvent;
  const play = async () => {
    capturer = new CCapture({ format: 'webm', framerate: 30 });

    capturer.start();

    removeEvent = viewer.scene.postRender.addEventListener(function () {
      capturer.capture(viewer.scene.canvas);
    });
  };

  const pause = () => {
    removeEvent?.();
    capturer.stop();

    window.open(capturer.save());

    capturer = undefined;
  };
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
        <div className="hz-style">
          <div className="hz-style-item">
            <span>垂直对齐</span>
            <Radio.Group
              onChange={(e) => setAlign(e.target.value)}
              value={align}
            >
              <Radio value={'top'}>TOP</Radio>
              <Radio value={'bottom'}>BOTTOM</Radio>
            </Radio.Group>
          </div>
          <div className="hz-style-item">
            <Input
              addonBefore="图片地址"
              defaultValue={imageUrl}
              onChange={(e) => setImageUrl(e)}
            />
          </div>
          <div className="hz-style-item">
            <Input
              addonBefore="标题"
              defaultValue={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="hz-style-item">
            <InputNumber
              addonBefore="OffsetX"
              defaultValue={offestX}
              onChange={(e) => setOffestX(e)}
            />
          </div>
          <div className="hz-style-item">
            <InputNumber
              addonBefore="OffsetY"
              defaultValue={offestY}
              onChange={(e) => setOffestY(e)}
            />
          </div>
          <div className="hz-style-item">
            <span>颜色：</span>
            <ColorPicker
              showText
              defaultValue={color}
              onChange={(e) => setColor(`#${e.toHex()}`)}
            />
          </div>
        </div>
      </div>
    </MapContainer>
  );
};

export default Tags;

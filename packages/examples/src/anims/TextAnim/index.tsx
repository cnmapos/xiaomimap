import { HZViewer } from '@hztx/core';
import { useEffect, useState } from 'react';
import MapContainer from '../../components/map-container';
import { TextAnimPlayer } from './Player';
import { TextAnimation } from './Player2';
import { Button, ColorPicker, Input, InputNumber, Select } from 'antd';
import { IPlayer } from '../../types';

// 文本的特效、最终还是用 billboard 实现吧，因为我们想要做文本的 旋转、但是 label 自身是没法旋转的，cesium并不支持。所以我们可以用动态创建文本图片的方式去模拟文本，还能借用billboard的旋转实现旋转效果。
function TextAnim() {
  let player: IPlayer;

  const [color, setColor] = useState('yellow');
  const [text, setText] = useState('慧泽图行');
  const [inType, setInType] = useState('fadeIn');
  const [outType, setOutType] = useState('fadeOut');
  let viewer: any;

  useEffect(() => {
    const hz = new HZViewer('map');
    viewer = hz.viewer;

    // 创建文字动画对象
    player = new TextAnimation(viewer, [39.9522222, -75.1641667], {
      text: text,
      color: color,
      animationIn: inType, // 入场动画
      animationOut: outType, // 出场动画
    });

    return () => {
      viewer.destroy();
      player.destroy();
    };
  }, [text, color, inType, outType]);

  const playIn = () => {
    player.playIn();
  };

  const playOut = () => {
    player.playOut();
  };

  const handleChangeIn = (v) => {
    setInType(v);
  };

  const handleChangeOut = (v) => {
    setOutType(v);
  };

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

  return (
    <MapContainer>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
        id="map"
      ></div>
      <div style={{ color: '#fff' }}>
        <div className="hz-player">
          <Button className="hz-btn" onClick={playIn}>
            入场
          </Button>
          <Button className="hz-btn" onClick={playOut}>
            出场
          </Button>
          <Button className="hz-btn" onClick={play}>
            播放
          </Button>
          <Button className="hz-btn" onClick={pause}>
            暂停
          </Button>
        </div>
        <div className="hz-style">
          <div className="hz-style-item">
            <label>文字</label>
            <Input value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div className="hz-style-item">
            <label>字体颜色</label>
            <ColorPicker
              showText
              defaultValue={color}
              onChange={(e) => setColor(`#${e.toHex()}`)}
            />
          </div>
          <div className="hz-style-item">
            <label>入场动画</label>
            <Select
              defaultValue="fadeIn"
              style={{ width: 120 }}
              onChange={handleChangeIn}
              options={[
                { value: 'fadeIn', label: 'fadeIn' },
                { value: 'flyIn', label: 'flyIn' },
                { value: 'rotateIn', label: 'rotateIn' },
              ]}
            />
          </div>
          <div className="hz-style-item">
            <label>出场动画</label>
            <Select
              defaultValue="fadeOut"
              style={{ width: 120 }}
              onChange={handleChangeOut}
              options={[
                { value: 'fadeOut', label: 'fadeOut' },
                { value: 'flyOut', label: 'flyOut' },
                { value: 'rotateOut', label: 'rotateOut' },
              ]}
            />
          </div>
        </div>
      </div>
    </MapContainer>
  );
}

export default TextAnim;

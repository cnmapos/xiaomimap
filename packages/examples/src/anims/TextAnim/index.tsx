import { HZViewer } from '@hztx/core';
import { useEffect, useState } from 'react';
import MapContainer from '../../components/map-container';
import { Button, ColorPicker, Input, InputNumber, Select, Slider, Switch } from 'antd';
import { IPlayer } from '../../types';
import { TextAnimation, TextAnimPlayer } from './Player3';

import {
  Cartesian3,
} from 'cesium';

// 文本的特效、最终还是用 billboard 实现吧，因为我们想要做文本的 旋转、但是 label 自身是没法旋转的，cesium并不支持。所以我们可以用动态创建文本图片的方式去模拟文本，还能借用billboard的旋转实现旋转效果。
function TextAnim() {
  let player: IPlayer;

  const [color, setColor] = useState('#4A90E2');
  const [backgroundColor, setBackgroundColor] = useState('rgba(0, 0, 0, 0)');
  const [borderColor, setBorderColor] = useState('rgba(0, 0, 0, 0)');
  const [borderWidth, setborderWidth] = useState(1);
  const [text, setText] = useState('慧泽图行');
  const [fontSize, setFontSize] = useState(40);
  const [fontWeight, setFontWeight] = useState(900);
  const [fontStyle, setFontStyle] = useState('normal');
  const [underline, setUnderline] = useState(false);
  const [shadow, setShadow] = useState({ color: 'rgba(249, 58, 15, 0.4)', offsetX: 4, offsetY: 4, blur: 2 });

  const [inType, setInType] = useState(TextAnimation.FADEIN);
  const [outType, setOutType] = useState(TextAnimation.FADEOUT);
  const [duration, setDuration] = useState(1000);

  let viewer: any;

  useEffect(() => {
    const hz = new HZViewer('map');
    viewer = hz.viewer;

    // 定义光晕的中心点坐标
    const center = Cartesian3.fromDegrees(-75.0, 40.0, 100);
    viewer.camera.setView({
      destination: center,
    });

    // 示例用法
    const styleOptions = {
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', // 使用现代感的字体
      fontSize, // 设置较大的字体大小
      color: color, // 设置优雅的蓝色
      textAlign: 'center', // 文字居中对齐
      fontWeight, // 设置粗体
      fontStyle, // 设置斜体
      backgroundColor, 
      borderColor,
      borderWidth,
      lineHeight: 1.5, // 设置合理的行高
      underline, // 添加下划线效果
      shadow// 设置轻微的阴影效果
    };
    player = new TextAnimPlayer(viewer, [-75.0, 40.0], {
      text,
      textStyle: styleOptions,
      inType: {
        animationType: inType,
        from: 0,
        to: 1,
        duration: duration,
      },
      outType: {
        animationType: outType,
        from: 1,
        to: 0,
        duration: duration,
      },
    })
    return () => {
      player.destroy();
      viewer.destroy();
    };
  }, [text, color, backgroundColor, fontSize, fontWeight, fontStyle, underline, shadow, borderColor, borderWidth, inType, outType, duration]);

  const playIn = () => {
    player?.playIn && player.playIn();
  };

  const playOut = () => {
    player?.playOut && player.playOut();
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
      <div>
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
            <label>背景颜色</label>
            <ColorPicker
              showText
              defaultFormat={'rgb'}
              format={'rgb'}
              defaultValue={backgroundColor}
              onChange={(e) => setBackgroundColor(e.toRgbString())}
            />
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
            <label>文字大小</label>
            <InputNumber value={fontSize} onChange={(v) => v && setFontSize(v)} />
          </div>
          <div className="hz-style-item">
            <label>文字粗细</label>
            <InputNumber value={fontWeight} onChange={(v) => v && setFontWeight(v)} />
          </div>
          <div className="hz-style-item">
            <label>字体样式</label>
            <Select
              value={fontStyle}
              style={{ width: 120 }}
              onChange={(v) => setFontStyle(v)}
              options={[
                { value: 'normal', label: '正常' },
                { value: 'italic', label: '斜体' },
              ]}
            />
          </div>
          <div className="hz-style-item">
            <label>下划线</label>
            <Switch checked={underline} onChange={(v) => setUnderline(v)} />
          </div>
          <div className="hz-style-item">
            <label>阴影颜色</label>
            <ColorPicker
              defaultFormat={'rgb'}
              format={'rgb'}
              showText
              defaultValue={shadow.color}
              onChange={(v) => setShadow({ ...shadow, color: v.toRgbString() })}
            />
          </div>
          <div className="hz-style-item">
            <label>阴影模糊程度</label>
            <InputNumber value={shadow.blur} onChange={(v) => v && setShadow({ ...shadow, blur: v })} />
            {/* <Slider defaultValue={shadow.blur} onChange={(v) => setShadow({ ...shadow, blur: v })} /> */}
          </div>
          <div className="hz-style-item">
            <label>阴影水平偏移</label>
            <InputNumber value={shadow.offsetX} onChange={(v) => v && setShadow({ ...shadow, offsetX: v })} />
            {/* <Slider defaultValue={shadow.offsetX} onChange={(v) => setShadow({ ...shadow, offsetX: v })} /> */}
          </div>
          <div className="hz-style-item">
            <label>阴影垂直偏移</label>
            <InputNumber value={shadow.offsetY} onChange={(v) => v && setShadow({ ...shadow, offsetY: v })} />
            {/* <Slider defaultValue={shadow.offsetY} onChange={(v) => setShadow({ ...shadow, offsetY: v })} /> */}
          </div>

          <div className="hz-style-item">
            <label>边框颜色</label>
            <ColorPicker
              showText
              defaultFormat={'rgb'}
              format={'rgb'}
              defaultValue={borderColor}
              onChange={(e) => setBorderColor(e.toRgbString())}
            />
          </div>
          <div className="hz-style-item">
            <label>边框大小</label>
            <InputNumber value={borderWidth} onChange={(v) => v !== null && setborderWidth(v)} />
          </div>


          <div className="hz-style-item">
            <label>动画时长</label>
            <InputNumber value={duration} onChange={(v) => v && setDuration(v)} />
          </div>
          <div className="hz-style-item">
            <label>入场动画</label>
            <Select
              defaultValue="fadeIn"
              style={{ width: 120 }}
              onChange={handleChangeIn}
              options={[
                { value: TextAnimation.FADEIN, label: TextAnimation.FADEIN },
                // { value: 'rotateIn', label: 'rotateIn' },
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
                { value: TextAnimation.FADEOUT, label: TextAnimation.FADEOUT },
                // { value: 'rotateOut', label: 'rotateOut' },
              ]}
            />
          </div>
        </div>
      </div>
    </MapContainer>
  );
}

export default TextAnim;

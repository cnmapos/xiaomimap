import { useContext, useEffect, useRef, useState } from 'react';
import MapContainer from '../../components/map-container';
import {
  CallbackProperty,
  Cartesian3,
  Math as CMath,
  Cartographic,
  Color,
  PolylineArrowMaterialProperty,
  Cartesian2,
  Viewer,
  defined,
  PolygonGraphics,
  Material,
  MaterialAppearance,
  PolygonGeometry,
  GeometryInstance,
  Primitive,
  Matrix4,
} from 'cesium';
import { HZViewer } from '@hztx/core';
import { Button, ColorPicker, InputNumber, Select, Switch } from 'antd';
import chinaJSON from '../../assets/china.json';
import { IPlayer } from '../../types';
import { PolygonPlayer } from './PolygonPlayer';
import html2canvas from 'html2canvas';
// import 'whammy';
// import { WhammyRecorder } from 'recordrtc';
// import 'ccapture.js';
// import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

async function getScreenStream() {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: {
      width: { ideal: 1920 }, // 设置分辨率
      height: { ideal: 1080 },
    },
    audio: false, // 是否录制音频
  });
  return stream;
}

const Video = () => {
  const [color, setColor] = useState('#24BF7C');
  const [showOutline, setShowOutline] = useState(false);
  const [outlineColor, setOutlineColor] = useState('#FFF');
  const [direction, setLineType] = useState(0);
  const [outlineWidth, setOutlineWidth] = useState(2);
  const currentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const context = useRef({ recorder: null, images: [] });

  let player1: IPlayer;
  let player2: IPlayer;
  let viewer;

  // const ffmpeg = createFFmpeg({ log: true });
  // ffmpeg.load();
  useEffect(() => {
    const hz = new HZViewer('map');
    viewer = hz.viewer;

    const [positions1] =
      chinaJSON.features.find((f) => f.properties.name === '四川')?.geometry
        .coordinates[0] || [];
    const [positions2] =
      chinaJSON.features.find((f) => f.properties.name === '重庆')?.geometry
        .coordinates[0] || [];
    const [positions3] =
      chinaJSON.features.find((f) => f.properties.name === '陕西')?.geometry
        .coordinates[0] || [];
    const [positions4] =
      chinaJSON.features.find((f) => f.properties.name === '甘肃')?.geometry
        .coordinates[0] || [];
    const [positions5] =
      chinaJSON.features.find((f) => f.properties.name === '湖北')?.geometry
        .coordinates[0] || [];
    const [positions6] =
      chinaJSON.features.find((f) => f.properties.name === '湖南')?.geometry
        .coordinates[0] || [];

    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(...positions1[0], 2990000),
    });
    player1 = new PolygonPlayer(viewer, positions1, {
      color,
      direction,
      outlineWidth,
      showOutline,
      outlineColor,
    });
    player2 = new PolygonPlayer(viewer, positions2, {
      color: '#432304',
      direction: 1,
      outlineWidth,
      showOutline,
      outlineColor,
    });
    new PolygonPlayer(viewer, positions3, {
      color: '#dd0022',
      direction: 2,
      outlineWidth,
      showOutline,
      outlineColor,
    });
    new PolygonPlayer(viewer, positions4, {
      color: '#350673',
      direction: 3,
      outlineWidth,
      showOutline,
      outlineColor,
    });
    new PolygonPlayer(viewer, positions5, {
      color: '#005533',
      direction: 1,
      outlineWidth,
      showOutline,
      outlineColor,
    });
    new PolygonPlayer(viewer, positions6, {
      color: '#aa00aa',
      direction: 2,
      outlineWidth,
      showOutline,
      outlineColor,
    });

    return () => {
      viewer.destroy();
    };
  }, [
    currentRef.current,
    color,
    outlineColor,
    showOutline,
    outlineWidth,
    direction,
  ]);

  let capturer, removeEvent;
  const play = async () => {
    capturer = new CCapture({ format: 'webm', framerate: 30 });

    capturer.start();

    removeEvent = viewer.scene.postRender.addEventListener(function () {
      capturer.capture(viewer.scene.canvas);
    });
  };

  const stop = () => {
    removeEvent?.();
    capturer.stop();

    window.open(capturer.save());

    capturer = undefined;
  };

  const replay = () => {};

  return (
    <MapContainer>
      <div
        ref={currentRef}
        style={{ width: '100%', height: '100%' }}
        id="map"
      ></div>
      <div>
        <div className="hz-player">
          <Button className="hz-btn" onClick={play}>
            播放
          </Button>
          <Button className="hz-btn" onClick={stop}>
            停止
          </Button>
          <Button className="hz-btn" onClick={replay}>
            重新播放
          </Button>
        </div>
        <div className="hz-style">
          <video
            type="video/webm"
            width={300}
            height={300}
            style={{ background: '#000' }}
            ref={videoRef}
          ></video>
        </div>
      </div>
    </MapContainer>
  );
};

export default Video;

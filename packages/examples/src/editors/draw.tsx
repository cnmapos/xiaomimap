import {
  AnimationController,
  AnimationTrack,
  CameraAnimationTarget,
  cameraFlyInterpolate,
} from '@hztx/animations';
import { EditorManager, createViewer, IViewer } from '@hztx/core';
import React, { useEffect, useRef } from 'react';
import MapContainer from '../components/map-container';
import { Button } from 'antd';

function Editor() {
  const aniCtr = new AnimationController();
  const context = useRef<{ viewer: IViewer }>({
    viewer: null,
  });
  useEffect(() => {
    context.current.viewer = createViewer('map', {
      key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YjliYjIwYi0zMWE0LTQ4MTgtYWU4NC0wNWZmNTFmZjVhYmMiLCJpZCI6MjY1NzYxLCJpYXQiOjE3MzU1NzA3MTl9.BOJDK-WqsLV-QcQhbnAEf-wG1mtkftG1BYV6JIv0VoI',
    });

    return () => {
      context.current.viewer?.destroy();
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

  function addPoint() {
    const manager = new EditorManager(context.current.viewer);
    manager.startCreate('point', {}, (coordinates) => {
      console.log('point', coordinates);
    });
  }

  function addLine() {
    const manager = new EditorManager(context.current.viewer);
    manager.startCreate('line', {}, (coordinates) => {
      console.log('draw line', coordinates);
    });
  }

  function addPolygon() {
    const manager = new EditorManager(context.current.viewer);
    manager.startCreate('polygon', {}, (coordinates) => {
      console.log('draw polygon', coordinates);
    });
  }

  return (
    <MapContainer>
      <div style={{ width: '100%', height: '100%' }} id="map"></div>
      <div>
        <div className="hz-player">
          <div>
            <Button className="hz-btn" onClick={addPoint}>
              添加点
            </Button>
            <Button className="hz-btn" onClick={addLine}>
              添加线
            </Button>
            <Button className="hz-btn" onClick={addPolygon}>
              添加面
            </Button>
          </div>
        </div>
        <div className="hz-style"></div>
      </div>
    </MapContainer>
  );
}

export default Editor;

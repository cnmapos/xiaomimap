/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  AnimationController2,
  AnimationTrack2,
  PathAnimationTarget,
} from '@hztx/animations';

import {
  Cartesian3,
  Coordinate,
  createViewer,
  IViewer,
  LineEntity,
  ModelEntity,
  smoothLine,
} from '@hztx/core';
import React, { useEffect, useRef } from 'react';
import MapContainer from '../../../components/map-container';
import { Button } from 'antd';

function GasW2TELine1() {
  const context = useRef<{ viewer: IViewer }>({
    viewer: null,
  });
  const aniCtr = useRef<AnimationController2>();
  useEffect(() => {
    context.current.viewer = createViewer('map', {
      key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YjliYjIwYi0zMWE0LTQ4MTgtYWU4NC0wNWZmNTFmZjVhYmMiLCJpZCI6MjY1NzYxLCJpYXQiOjE3MzU1NzA3MTl9.BOJDK-WqsLV-QcQhbnAEf-wG1mtkftG1BYV6JIv0VoI',
    });

    aniCtr.current = new AnimationController2([]);

    init();

    return () => {
      context.current.viewer?.destroy();
    };
  }, []);

  // 初始化
  const init = () => {
    if (aniCtr.current) {
      const track = new AnimationTrack2(context.current.viewer, []);
      aniCtr.current.addTrack(track);

      // 创建基础线实体
      const lineEty = new LineEntity({ positions: positions });
      context.current.viewer.addEntity(lineEty);

      //  ----->
      // [   start,     start + startDelay,   start + startDelay + duration,    end ]
      //   插入viewer        开始动画                       执行动画               移除

      // 创建轨迹动画对象
      const pathAnimationTarget = new PathAnimationTarget({
        baseEntity: lineEty,
        isShowBaseEntity: true,
        start: 0,
        end: 15 * 1000,
        startDelay: 2000,
        endStay: 3000,

        startValue: positions[0],
        endValue: positions[positions.length - 1],

        tracked: true,

        camera: {
          distance: 307953,
        },

        model: {
          uri: 'assets/models/people_run_2.glb', // 替换为实际模型路径
          scale: 15000,
          positions: positions[0],
          heading: -Math.PI / 2,
        },
        onBefore: () => {
          console.log('onBefore执行');
          console.time('动画时长统计');
        },
        onAfter: () => {
          console.log('onAfter执行');
          console.timeEnd('动画时长统计');
        },
      });
      pathAnimationTarget.setStyle({
        width: 3,
        color: '#ff0000',
        outlineWidth: 1,
        outlineColor: '#00ff00',
      });
      // 新增动画对象到图层里
      track.add(pathAnimationTarget);
    }
  };

  function play() {
    aniCtr.current && aniCtr.current.play();
  }

  function pause() {
    aniCtr.current && aniCtr.current.pause();
  }

  function replay() {
    aniCtr.current && aniCtr.current.reset();
    play();
  }

  return (
    <MapContainer>
      <div style={{ width: '100%', height: '100%' }} id="map"></div>
      <div>
        <div className="hz-player">
          <div>
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
        </div>
        <div className="hz-style"></div>
      </div>
    </MapContainer>
  );
}

export default GasW2TELine1;

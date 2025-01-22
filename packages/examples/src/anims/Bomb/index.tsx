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
  Matrix4,
  ParticleBurst,
  ParticleSystem,
  SphereEmitter,
  Viewer,
} from 'cesium';
import { HZViewer } from '@hztx/core';
import { Button, ColorPicker, Input, InputNumber, Radio } from 'antd';

const Bomb = () => {
  let viewer: any;
  useEffect(() => {
    const hz = new HZViewer('map');
    viewer = hz.viewer;

    const coordinate = [104.167869626642999, 30.758956896017201];

    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(...coordinate, 2990),
    });

    const entity = viewer.entities.add({
      position: Cartesian3.fromDegrees(...coordinate),
    });

    function computeModelMatrix(entity, time) {
      return entity.computeModelMatrix(time, new Matrix4());
    }

    const viewModel = {
      emissionRate: 10.0,
      gravity: 0.0,
      minimumParticleLife: 1.2,
      maximumParticleLife: 1.2,
      minimumSpeed: 1.0,
      maximumSpeed: 4.0,
      startScale: 0.1,
      endScale: 5.0,
      particleSize: 25.0,
    };

    const particleList: any[] = [];
    const points: Cartesian3[] = [];

    for (let i = 0; i < 1; i++) {
      for (let j = 0; j < 1; j++) {
        const particleSystem = viewer.scene.primitives.add(
          new ParticleSystem({
            image: 'assets/models/bomb4.png',

            startColor: Color.RED.withAlpha(0.7),
            endColor: Color.WHITE.withAlpha(0.0),

            startScale: viewModel.startScale,
            endScale: viewModel.endScale,

            minimumParticleLife: viewModel.minimumParticleLife,
            maximumParticleLife: viewModel.maximumParticleLife,

            minimumSpeed: viewModel.minimumSpeed,
            maximumSpeed: viewModel.maximumSpeed,

            imageSize: new Cartesian2(
              viewModel.particleSize,
              viewModel.particleSize
            ),

            emissionRate: viewModel.emissionRate,

            bursts: [
              // these burst will occasionally sync to create a multicolored effect
              new ParticleBurst({
                time: 5.0,
                minimum: 10,
                maximum: 100,
              }),
              new ParticleBurst({
                time: 10.0,
                minimum: 50,
                maximum: 100,
              }),
              new ParticleBurst({
                time: 15.0,
                minimum: 200,
                maximum: 300,
              }),
            ],

            lifetime: 14 + 2 * Math.random(),

            emitter: new CircleEmitter(2.0),

            //updateCallback: applyGravity,
          })
        );
        particleList.push(particleSystem);
        points.push(
          Cartesian3.fromDegrees(...[coordinate[0], coordinate[1]], 0)
        );
      }
    }

    viewer.scene.preUpdate.addEventListener(function (scene, time) {
      // particleSystem.modelMatrix = computeModelMatrix(entity, time);
      for (let i = 0; i < points.length; i++) {
        particleList[i].modelMatrix = Matrix4.fromTranslation(points[i]);
      }
    });

    // viewer.trackedEntity = entity;

    return () => {
      viewer.destroy();
    };
  }, []);

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
        <div className="hz-style"></div>
      </div>
    </MapContainer>
  );
};

export default Bomb;

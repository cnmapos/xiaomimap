import { HZViewer } from '@hztx/core';
import { useEffect, useState } from 'react';
import MapContainer from '../../components/map-container';
import { TextAnimPlayer } from './Player';
import { TextAnimation } from './Player2';
import { Button, ColorPicker, Input, InputNumber, Select } from 'antd';
import { IPlayer } from '../../types';

import { CallbackProperty, Math as CesiumMath, Cartesian3, Color, GeometryInstance, ImageMaterialProperty, JulianDate, LabelStyle, Material, MaterialAppearance, Primitive, Rectangle, RectangleGeometry, Texture, Cartesian2, ClockRange, CustomShader, UniformType, getTimestamp, Model, Cesium3DTileset, ColorGeometryInstanceAttribute, VertexFormat, Appearance, PerInstanceColorAppearance, EllipsoidSurfaceAppearance } from 'cesium';

// 文本的特效、最终还是用 billboard 实现吧，因为我们想要做文本的 旋转、但是 label 自身是没法旋转的，cesium并不支持。所以我们可以用动态创建文本图片的方式去模拟文本，还能借用billboard的旋转实现旋转效果。
function TextAnim() {
  let player: IPlayer;

  const [color, setColor] = useState('yellow');
  const [text, setText] = useState('慧泽图行');
  const [inType, setInType] = useState('fadeIn');
  const [outType, setOutType] = useState('fadeOut');
  let viewer: any;

  // useEffect(() => {
  //   const hz = new HZViewer('map')
  //   const { viewer } = hz

  //   // 创建文字动画对象
  //   player = new TextAnimation(viewer, [39.9522222, -75.1641667], {
  //     text: text,
  //     color: color,
  //     animationIn: inType, // 入场动画
  //     animationOut: outType, // 出场动画
  //   });

  //   return () => {
  //     viewer.destroy();
  //     player.destroy();
  //   }
  // }, [text, color, inType, outType])

  const canvasTextAni = (viewer) => {

    // 创建动态 Canvas
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");

    // 实时更新 Canvas 内容（旋转文字）
    let rotation = 0;
    function updateCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rotation);
      ctx.fillStyle = "white";
      ctx.font = "40px sans-serif";
      ctx.fillText("Rotating Text", -70, 5);
      ctx.restore();
      rotation += 0.05;
      requestAnimationFrame(updateCanvas);
    }
    updateCanvas();

    // 创建 Billboard 实体
    const billboard = viewer.entities.add({
      position: Cartesian3.fromDegrees(-75.1641667, 39.9522222),
      billboard: {
        image: new CallbackProperty(() => canvas.toDataURL(), false), // 动态更新纹理
        scale: 0.5,
        width: canvas.width,
        height: canvas.height,
      },
    });
  }

  const cesiumTextAni = (viewer) => {

    const canvas = document.createElement('canvas');
    canvas.width = 256; // 设置图片宽度
    canvas.height = 256; // 设置图片高度
    const ctx = canvas.getContext('2d');

    // 绘制矩形
    ctx.fillStyle = '#FF0000'; // 红色
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制文本
    ctx.font = '30px Arial';
    ctx.fillStyle = '#FFFFFF'; // 白色文字
    ctx.fillText('矩形中心', 40, 128); // 文本位置

    // 简单的 GLSL 着色器代码
    const shaderSource = `
      uniform sampler2D image;
      uniform float time;

      czm_material czm_getMaterial(czm_materialInput materialInput) {
          vec2 st = materialInput.st;
          st.x = fract(st.x + time * 0.1);
          vec4 color = texture(image, st);

          czm_material material;
          material.diffuse = color.rgb;
          material.alpha = color.a;
          return material;
      }
    `;

    // 创建材质
    const material = new Material({
      fabric: {
          uniforms: {
              image: canvas, // 替换为实际的纹理图片路径
              time: 0.0 // 动画时间，初始为 0
          },
          source: shaderSource,
      },
    });

    // 创建矩形几何体和 Primitive
    const rectangle = Rectangle.fromDegrees(-75.0, 40.0, -74.0, 41.0);
    const rectanglePrimitive = new Primitive({
      geometryInstances: new GeometryInstance({
          geometry: new RectangleGeometry({
              rectangle: rectangle,
              vertexFormat: MaterialAppearance.VERTEX_FORMAT,
          }),
      }),
      appearance: new MaterialAppearance({
          material: material,
          translucent: true, // 允许透明
      }),
    });

    // 添加到 Cesium 场景
    viewer.scene.primitives.add(rectanglePrimitive);

    let startTime = Date.now();
    viewer.scene.preRender.addEventListener(function () {
        const elapsed = (Date.now() - startTime) / 1000.0; // 计算动画经过的时间（秒）
        material.uniforms.time = elapsed; // 更新材质时间
    });

  }

  useEffect(() => {
    const hz = new HZViewer('map');
    viewer = hz.viewer;

    cesiumTextAni(viewer);

    return () => {
      viewer.destroy();
    }
  }, [text, color, inType, outType])

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

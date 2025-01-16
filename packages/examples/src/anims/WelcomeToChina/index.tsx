/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react';
import MapContainer from '../../components/map-container';
import {
  CallbackProperty,
  Cartesian2,
  Cartesian3,
  Math as CMath,
  Color,
  GeoJsonDataSource,
  HorizontalOrigin,
  Property,
  UrlTemplateImageryProvider,
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
  const [title, setTitle] = useState<string | undefined>('He Hua');
  const [offestX, setOffestX] = useState<number>(50);
  const [offestY, setOffestY] = useState<number>(-50);
  const [imageUrl, setImageUrl] = useState<string>('assets/hangmu.png');
  const [color, setColor] = useState<string>(Color.WHITE.toCssColorString());

  useEffect(() => {
    const hz = new HZViewer('map');
    const { viewer }: { viewer: Viewer } = hz;

    const chinaTiles = new UrlTemplateImageryProvider({
      url: 'https://tiles2.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=fa74f216c7265ac713a224dcd0a4d0f20e27b61051ed729b587111b4c410528b', // 替换为中国行政区级别瓦片的URL
    });
    viewer.imageryLayers.addImageryProvider(chinaTiles);
    const topoTiles = new UrlTemplateImageryProvider({
      url: 'https://tiles1.geovisearth.com/base/v1/cia/{z}/{x}/{y}?format=webp&tmsIds=w&token=fa74f216c7265ac713a224dcd0a4d0f20e27b61051ed729b587111b4c410528b', // 替换为中国行政区级别瓦片的URL
    });
    viewer.imageryLayers.addImageryProvider(topoTiles);

    const topCities = ['四川'];
    GeoJsonDataSource.load('/assets/geo/china.json').then((dataSource) => {
      // viewer.dataSources.add(dataSource);
      //Get the array of entities
      const entities = dataSource.entities.values;

      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i]!;
        if (entity.polygon) {
          entity.polygon.material = Color.ORANGERED.withAlpha(0.4);
          //Remove the outlines.
          entity.polygon.outline = true;
          entity.polygon.outlineColor = Color.ORANGE;
          if (topCities.includes(entity.properties.name.getValue())) {
            entity.polygon.extrudedHeight = 1;
            entity.polygon.material = Color.ORANGE.withAlpha(1);
          } else {
          }
        }
      }
    });

    const coordinate = [104.167869626642999, 30.758956896017201];

    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(
        ...[104.167869626642999, 30.758956896017201],
        3990000
      ),
    });
    let player: IPlayer;
    const size = 250;

    const fileCount = 12;
    const radius = 100;
    const angleUnit = CMath.toRadians(360 / (fileCount * 2));
    let angle = 0;

    setTimeout(() => {
      const basePath = ['assets/welcome/h/', 'assets/welcome/w/'];
      const aligns = ['top', 'bottom'];
      let time = 0;
      for (let i = 0; i < fileCount; i++) {
        for (let j = 0; j < 2; j++) {
          const currentTime = time;
          setTimeout(() => {
            const isBottom = Math.ceil(Math.random() * 10) % 2 ? 1 : 0;
            new TagsPlayer(viewer, coordinate, {
              imageUrl: basePath[j] + `panda${i + 1}.png`,
              offset: {
                x: 100 - Math.random() * 200,
                y: isBottom ? -Math.random() * 100 : -Math.random() * 100,
              },
              align: aligns[isBottom],
              title: title,
              color: color,
              fontColor: color,
              imageWidth: j ? size : (size * 9) / 12,
              imageHeight: !j ? size : (size * 9) / 12,
              zIndex: currentTime,
            });
          }, time);
          time += 1500;
          angle += angleUnit;
        }
      }

      // player = new TagsPlayer(viewer, coordinate, {
      //   imageUrl: 'assets/welcome/panda1-h.png',
      //   offset: { x: -90, y: -15 },
      //   align: 'top',
      //   title: title,
      //   color: color,
      //   fontColor: color,
      //   imageWidth: (size * 9) / 12,
      //   imageHeight: size,
      // });
      // player = new TagsPlayer(viewer, coordinate, {
      //   imageUrl: 'assets/welcome/panda2-h.png',
      //   offset: { x: 90, y: -15 },
      //   align: 'top',
      //   title: title,
      //   color: color,
      //   fontColor: color,
      //   imageWidth: (size * 9) / 12,
      //   imageHeight: size,
      // });
      // player = new TagsPlayer(viewer, coordinate, {
      //   imageUrl: 'assets/welcome/panda3-w.png',
      //   offset: { x: 5, y: -15 },
      //   align: 'bottom',
      //   title: title,
      //   color: color,
      //   fontColor: color,
      // });
    }, 3000);

    return () => {
      viewer.destroy();
    };
  }, [align, title, offestX, offestY, color]);

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

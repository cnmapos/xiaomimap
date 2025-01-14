import {
  Viewer,
  Cartesian3,
  Color,
  VerticalOrigin,
  HorizontalOrigin,
} from 'cesium';
import { IPlayer } from '../../types';
import { createCanvasImage, pixel2Coordinates } from '../../utils';

type TagsOptions = {
  imageUrl: string;
  offset?: { x: number; y: number };
  imageWidth?: number;
  imageHeight?: number;
  align: 'top' | 'bottom';
  color?: string;
  fontColor?: string;
  title?: string;
};

export class TagsPlayer implements IPlayer {
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  align: 'top' | 'bottom';
  offset: { x: number; y: number };
  color: string;
  fontColor: string;
  title: string | undefined;

  constructor(
    private viewer: Viewer,
    private coordinates: any[],
    options: TagsOptions
  ) {
    const {
      imageUrl,
      imageWidth = 150,
      imageHeight = 100,
      align = 'top',
      offset = { x: 50, y: 50 },
      color = '#FFF',
      fontColor,
      title,
    } = options;
    this.imageUrl = imageUrl;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.align = align;
    this.offset = offset;
    this.color = color;
    this.fontColor = fontColor || color;
    this.title = title;

    this.createImageTag();
  }

  play() {}
  pause() {
    // this.pausing = true;
  }
  replay() {}

  private createImageTag() {
    const position = Cartesian3.fromDegrees(...this.coordinates);
    // 创建POI点
    const poiEntity = this.viewer.entities.add({
      position: position,
      point: {
        pixelSize: 10,
        color: Color.fromCssColorString(this.color),
      },
    });

    // 计算图片底部中心位置
    const offsetCoordinate = pixel2Coordinates(
      this.viewer,
      this.offset.x,
      this.offset.y
    )!;
    const offsetLat =
      this.align === 'top' ? offsetCoordinate.lat : -offsetCoordinate.lat;
    const imagePosition = Cartesian3.fromDegrees(
      this.coordinates[0] + offsetCoordinate.lng,
      this.coordinates[1] + offsetLat
    );

    const lineEntity = this.viewer.entities.add({
      polyline: {
        positions: [position, imagePosition],
        width: 2,
        material: Color.fromCssColorString(this.color),
      },
    });

    createCanvasImage(this.imageUrl, {
      width: this.imageWidth,
      height: this.imageHeight,
      title: this.title,
      color: this.color,
      fontColor: this.fontColor,
      fontPosition: this.align,
    }).then((canvasImage: any) => {
      const billboardEntity = this.viewer.entities.add({
        position: imagePosition,
        billboard: {
          image: canvasImage.toDataURL(), // 使用canvas的dataURL作为图像
          verticalOrigin:
            this.align === 'top' ? VerticalOrigin.BOTTOM : VerticalOrigin.TOP,
          horizontalOrigin: HorizontalOrigin.CENTER,
          // pixelOffset: new Cartesian2(0, -40),
        },
      });
    });
  }
}

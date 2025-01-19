import {
  Viewer,
  Cartesian3,
  Color,
  VerticalOrigin,
  HorizontalOrigin,
  HeightReference,
  Ellipsoid,
  DistanceDisplayCondition,
  Cartesian2,
  Rectangle,
  Math as CMath,
  PolylineGlowMaterialProperty,
  ImageMaterialProperty,
  CallbackProperty,
  JulianDate,
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
  zIndex?: number;
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
  zIndex: number;

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
      zIndex = 0,
    } = options;
    this.imageUrl = imageUrl;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.align = align;
    this.offset = offset;
    this.color = color;
    this.fontColor = fontColor || color;
    this.title = title;
    this.zIndex = zIndex;
    console.log('zindex: ', this.zIndex);

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

    const imageOffsetCoordinate = pixel2Coordinates(
      this.viewer,
      this.imageWidth / 2,
      this.imageHeight / 2
    )!;

    const offsetLat =
      this.align === 'top' ? offsetCoordinate.lat : -offsetCoordinate.lat;
    console.log('zIndex: ', this.zIndex);
    const imageCoordinate = [
      this.coordinates[0] + offsetCoordinate.lng,
      this.coordinates[1] + offsetLat,
    ];
    const imagePosition = Cartesian3.fromDegrees(
      this.coordinates[0] + offsetCoordinate.lng,
      this.coordinates[1] + offsetLat
    );
    console.log('z', imagePosition.z);

    const lineEntity = this.viewer.entities.add({
      polyline: {
        zIndex: 2,
        width: 5.0,
        clampToGround: true,
        positions: [position, imagePosition],
        material: new PolylineGlowMaterialProperty({
          color: Color.fromCssColorString(this.color),
          glowPower: 0.2,
          // tintColor: Color.fromCssColorString(this.color),
        }),
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
      console.log(imagePosition.z, this.zIndex);
      let alpha = 0;
      const billboardEntity = this.viewer.entities.add({
        rectangle: {
          zIndex: 10,
          coordinates: new Rectangle(
            CMath.toRadians(imageCoordinate[0] - imageOffsetCoordinate.lng),
            CMath.toRadians(
              imageCoordinate[1] +
                (this.align === 'top' ? 0 : imageOffsetCoordinate.lat * 2)
            ),
            CMath.toRadians(imageCoordinate[0] + imageOffsetCoordinate.lng),
            CMath.toRadians(
              imageCoordinate[1] -
                (this.align === 'bottom' ? 0 : imageOffsetCoordinate.lat * 2)
            )
          ),
          material: new ImageMaterialProperty({
            image: canvasImage.toDataURL(),
            transparent: true,
            color: new CallbackProperty(function (time, result) {
              // 计算透明度，从0到1的淡入效果
              const currentTime = JulianDate.now();
              // const alpha =
              //   JulianDate.secondsDifference(currentTime, time) / 2.0;
              // const alpha = result?.alpha || 0;
              alpha += 0.02;
              console.log(alpha);
              return Color.fromAlpha(
                result || Color.WHITE,
                Math.min(alpha, 1.0)
              );
            }, false),
          }),
        },

        // billboard: {
        //   image: canvasImage.toDataURL(), // 使用canvas的dataURL作为图像
        //   verticalOrigin:
        //     this.align === 'top' ? VerticalOrigin.BOTTOM : VerticalOrigin.TOP,
        //   horizontalOrigin: HorizontalOrigin.CENTER,
        //   eyeOffset: new Cartesian3(0.0, 0.0, -this.zIndex), // Negative Z will make it closer to the camera
        // },
      });

      // 旋转动画
      // let rotation = CMath.toRadians(5); // 初始旋转角度
      // const rotateInterval = setInterval(() => {
      //   rotation = -rotation; // 每次增加的旋转角度
      //   billboardEntity.rectangle.rotation = rotation; // 更新旋转角度
      // }, 1000); // 每50毫秒更新一次
    });
  }
}

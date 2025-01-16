import {
    Cartesian3,
  SceneTransforms,
  Viewer,
} from 'cesium';
import { IAnimation, IPlayer } from '../../types';

// 飞入方向
enum SlideDirection {
    LEFT_RIGHT = 'LEFT_RIGHT',
    RIGHT_LEFT = 'LEFT_RIGHT',
    TOP_BOTTOM = 'LEFT_RIGHT',
    BOTTOM_TOP = 'LEFT_RIGHT',
}

type TextSlideAnimation = IAnimation & {    
    // 文字滑入动画的个性话属性
    animation_slide_direction: SlideDirection, // 滑入方向
}

type TextOptions = {
  text: string;
  color?: string;
  slide?: TextSlideAnimation | null; // 传入slide说明想要有滑动动画，不传则不需要动画
};

export class TextAnimPlayer implements IPlayer {
  
  private color: string;
  text: string;

  constructor(
    private viewer: Viewer,
    private coordinates: any[],
    options: TextOptions
  ) {
    const {
      text = '',
      color = '#000'
    } = options;
    
    this.color = color;
    this.text = text;

    this.createText();
  }

  play() {}
  pause() {}
  replay() {}

  private createText() {

    const textOverlay = document.getElementById('textOverlay');
    const position = Cartesian3.fromDegrees(...this.coordinates);
    console.log(this.viewer, 1)
    const viewer = this.viewer;
    const updatePosition = () => {
        if (viewer) {
            const canvasPosition = SceneTransforms.worldToWindowCoordinates(viewer.scene, position);
            if (canvasPosition) {
                textOverlay.style.left = `${canvasPosition.x}px`;
                textOverlay.style.top = `${canvasPosition.y}px`;
            }
        }
        
        requestAnimationFrame(updatePosition);

        // 将 WGS84 坐标转换为世界坐标
        // const worldPosition = SceneTransforms.computeActualWgs84Position(this.viewer.scene, position);
        
        // // 将世界坐标转换为屏幕坐标
        // const canvasPosition = SceneTransforms.computeWindowCoordinates(this.viewer.scene, worldPosition);
        
        // if (canvasPosition) {
        //     textOverlay.style.left = `${canvasPosition.x}px`;
        //     textOverlay.style.top = `${canvasPosition.y}px`;
        // }
        // requestAnimationFrame(updatePosition);
    };
    updatePosition();
  }
}

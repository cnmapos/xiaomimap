import {
    Cartesian3,
  SceneTransforms,
  Viewer,
} from 'cesium';
import anime from 'animejs';
import { IAnimation, IPlayer } from '../../types';

// 这个网站有一些用animejs实现的文字动画、效果都挺好的。可以参考实现
// https://tobiasahlin.com/moving-letters/

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
    };
    updatePosition();

    textOverlay.innerHTML = textOverlay.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    anime.timeline({loop: true})
        .add({
            targets: '#textOverlay .letter',
            scale: [4,1],
            opacity: [0,1],
            translateZ: 0,
            easing: "easeOutExpo",
            duration: 950,
            delay: (el, i) => 70*i
        }).add({
            targets: '#textOverlay',
            opacity: 0,
            duration: 1000,
            easing: "easeOutExpo",
            delay: 1000
        });
  }
}

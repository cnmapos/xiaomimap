import {
  CallbackProperty,
  Cartesian3,
  Color,
  CustomShader,
  HeightReference,
  LabelStyle,
  SceneTransforms,
  VerticalOrigin,
  Viewer,
} from 'cesium';
import anime from 'animejs';
import { IAnimation, IPlayer } from '../../types';

// 这个网站有一些用animejs实现的文字动画、效果都挺好的。可以参考实现
// https://tobiasahlin.com/moving-letters/
enum TextAnimation {
  JUMP
}

type TextOptions = {
  text: string;
  color?: string;
  animationType: TextAnimation,
};

export class TextAnimPlayer implements IPlayer {
  
  private color: string;
  text: string;
  id: string;

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

    this.id = new Date().getTime() + '' + Math.random();

    this.createDom();
    this.createText();
  }

  play() {}
  pause() {}
  replay() {}

  private createDom() {
    const textDom = document.createElement('div');
    textDom.style.position = 'absolute';
    textDom.style.zIndex = '999';
    textDom.style.pointerEvents = 'none';
    textDom.id = this.id;
    this.viewer._container.appendChild(textDom);
  }

  private createText() {
    /*
      使用dom方式实现动画效果
    */
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

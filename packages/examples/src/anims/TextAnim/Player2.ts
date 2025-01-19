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

export class TextAnimation implements IPlayer {
    constructor(viewer, coordinates, options) {
        this.viewer = viewer;
        this.coordinates = coordinates;
        this.options = options;
        this.animation = null;
        this.textOverlay = null;
        this.isDestroyed = false; // 标志位，用于标记对象是否已被销毁

        // 初始化
        this.init();
    }

    // 初始化 DOM 元素
    init() {
        // 创建 DOM 元素
        this.textOverlay = document.createElement('div');
        this.textOverlay.style.position = 'absolute';
        this.textOverlay.style.pointerEvents = 'none';
        this.textOverlay.style.color = this.options.color || 'white';
        this.textOverlay.style.fontSize = '24px';
        this.textOverlay.style.opacity = '0'; // 初始透明度为 0
        this.textOverlay.style.whiteSpace = 'nowrap';
        this.textOverlay.innerText = this.options.text;

        // 将 DOM 元素添加到 Cesium 容器中
        this.viewer.container.appendChild(this.textOverlay);

        // 同步 DOM 元素位置
        this.syncPosition();
    }

    // 同步 DOM 元素位置
    syncPosition() {
        const position = Cartesian3.fromDegrees(this.coordinates[1], this.coordinates[0]);
        const updatePosition = () => {
            if (this.isDestroyed) {
                return; // 如果对象已被销毁，停止循环
            }

            const canvasPosition = SceneTransforms.worldToWindowCoordinates(
                this.viewer.scene,
                position
            );
            // 检测坐标是否在相机可见范围内
            if (canvasPosition) {
                const canvas = this.viewer.scene.canvas;
                const isVisible =
                    canvasPosition.x >= 0 &&
                    canvasPosition.x <= canvas.width &&
                    canvasPosition.y >= 0 &&
                    canvasPosition.y <= canvas.height;

                if (isVisible) {
                    this.textOverlay.style.display = 'block'; // 显示
                    this.textOverlay.style.left = `${canvasPosition.x}px`;
                    this.textOverlay.style.top = `${canvasPosition.y}px`;
                } else {
                    this.textOverlay.style.display = 'none'; // 隐藏
                }
            } else {
                this.textOverlay.style.display = 'none'; // 隐藏
            }
            requestAnimationFrame(updatePosition);
        };
        updatePosition();
    }

    // 获取动画配置
    getAnimationConfig(animationType) {
        switch (animationType) {
            case 'fadeIn':
                return {
                    opacity: [0, 1],
                    duration: 2000,
                    easing: 'easeInOutQuad',
                };

            case 'fadeOut':
                return {
                    opacity: [1, 0],
                    duration: 2000,
                    easing: 'easeInOutQuad',
                };

            case 'flyIn':
                return {
                    translateY: [-50, 0],
                    opacity: [0, 1],
                    duration: 2000,
                    easing: 'easeOutExpo',
                };

            case 'flyOut':
                return {
                    translateY: [0, -50],
                    opacity: [1, 0],
                    duration: 2000,
                    easing: 'easeOutExpo',
                };

            case 'rotateIn':
                return {
                    rotate: ['0deg', '360deg'],
                    opacity: [0, 1],
                    duration: 3000,
                    easing: 'easeInOutSine',
                };

            case 'rotateOut':
                return {
                    rotate: ['360deg', '0deg'],
                    opacity: [1, 0],
                    duration: 3000,
                    easing: 'easeInOutSine',
                };

            default:
                throw new Error(`Unsupported animation type: ${animationType}`);
        }
    }

    play() {}
    replay() {}

    // 播放入场动画
    playIn() {
        if (this.animation) {
            this.animation.pause(); // 暂停当前动画
        }

        const animationConfig = this.getAnimationConfig(this.options.animationIn || 'fadeIn');
        this.animation = anime({
            targets: this.textOverlay,
            ...animationConfig,
            autoplay: true,
        });
    }

    // 播放出场动画
    playOut() {
        if (this.animation) {
            this.animation.pause(); // 暂停当前动画
        }

        const animationConfig = this.getAnimationConfig(this.options.animationOut || 'fadeOut');
        this.animation = anime({
            targets: this.textOverlay,
            ...animationConfig,
            autoplay: true,
        });
    }

    // 暂停动画
    pause() {
        if (this.animation) {
            this.animation.pause();
        }
    }

    // 重新播放入场动画
    replayIn() {
        this.playIn();
    }

    // 重新播放出场动画
    replayOut() {
        this.playOut();
    }

    // 销毁 DOM 元素
    destroy() {
        if (this.textOverlay) {
            this.viewer.container.removeChild(this.textOverlay);
            this.textOverlay = null;
        }
        this.isDestroyed = true; // 标记对象已被销毁
    }
}
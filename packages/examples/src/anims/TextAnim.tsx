import { HZViewer } from '@hztx/core'
import { useEffect } from 'react'
import MapContainer from '../components/map-container'
import {
  Cartesian3,
  Color,
  KmlDataSource,
  PolylineDashMaterialProperty,
  Math as CesiumMath,
  CallbackProperty,
  Rectangle,
  MaterialProperty,
  Material,
  LabelStyle,
  Cartesian2,
  JulianDate,
  HorizontalOrigin,
  VerticalOrigin,
} from 'cesium'

// 生成透明图片
function createTransparentImage(width, height, opacity = 0.5) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  // 设置透明背景
  context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
  context.fillRect(0, 0, width, height);

  return canvas.toDataURL("image/png");
}

function createRotatedTextCanvas(text, angle, font = "24px sans-serif", color = "red") {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = 200; // 设置画布宽度
  canvas.height = 100; // 设置画布高度

  context.clearRect(0, 0, canvas.width, canvas.height);

  // 设置文本样式
  context.font = font;
  context.fillStyle = color;
  context.textAlign = "center";
  context.textBaseline = "middle";

  // 旋转文本
  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate(angle); // 旋转角度
  context.fillText(text, 0, 0);

  return canvas;
}


// 文本的特效、最终还是用 billboard 实现吧，因为我们想要做文本的 旋转、但是 label 自身是没法旋转的，cesium并不支持。所以我们可以用动态创建文本图片的方式去模拟文本，还能借用billboard的旋转实现旋转效果。
function TextAnim() {
  useEffect(() => {
    const hz = new HZViewer('map')
    const { viewer } = hz

    const transparentImage = createTransparentImage(100, 100, 0.5);

    const textEty = viewer.entities.add({
      position: Cartesian3.fromDegrees(-75.1641667, 39.9522222),
      billboard: {
        image: createRotatedTextCanvas("Hello, Cesium!", 0).toDataURL(),
        verticalOrigin: VerticalOrigin.CENTER,
        horizontalOrigin: HorizontalOrigin.CENTER,
        width: 200,
        height: 100,
      },
      // label: {
      //   text: 'Hello, Cesium!',
      //   font: '24px sans-serif',
      //   fillColor: Color.RED,
      //   outlineColor: Color.PINK,
      //   outlineWidth: 2,
      //   style: LabelStyle.FILL_AND_OUTLINE,
      //   pixelOffset: new Cartesian2(0, 50), // 偏移量
      //   horizontalOrigin: HorizontalOrigin.CENTER,
      //   verticalOrigin: VerticalOrigin.BOTTOM,
      // },
    })


    // 动态更新旋转
    let angle = 0; // 角度初始值
    viewer.clock.onTick.addEventListener(() => {
      angle += CesiumMath.toRadians(2); // 每帧旋转 2 度
      if (angle >= Math.PI * 2) {
        angle = 0; // 重置角度
      }

      // 更新 billboard 图像
      const rotatedCanvas = createRotatedTextCanvas("Hello, Cesium!", angle);
      textEty.billboard.image = rotatedCanvas.toDataURL();
    });

    /**
     * 透明度从0到1的动画
     * @param {Entity} entity - 文字实体
     * @param {number} duration - 动画持续时间（秒）
     */
    function fadeIn(entity, duration) {
      if (!entity.label) {
        console.error('Entity does not have a label.')
        return
      }

      function getNewColor(originalColor) {
        const currentColor = originalColor.getValue(); // 获取当前颜色
        const newColor = Color.fromBytes(
          currentColor.red * 255,
          currentColor.green * 255,
          currentColor.blue * 255,
          currentColor.alpha
        );
        return newColor;
      }

      // 确保fillColor和outlineColor是Cesium.Color实例
      const originalFillColor = getNewColor(entity.label.fillColor)
      const originalOutlineColor = getNewColor(entity.label.outlineColor);

      // 初始化透明度为0
      entity.label.fillColor = originalFillColor.withAlpha(0)
      entity.label.outlineColor = originalOutlineColor.withAlpha(0)

      let alpha = 0
      const startTime = JulianDate.now()
      const stopTime = JulianDate.addSeconds(
        startTime,
        duration,
        new JulianDate()
      )

      viewer.clock.onTick.addEventListener(function (clock) {
        const currentTime = JulianDate.now()
        if (JulianDate.compare(currentTime, stopTime) > 0) {
          // 动画结束，确保透明度为1
          entity.label.fillColor = originalFillColor.withAlpha(1)
          entity.label.outlineColor = originalOutlineColor.withAlpha(1)
          return
        }

        // 计算当前透明度
        const elapsed = JulianDate.secondsDifference(
          currentTime,
          startTime
        )
        alpha = elapsed / duration

        // 更新fillColor和outlineColor的透明度
        entity.label.fillColor = originalFillColor.withAlpha(alpha)
        entity.label.outlineColor = originalOutlineColor.withAlpha(alpha)
      })
    }

    /**
     * 文字360度翻转动画
     * @param {Entity} entity - 文字实体
     * @param {number} duration - 动画持续时间（秒）
     */
    function rotate360(entity, duration) {
      let rotation = 0
      const startTime = JulianDate.now()
      const stopTime = JulianDate.addSeconds(
        startTime,
        duration,
        new JulianDate()
      )

      viewer.clock.onTick.addEventListener(function (clock) {
        const currentTime = JulianDate.now()
        if (JulianDate.compare(currentTime, stopTime) > 0) {
          entity.billboard.rotation = 0 // 确保最终角度为0
          return // 动画结束
        }

        const elapsed = JulianDate.secondsDifference(currentTime, startTime)
        rotation = (elapsed / duration) * 2 * Math.PI // 计算旋转角度
        entity.billboard.rotation = rotation
      })
    }

    /**
     * 文字放大缩小动画
     * @param {Entity} entity - 文字实体
     * @param {number} duration - 动画持续时间（秒）
     * @param {number} maxScale - 最大缩放比例
     * @param {number} minScale - 最小缩放比例
     */
    function scaleUpDown(entity, duration, maxScale = 2, minScale = 0.5) {
      let scale = minScale
      const startTime = JulianDate.now()
      const stopTime = JulianDate.addSeconds(
        startTime,
        duration,
        new JulianDate()
      )

      viewer.clock.onTick.addEventListener(function (clock) {
        const currentTime = JulianDate.now()
        if (JulianDate.compare(currentTime, stopTime) > 0) {
          entity.label.scale = 1 // 恢复原始大小
          return // 动画结束
        }

        const elapsed = JulianDate.secondsDifference(currentTime, startTime)
        const progress = elapsed / duration

        if (progress < 0.5) {
          // 放大阶段
          scale = minScale + (maxScale - minScale) * (progress * 2)
        } else {
          // 缩小阶段
          scale = maxScale - (maxScale - minScale) * ((progress - 0.5) * 2)
        }

        entity.label.scale = scale
      })
    }

    // 调用特效函数
    // fadeIn(labelEntity, 3) // 透明度从0到1，持续3秒
    // rotate360(labelEntity, 3); // 360度翻转，持续3秒
    // scaleUpDown(labelEntity, 3); // 放大缩小，持续3秒

    return () => {
      viewer.destroy()
    }
  }, [])

  return (
    <MapContainer>
      <div style={{ width: '100%', height: '100%' }} id="map"></div>
    </MapContainer>
  )
}

export default TextAnim

import { HZViewer } from '@hztx/core'
import { useEffect } from 'react'
import MapContainer from '../../components/map-container'
import { TextAnimPlayer } from './Player';

// 文本的特效、最终还是用 billboard 实现吧，因为我们想要做文本的 旋转、但是 label 自身是没法旋转的，cesium并不支持。所以我们可以用动态创建文本图片的方式去模拟文本，还能借用billboard的旋转实现旋转效果。
function TextAnim() {
  useEffect(() => {
    const hz = new HZViewer('map')
    const { viewer } = hz

    const coordinate = [-75.59777, 40.03883];
    new TextAnimPlayer(viewer, coordinate, {
      text: '智慧树上智慧果',
      color: '#FFF'
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

    return () => {
      viewer.destroy()
    }
  }, [])

  return (
    <MapContainer>
      <div style={{ width: '100%', height: '100%', position: 'relative' }} id="map">
        <div id="textOverlay" style={{ position: 'absolute', color: 'white', fontSize: '24px', zIndex: 999 }}>
          Hello, Cesium!
        </div>
      </div>
    </MapContainer>
  )
}

export default TextAnim

import { HZViewer } from "@hztx/core";
import { useEffect } from "react";
import MapContainer from '../../components/map-container';
import { Cartesian3, Color, KmlDataSource, PolylineDashMaterialProperty, CallbackProperty, Rectangle, MaterialProperty, Material } from "cesium";

function CircleHalo() {
    useEffect(() => {
        const hz = new HZViewer('map');
        const { viewer } = hz;


        // 方案1，用一个矩形、然后加一个图片填充矩形、动态调整矩形大小实现波动效果
        // 定义图片的初始区域
        // const west = Math.toRadians(-100.0);
        // const south = Math.toRadians(20.0);
        // const east = Math.toRadians(-90.0);
        // const north = Math.toRadians(30.0);

        // // 添加图片实体
        // const imageEntity = viewer.entities.add({
        //     rectangle: {
        //         coordinates: new CallbackProperty(() => rectangleCoordinates, false), // 动态更新坐标
        //         material: "/circle-halo1.png", // 替换为你的图片 URL
        //     },
        // });

        // // 初始矩形区域
        // let rectangleCoordinates = new Rectangle(west, south, east, north);

        // // 动画参数
        // let scaleFactor = 0.005; // 缩放因子
        // let expanding = true; // 控制放大或缩小

        // // 动画控制
        // viewer.clock.onTick.addEventListener(() => {
        //     // 计算中心点
        //     const centerLon = (rectangleCoordinates.west + rectangleCoordinates.east) / 2;
        //     const centerLat = (rectangleCoordinates.south + rectangleCoordinates.north) / 2;

        //     // 调整边界，实现缩放
        //     const width = (rectangleCoordinates.east - rectangleCoordinates.west) / 2;
        //     const height = (rectangleCoordinates.north - rectangleCoordinates.south) / 2;

        //     if (expanding) {
        //         // 放大
        //         rectangleCoordinates = new Rectangle(
        //             centerLon - width * (1 + scaleFactor),
        //             centerLat - height * (1 + scaleFactor),
        //             centerLon + width * (1 + scaleFactor),
        //             centerLat + height * (1 + scaleFactor)
        //         );
        //     } else {
        //         // 缩小
        //         rectangleCoordinates = new Rectangle(
        //             centerLon - width * (1 - scaleFactor),
        //             centerLat - height * (1 - scaleFactor),
        //             centerLon + width * (1 - scaleFactor),
        //             centerLat + height * (1 - scaleFactor)
        //         );
        //     }

        //     console.log(width)
        //     // 控制缩放范围
        //     if (width > 0.2 || height > 0.2) {
        //         expanding = false; // 达到最大范围后缩小
        //     } else {
        //         expanding = true;
        //     }
        // });


        // 方案2 billboard实现，需要素材
        // 添加扩散圆光环
        const glowRing = viewer.entities.add({
            position: Cartesian3.fromDegrees(-75.59777, 40.03883),
            billboard: {
                width: 50,
                height: 50,
                image: "/circle-halo1.png", // 替换为你的光环纹理
                scale: 1.0,
                color: Color.YELLOW.withAlpha(0.8),
            },
          });
          
          // 动画参数
          let scale = 1.0;
          let expanding = true;
          
          // 动态更新扩散动画
          viewer.clock.onTick.addEventListener(() => {
            // 扩散逻辑
            if (expanding) {
              scale += 0.01; // 放大
              if (scale > 1.5) expanding = false;
            } else {
              scale -= 0.2; // 缩小
              if (scale < 1) expanding = true;
            }
          
            // 更新光环的 scale 和透明度
            glowRing.billboard.scale = scale;
            glowRing.billboard.color = Color.ORANGE.withAlpha(1.0 - (scale - 1.0) / 2.0);
          });


        // 方案3： 用shader实现，无需素材、
        // const glowMaterial = new Material({
        //     fabric: {
        //         type: 'Glow',
        //         uniforms: {
        //             color: new Color(1.0, 1.0, 0.0, 1.0), // 光晕颜色
        //             speed: 1.0, // 光晕速度
        //         },
        //         source: `
        //             uniform vec4 color;
        //             uniform float speed;
        //             czm_material czm_getMaterial(czm_materialInput materialInput) {
        //                 czm_material material = czm_getDefaultMaterial(materialInput);
        //                 float time = czm_frameNumber * speed * 0.01;
        //                 float glow = sin(time) * 0.5 + 0.5;
        //                 material.diffuse = color.rgb * glow;
        //                 material.alpha = color.a * glow;
        //                 return material;
        //             }
        //         `,
        //     },
        // });
        
        // const point = viewer.entities.add({
        //     position: Cartesian3.fromDegrees(-75.59777, 40.03883),
        //     point: {
        //         pixelSize: 50,
        //         material: glowMaterial,
        //     },
        // });

        // let size = 10;
        // let alpha = 1.0;
        // let growing = true;

        // viewer.clock.onTick.addEventListener(function(clock) {
        //     if (growing) {
        //         size += 1;
        //         alpha -= 0.02;
        //         if (size >= 50) {
        //             growing = false;
        //         }
        //     } else {
        //         // size -= 1;
        //         size = 10;
        //         alpha = 1;
        //         // alpha += 0.02;
        //         if (size <= 10) {
        //             growing = true;
        //         }
        //     }

        //     point.point.pixelSize = size;
        //     point.point.color = Color.YELLOW.withAlpha(alpha);
        // });

        return () => {
            viewer.destroy();
        };
    }, []);

    return (
        <MapContainer>
            <div style={{ width: '100%', height: '100%' }} id="map">
            </div>
        </MapContainer>
    )
}

export default CircleHalo
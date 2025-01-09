import { useEffect } from "react";
import MapContainer from "../../components/map-container";
import { CallbackProperty, Cartesian3, Math as CMath, Cartographic, Color, PolylineArrowMaterialProperty, Cartesian2, Viewer, defined } from "cesium";
import { HZViewer } from "@hztx/core";

const Arrow = () => {
    useEffect(() => {
        const hz = new HZViewer('map');
        const { viewer }: { viewer: Viewer } = hz;
        const coordinates = [
            [104.167069626642999, 30.758156896017201, 0 ],
            [104.167254997997003, 30.756885704837099, 0],
        ];

        const scene = viewer.scene;
        const pixelToCoordinates = (pixel) => {
            const screenWidth = scene.canvas.clientWidth;
            const screenHeight = scene.canvas.clientHeight;
            const startPixel = new Cartesian2(screenWidth / 2, screenHeight / 2); // 屏幕中心
            const endPixel = new Cartesian2(startPixel.x + pixel, startPixel.y); // 向右 100 像素

            // 将像素坐标转换为世界坐标
            const startWorldPos = scene.globe.pick(viewer.camera.getPickRay(startPixel)!, scene);
            const endWorldPos = scene.globe.pick(viewer.camera.getPickRay(endPixel)!, scene);

            if (defined(startWorldPos) && defined(endWorldPos)) {
                // 将世界坐标转换为经纬度
                const startCartographic = Cartographic.fromCartesian(startWorldPos);
                const endCartographic = Cartographic.fromCartesian(endWorldPos);

                // 计算经纬度差值（以弧度表示）
                const lonDiff = endCartographic.longitude - startCartographic.longitude;
                const latDiff = endCartographic.latitude - startCartographic.latitude;

                // 将弧度转换为度数
                const lng = CMath.toDegrees(lonDiff);
                const lat = CMath.toDegrees(latDiff);

                return { lng, lat }
            };
        }

        const destination = [coordinates[0][0], coordinates[0][1]];
        viewer.camera.setView({
            destination: Cartesian3.fromDegrees(...destination, 1000),

        });

        const token = setTimeout(() => {
            const buffer = pixelToCoordinates(10)!;

            let direction = -1, value = 0;
            const frameCount = 10;


            // const length = 20
            viewer.entities.add({
                name: "arrow",
                id: 'arrow',
                polyline: {
                  positions: Cartesian3.fromDegreesArrayHeights(coordinates.flat()),
                // positions: new CallbackProperty((e, result) => {
                
                //     value = (value + direction) % (frameCount * 2);
                //     if (value === 0 || value === frameCount) {
                //         direction *= -1; // 反转方向
                //     }

                //     const offset = { lng: 0, lat:  value < frameCount ? value * buffer.lng / frameCount : (frameCount * 2 - value) * buffer.lng / frameCount }; // 根据value计算offset
                //     console.log(offset)
                //     return Cartesian3.fromDegreesArrayHeights(coordinates.map((c) => [c[0] + offset.lng, c[1] + offset.lat, c[2]]).flat());
                // }, false),
                width: 30,
                material: new PolylineArrowMaterialProperty(Color.ORANGE),
                clampToGround: true,
                },
            });
            viewer.entities.getById('arrow').polyline.positions = new CallbackProperty((e, result) => {
                value = (value + direction) % (frameCount * 2);
                if (value === 0 || value === frameCount) {
                    direction *= -1; // 反转方向
                }

                const offset = { lng: 0, lat:  value < frameCount ? value * buffer.lng / frameCount : (frameCount * 2 - value) * buffer.lng / frameCount }; // 根据value计算offset
                console.log(offset)
                return Cartesian3.fromDegreesArrayHeights(coordinates.map((c) => [c[0] + offset.lng, c[1] + offset.lat, c[2]]).flat());
            }, false)

        }, 5000);

          return () => {
            viewer.destroy();
            clearTimeout(token);
          }
        }, []);

    return (
        <MapContainer>
            <div style={{ width: '100%', height: '100%' }} id="map">
            </div>  
            <div></div>
        </MapContainer>
    )
}

export default Arrow;
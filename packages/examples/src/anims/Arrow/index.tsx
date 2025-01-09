import { useEffect } from "react";
import MapContainer from "../../components/map-container";
import { CallbackProperty, Cartesian3, Math as CMath, Cartographic, Color, PolylineArrowMaterialProperty, Cartesian2 } from "cesium";
import { HZViewer } from "@hztx/core";

const Arrow = () => {
    useEffect(() => {
        const hz = new HZViewer('map');
        const { viewer } = hz;
        const coordinates = [
            [104.167069626642999, 30.758156896017201, 0 ],
            [104.168454997997003, 30.756885704837099, 0],
            [104.167254997997003, 30.756885704837099, 0],
        ];

        const pixelToCoordinates = (pixel) => {
            const cartesian = viewer.camera.pickEllipsoid(pixel);
            if (cartesian) {
                const cartographic = Cartographic.fromCartesian(cartesian);
                const lng = CMath.toDegrees(cartographic.longitude);
                const lat = CMath.toDegrees(cartographic.latitude);
                return { lng, lat };
            }
            return null; // 如果没有找到对应的经纬度
        };

        const direction = -1;
        viewer.entities.add({
            name: "arrow",
            polyline: {
            //   positions: Cartesian3.fromDegreesArrayHeights(coordinates.flat()),
            positions: new CallbackProperty((e, result) => {
                const offset = pixelToCoordinates(new Cartesian2(5 * direction, 0)) || { lng: 0, lat: 0 };
                direction *= -1;
                
                return Cartesian3.fromDegreesArrayHeights(coordinates.map((c) => [c[0] + offset.lng, c[1] + offset.lat, c[2]]));
            }, false),
              width: 30,
              material: new PolylineArrowMaterialProperty(Color.ORANGE),
              clampToGround: true,
            },
          });
          viewer.zoomTo(viewer.entities);

          return () => {
            viewer.destroy();
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
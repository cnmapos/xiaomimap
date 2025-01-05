import { HZViewer } from "@hztx/core";
import { useEffect } from "react";
import MapContainer from '../components/map-container';
import { Cartesian3, Color, KmlDataSource, PolylineDashMaterialProperty } from "cesium";

function Path() {
    useEffect(() => {
        const hz = new HZViewer('map');
        const { viewer } = hz;

        const kmlDataSource = new KmlDataSource();
        kmlDataSource.load('/assets/pathForBike.kml').then(function(dataSource) {
            console.log(dataSource)
        })

        const orangeLine = viewer.entities.add({
            name: "Orange dashed line with a short dash length",
            polyline: {
              positions: Cartesian3.fromDegreesArrayHeights([
                -75, 42, 250000, -125, 42, 250000,
              ]),
              width: 5,
              material: new PolylineDashMaterialProperty({
                color: Color.ORANGE,
                dashLength: 8.0,
              }),
            },
          });

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

export default Path
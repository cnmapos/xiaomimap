import { useEffect } from "react";
import MapContainer from "../../components/map-container";
import './style.less';
import { HZViewer } from "@hztx/core";

const Template = () => {
    useEffect(() => {
        const hz = new HZViewer('map');
        const { viewer } = hz;
    }, []);

    return (
        <MapContainer>
            <div style={{ width: '100%', height: '100%' }} id="map">
            </div>  
            <div></div>
        </MapContainer>
    )
}

export default Template;
import { useEffect, useState } from "react";
import MapContainer from "../../components/map-container";
import { CallbackProperty, Cartesian3, Math as CMath, Cartographic, Color, PolylineArrowMaterialProperty, Cartesian2, Viewer, defined, PolygonGraphics, Material, MaterialAppearance, PolygonGeometry, GeometryInstance, Primitive, Matrix4 } from "cesium";
import { HZViewer } from "@hztx/core";
import { Button, ColorPicker, InputNumber, Select, Switch } from "antd";
import chinaJSON from '../../assets/china.json'
import { IPlayer } from "../../types";
import { PolygonPlayer } from "./PolygonPlayer";


const Video = () => {
  const [color, setColor] = useState('#24BF7C');
  const [showOutline, setShowOutline] = useState(false);
  const [outlineColor, setOutlineColor] = useState('#FFF');
  const [direction, setLineType] = useState(0);
  const [outlineWidth, setOutlineWidth] = useState(2);

    let player1: IPlayer;
    let player2: IPlayer;

    useEffect(() => {
        const hz = new HZViewer('map');
        const { viewer }: { viewer: Viewer } = hz;

        const [positions1] = chinaJSON.features.find((f) => f.properties.name === '四川')?.geometry.coordinates[0] || [];
        const [positions2] = chinaJSON.features.find((f) => f.properties.name === '重庆')?.geometry.coordinates[0] || [];
        const [positions3] = chinaJSON.features.find((f) => f.properties.name === '陕西')?.geometry.coordinates[0] || [];
        const [positions4] = chinaJSON.features.find((f) => f.properties.name === '甘肃')?.geometry.coordinates[0] || [];
        const [positions5] = chinaJSON.features.find((f) => f.properties.name === '湖北')?.geometry.coordinates[0] || [];
        const [positions6] = chinaJSON.features.find((f) => f.properties.name === '湖南')?.geometry.coordinates[0] || [];

        viewer.camera.setView({
            destination: Cartesian3.fromDegrees(...positions1[0], 2990000)
        });
        player1 = new PolygonPlayer(viewer, positions1, { color, direction, outlineWidth, showOutline, outlineColor });
        player2 = new PolygonPlayer(viewer, positions2, { color: '#432304', direction: 1, outlineWidth, showOutline, outlineColor });
        new PolygonPlayer(viewer, positions3, { color: '#dd0022', direction: 2, outlineWidth, showOutline, outlineColor });
        new PolygonPlayer(viewer, positions4, { color: '#350673', direction: 3, outlineWidth, showOutline, outlineColor });
        new PolygonPlayer(viewer, positions5, { color: '#005533', direction: 1, outlineWidth, showOutline, outlineColor });
        new PolygonPlayer(viewer, positions6, { color: '#aa00aa', direction: 2, outlineWidth, showOutline, outlineColor });

        return () => {
            viewer.destroy();
          }
        }, [color, outlineColor, showOutline, outlineWidth, direction]
    );

    const play = () => {
      player1?.play();
      player2?.play();
    }

    const pause = () => {

    }

    const replay = () => {
  
    }
            

    return (
        <MapContainer>
            <div style={{ width: '100%', height: '100%' }} id="map">
            </div>  
            <div>
              <div className="hz-player">
                <Button className='hz-btn' onClick={play}>播放</Button>
                <Button className='hz-btn'  onClick={pause}>暂停</Button>
                <Button className='hz-btn'  onClick={replay}>重新播放</Button>
              </div>
              <div className="hz-style">
                <div className="hz-style-item">
                  <span>线颜色：</span>
                  <ColorPicker showText defaultValue={color} onChange={(e) => setColor(`#${e.toHex()}`)} />
                </div>
                <div className="hz-style-item">
                  <Select
                    defaultValue={direction}
                    style={{ width: 120 }}
                    onChange={(e) => setLineType(e)}
                    options={[
                      { value: 0, label: '从左至右' },
                      { value: 1, label: '从右至左' },
                      { value: 2, label: '从上至下' },
                      { value: 3, label: '从下至上' }
                    ]}
                  />
                </div>
                <div className="hz-style-item">
                  <span>显示边框</span>
                  <Switch defaultValue={showOutline} onChange={(e) => { setShowOutline(e) }} />
                </div>
                <div className="hz-style-item">
                  <InputNumber addonBefore="边框宽度" defaultValue={outlineWidth} onChange={(e) => setOutlineWidth(e)} />
                </div>
                <div className="hz-style-item">
                  <span>边框颜色：</span>
                  <ColorPicker showText defaultValue={outlineColor} onChange={(e) => setOutlineColor(`#${e.toHex()}`)} />
                </div>
              </div>
            </div>   
        </MapContainer>
    )
}

export default Video;
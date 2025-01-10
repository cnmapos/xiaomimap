import { useEffect, useState } from "react";
import MapContainer from "../../components/map-container";
import { CallbackProperty, Cartesian3, Math as CMath, Cartographic, Color, PolylineArrowMaterialProperty, Cartesian2, Viewer, defined } from "cesium";
import { HZViewer } from "@hztx/core";
import { Button, ColorPicker, InputNumber, Switch } from "antd";
import { ArrowPlayer } from "./ArrowPlayer";
import { IPlayer } from "../../types";

const Arrow = () => {
    const [color, setColor] = useState('#FFF');
    const [width, setWidth] = useState(10);
    const [offset, setOffset] = useState(10);
    const [offsetX, setOffsetX] = useState(10);
    const [offsetY, setOffsetY] = useState(10);
    const [offsetHeight, setOffsetHeight] = useState(0);
    const [frameRate, setFrameRate] = useState(15);
    const [alongTrack, setAlongTrack] = useState(false);

    let player1: IPlayer;
    let player2: IPlayer;
    let player3: IPlayer;
    let player4: IPlayer;

    useEffect(() => {
        const hz = new HZViewer('map');
        const { viewer }: { viewer: Viewer } = hz;

        viewer.camera.setView({
            destination: Cartesian3.fromDegrees(104.167069626642999, 30.758156896017201, 1000)
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
        player1 = new ArrowPlayer(
            viewer,
            [
                [104.167069626642999, 30.758156896017201, 0 ],
                [104.167569626642999, 30.758156896017201, 0 ],
                // [104.167254997997003, 30.756885704837099, 100],
            ],
            {
                color: color,
                width: width,
                offsetX: offsetX,
                offsetY: offsetY,
                offsetHeight: offsetHeight,
                frameRate: frameRate,
                alongTrack: alongTrack,
                offset: offset,
            }
        );

        player2 = new ArrowPlayer(
            viewer,
            [
                [104.167869626642999, 30.758956896017201, 0 ],
                [104.167869626642999, 30.758456896017201, 0 ],
                // [104.167254997997003, 30.756885704837099, 100],
            ],
            {
                color: color,
                width: width,
                offsetX: offsetX,
                offsetY: offsetY,
                offsetHeight: offsetHeight,
                frameRate: frameRate,
                alongTrack: alongTrack,
                offset: offset,
            }
        )

        player3 = new ArrowPlayer(
            viewer,
            [
                [104.168569626642999, 30.758156896017201, 0 ],
                [104.168169626642999, 30.758156896017201, 0 ],
                // [104.167254997997003, 30.756885704837099, 100],
            ],
            {
                color: color,
                width: width,
                offsetX: offsetX,
                offsetY: offsetY,
                offsetHeight: offsetHeight,
                frameRate: frameRate,
                alongTrack: alongTrack,
                offset: offset,
            }
        )

        player4 = new ArrowPlayer(
            viewer,
            [
                [104.167869626642999, 30.757056896017201, 0 ],
                [104.167869626642999, 30.757856896017201, 0 ],
                // [104.167254997997003, 30.756885704837099, 100],
            ],
            {
                color: color,
                width: width,
                offsetX: offsetX,
                offsetY: offsetY,
                offsetHeight: offsetHeight,
                frameRate: frameRate,
                alongTrack: alongTrack,
                offset: offset,
            }
        )


        return () => {
            viewer.destroy();
          }
        }, [color, width, offset, offsetX, offsetY, offsetHeight, frameRate, alongTrack]
    );

    const play = () => {
        player1?.play();
        player2?.play();
        player3?.play();
        player4?.play();
    }

    const pause = () => {
        player1?.pause();
        player2?.pause();
        player3?.pause();
        player4?.pause();
    }

    const replay = () => {
        player1?.replay();
        player2?.replay();
        player3?.replay();
        player4?.replay();
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
                  <span>沿着轨迹</span>
                  <Switch defaultValue={alongTrack} onChange={(e) => { setAlongTrack(e) }} />
                </div>
                {alongTrack &&
                  <div className="hz-style-item">
                    <InputNumber addonBefore="Offset" defaultValue={offset} onChange={(e) => setOffset(e)} />
                  </div>
                }
                <div className="hz-style-item">
                  <InputNumber addonBefore="箭头宽度" defaultValue={width} onChange={(e) => setWidth(e)} />
                </div>
                <div className="hz-style-item">
                  <InputNumber addonBefore="Offset X" defaultValue={offsetX} onChange={(e) => setOffsetX(e)} />
                </div>
                <div className="hz-style-item">
                  <InputNumber addonBefore="Offset Y" defaultValue={offsetY} onChange={(e) => setOffsetY(e)} />
                </div>
                <div className="hz-style-item">
                  <InputNumber addonBefore="Offset Height" defaultValue={offsetHeight} onChange={(e) => setOffsetHeight(e)} />
                </div>
                <div className="hz-style-item">
                  <InputNumber addonBefore="帧频次" defaultValue={frameRate} onChange={(e) => setFrameRate(e)} />
                </div>
              </div>
            </div>   
        </MapContainer>
    )
}

export default Arrow;
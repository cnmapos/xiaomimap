import { useEffect, useState } from "react";
import MapContainer from "../../components/map-container";
import { CallbackProperty, Cartesian3, Math as CMath, Cartographic, Color, PolylineArrowMaterialProperty, Cartesian2, Viewer, defined, PolygonGraphics, Material, MaterialAppearance, PolygonGeometry, GeometryInstance, Primitive, Matrix4, JulianDate, MaterialProperty } from "cesium";
import { HZViewer } from "@hztx/core";
import { Button, ColorPicker, InputNumber, Select, Switch } from "antd";


const Glow = () => {
  const [color, setColor] = useState('#24BF7C');
  const [showOutline, setShowOutline] = useState(false);
  const [outlineColor, setOutlineColor] = useState('#FFF');
  const [direction, setLineType] = useState(0);
  const [outlineWidth, setOutlineWidth] = useState(2);

    useEffect(() => {
        const hz = new HZViewer('map');
        const { viewer }: { viewer: Viewer } = hz;

        viewer.camera.setView({
            destination: Cartesian3.fromDegrees(-125.0, 35.0, 29900000)
        });

        const glowMaterial = new Material({
          fabric: {
              type: 'Glow',
              uniforms: {
                  color: new Color(0.0, 1.0, 0.0, 1.0), // 荧光颜色
                  glowPower: 0.1, // 荧光强度
                  time: 0.0 // 时间变量，用于动画效果
              },
              source: `
                  uniform vec4 color;
                  uniform float glowPower;
                  uniform float time;
                  
                  czm_material czm_getMaterial(czm_materialInput materialInput) {
                      czm_material material = czm_getDefaultMaterial(materialInput);
                      
                      // 计算荧光效果
                      float glow = sin(materialInput.st.s * 10.0 + time) * 0.5 + 0.5;
                      glow = pow(glow, glowPower);
                      
                      material.diffuse = color.rgb * glow;
                      material.alpha = color.a * glow;
                      
                      return material;
                  }
              `
          }
      });

      const polyline = viewer.scene.primitives.add(new Primitive({
        geometryInstances: new GeometryInstance({
            geometry: new PolygonGeometry({
                polygonHierarchy: {
                    positions: Cartesian3.fromDegreesArray([
                        -75.0, 35.0,
                        -125.0, 35.0,
                        -125.0, 40.0,
                        -75.0, 40.0
                    ]),
                    holes: []
                },
                // 其他PolygonGeometry的属性可以在这里设置
            }),
        }),
        appearance: new MaterialAppearance({
          material: glowMaterial
        })
      }))

      let time = 0.0;
      viewer.scene.preUpdate.addEventListener(() => {
          time += 0.010; // 控制淡入淡出的速度
          if (time > 1.0) {
              time = 0.0; // 重置时间
          }
          polyline.appearance.material.uniforms.time = time;
      });

        return () => {
            viewer.destroy();
          }
        }, []
    );

    const play = () => {
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

export default Glow;
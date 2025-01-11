import { useEffect, useState } from "react";
import MapContainer from "../../components/map-container";
import { CallbackProperty, Cartesian3, Math as CMath, Cartographic, Color, PolylineArrowMaterialProperty, Cartesian2, Viewer, defined, PolygonGraphics, Material, MaterialAppearance, PolygonGeometry, GeometryInstance, Primitive, Matrix4 } from "cesium";
import { HZViewer } from "@hztx/core";
import { Button, ColorPicker, InputNumber, Switch } from "antd";


const Arrow = () => {

    useEffect(() => {
        const hz = new HZViewer('map');
        const { viewer }: { viewer: Viewer } = hz;

        viewer.camera.setView({
            destination: Cartesian3.fromDegrees(-100.0, 30.0, 10000)
        });

        const primitive = viewer.scene.primitives.add(new Primitive({
          geometryInstances: new GeometryInstance({
            geometry: new PolygonGeometry({
              polygonHierarchy: {
                positions: Cartesian3.fromDegreesArray([
                  -100.0, 30.0,
                  -90.0, 30.0,
                  -90.0, 40.0,
                  -100.0, 40.0
                ]),
                holes: []
              }
            }),
          }),
          // appearance : new MaterialAppearance({
          //   material : Material.fromType('Color'),
          //   faceForward : true
          // }),
          appearance: new MaterialAppearance({
            material: new Material({
              fabric: {
                  type: 'FadeMaterial',
                  uniforms: {
                      time: 0.0
                  },
                  source: `
                      uniform float time;
                      czm_material czm_getMaterial(czm_materialInput materialInput)
                      {
                          czm_material material = czm_getDefaultMaterial(materialInput);
                          float fade = smoothstep(0.0, 1.0, materialInput.st.y - time);
                          fade = max(fade, 0.01);
                          material.diffuse = vec3(1.0, 0.0, 0.0); // 红色
                          material.alpha = fade;
                          return material;
                      }
                  `
              }
            })
          }),
          asynchronous: false
        }))

      
      // 更新材质的时间参数
      let time = 0.0;
      viewer.scene.preUpdate.addEventListener(function() {
          time += 0.01; // 控制淡入淡出的速度
          if (time > 1.0) {
              time = 0.0; // 重置时间
          }
          primitive.appearance.material.uniforms.time = time;
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
              
              </div>
            </div>   
        </MapContainer>
    )
}

export default Arrow;
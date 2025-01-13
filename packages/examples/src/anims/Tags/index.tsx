import { useEffect, useState } from "react";
import MapContainer from "../../components/map-container";
import { CallbackProperty, Cartesian2, Cartesian3, Math as CMath, Color, HorizontalOrigin, Property, VerticalOrigin, Viewer } from "cesium";
import { HZViewer } from "@hztx/core";
import { Button } from "antd";
import { IPlayer } from "../../types";
import { pixel2Coordinates } from "../../utils";


const Tags = () => {
    useEffect(() => {
        const hz = new HZViewer('map');
        const { viewer }: { viewer: Viewer } = hz;

        const createPOI = (coordinate: number[], options: {
          imageUrl: string, offset: { x: number, y: number },
          width: number, height: number
        }) => {
          const position = Cartesian3.fromDegrees(...coordinate);
          const { imageUrl, offset, width, height } = options;
          // 创建POI点
          const poiEntity = viewer.entities.add({
              position: position,
              point: {
                  pixelSize: 10,
                  color: Color.RED,
              }
          });
        
          // 计算图片底部中心位置
          const offsetCoordinate = pixel2Coordinates(viewer, offset.x, offset.y)!;

          const imagePosition = Cartesian3.fromDegrees(coordinate[0] + offsetCoordinate.lng, coordinate[1] + offsetCoordinate.lat)
          // Cartesian3.add(position, Cartesian3.fromDegrees(offsetCoordinate.lng, offsetCoordinate.lat), new Cartesian3()); // 假设图片高度为150，底部中心位置为y偏移-75
      
          // 创建折线连接POI点和图片底部中心位置
          const lineEntity = viewer.entities.add({
              polyline: {
                  positions: [position, imagePosition],
                  width: 2,
                  material: Color.RED,
              }
          });
      
          // 创建canvas并绘制图片
          const createCanvasImage = (imageUrl: string, width: number, height: number) => {
              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              const context = canvas.getContext('2d')!;

              return new Promise((resolve) => {
                const image = new Image();
                image.src = imageUrl;
                image.onload = () => {
                    context?.drawImage(image, 0, 0, width, height);
                    // 在这里可以添加边框
                    context.strokeStyle = 'red';
                    context.lineWidth = 5;
                    context.strokeRect(0, 0, width, height);

                    resolve(canvas);
                };                  
              });
          };

          // 创建图片标签
          createCanvasImage(imageUrl, 200, 150).then((canvasImage: any) => {
            const billboardEntity = viewer.entities.add({
                position: imagePosition,
                billboard: {
                    image: canvasImage.toDataURL(), // 使用canvas的dataURL作为图像
                    width: 200,
                    height: 150,
                    verticalOrigin: VerticalOrigin.BOTTOM,
                    horizontalOrigin: HorizontalOrigin.CENTER,
                    // pixelOffset: new Cartesian2(0, -40),
                }
            });            
          });


          // const picOffset = pixel2Coordinates(viewer, width, height)
          // const leftBottom = [coordinate[0] - Math.abs(picOffset!.lng) / 2, coordinate[1]];
          // const rightTop =[coordinate[0] + Math.abs(picOffset!.lng) / 2, coordinate[1] + Math.abs(picOffset!.lat)];



          // const borderEntity = viewer.entities.add({
          //   polyline: {
          //     positions: [
          //       Cartesian3.fromDegrees(...leftBottom, 0),
          //       Cartesian3.fromDegrees(leftBottom[0], rightTop[1], 0),
          //       Cartesian3.fromDegrees(rightTop[0], rightTop[1], 0),
          //       Cartesian3.fromDegrees(rightTop[0], leftBottom[1], 0),
          //       Cartesian3.fromDegrees(leftBottom[0], leftBottom[1], 0),
          //     ],
          //     width: 2,
          //     material: Color.ORANGE,
          //   }
          // });
      
          return { poiEntity, lineEntity };
        };
        const coordinate = [104.167869626642999, 30.758956896017201];
        const imageUrl = 'assets/hangmu.png'; // 替换为你的图片路径
        const offset = { x: 50, y: -50 }; // 图片相对于POI点的偏移量 
        
        viewer.camera.setView({
          destination: Cartesian3.fromDegrees(...[104.167869626642999, 30.758956896017201], 2990000)
      });

        setTimeout(() => {
          createPOI(coordinate, { imageUrl, offset, width: 200, height: 150 });
        }, 2000);

        
  
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

export default Tags;
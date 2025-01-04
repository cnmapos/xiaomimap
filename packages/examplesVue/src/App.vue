<script setup lang="ts">
import { ESObjectsManager, ESPoi3D, ESPoi2D, ESGeoJson, ESTextLabel } from 'esobjs-xe2-plugin/dist-node/esobjs-xe2-plugin-main'
import universities from './assets/universities.json'
import chinaGeoJSON from './assets/geo/china.json'
import { wgs84togcj02, gcj02towgs84, bdTogcj } from './utils/proj.ts'
import useAni from './utils/ani';
import { onMounted } from 'vue';

const animator = useAni();


onMounted(() => {

  const scale = 100;


  const objm = new ESObjectsManager();

  console.log(objm);

  const viewer = objm.createCesiumViewer({
      domid: document.getElementById("map"),
  });
  window._camera = () => {
    console.log('camera', viewer.getCurrentCameraInfo());
  }

  viewer.flyIn(
          [106.88372805900697, 38.81695588818832, 4891396.990086554],
          [353.70728749702084, -89.88530092369982, 0],
          0
        );

  viewer.statusChanged.don((status) => {
    if (status == "Created") {
      // 视口创建完成，飞到初始视角位置
      // createPOIObject({ name: '清华大学', mode: 'diamond', position: [116.308843, 39.998655, 0], scale: [scale, scale, scale] });
      // createPOIObject({ name: '北京大学', mode: 'diamond', position: [116.303525, 39.990555, 0], scale: [scale, scale, scale] });
    
      animator.push(() => {
        viewer.flyIn(
          [116.33588875482987, 39.941093945712296, 4323.676844318465],
          [356.36544486722113, -52.815392078211765, 359.9999999781475],
          2
        );
      }, 2000);
    
      let universityObjects;
      animator.push(() => {
        universityObjects = universities.filter((u) => u.province == '北京市' && u['985']).map((u) => {
          return create2DPOIObject({
            name: u.name,
            position: [...bdTogcj(u.location.lng, u.location.lat), 0],
            mode: u['985'] ? "P3D02" : "P3D06"
          })
          // createPOIObject({ name: u.name, mode: 'diamond', position: [...bdTogcj(u.location.lng, u.location.lat), 0], scale: [50, 50, 50] });
        });
      }, 3000);

      animator.push(() => {
        universityObjects?.forEach((o) => objm.destroySceneObject(o));
        createPolygon(chinaGeoJSON.features.find(f => f.properties.code === 110000), { fill: [1, 0, 0, 0.4], label: `北京 985/211: 26所` })

        viewer.flyIn(
          [116.50163602382834, 38.981336091218616, 123445.73977153386],
          [356.3654527984825, -52.815297355313355, 359.999990022902],
          2
        );
      }, 3000);

      animator.push(() => {
        createPolygon(chinaGeoJSON.features.find(f => f.properties.code === 610000), { fill: [1, 0, 0, 0.4], label: `陕西 985/211: 8所` })

        viewer.flyIn(
          [109.76030136941728, 34.022895563354105, 798983.4121959322],
          [357.1940703559808, -89.82535062809181, 0],
          2
        );
      }, 3000);

      animator.push(() => {
        createPolygon(chinaGeoJSON.features.find(f => f.properties.code === 420000), { fill: [1, 0, 0, 0.4], label: `湖北 985/211: 7所` })

        viewer.flyIn(
          [
              112.61559483358998,
              30.822383227497568,
              650085.4727653124
          ],
          [
              357.19407022276266,
              -89.82446104769933,
              0
          ],
          2
        );
      }, 3000);

        // 四川
        animator.push(() => {
        createPolygon(chinaGeoJSON.features.find(f => f.properties.code === 510000), { fill: [1, 0, 0, 0.4], label: `四川 985/211: 5所` })

        viewer.flyIn(
          [103.68819984341819, 31.311333519046233, 1393462.7166416429],
          [357.1940710821696, -89.83028112714035, 0],
          2
        );
      }, 3000);

      animator.push(() => {
        createPolygon(chinaGeoJSON.features.find(f => f.properties.code === 430000), { fill: [1, 0, 0, 0.4], label: `湖南 985/211: 4所` })

        viewer.flyIn(
          [112.86511625842996, 25.69889555656392, 807315.1691143189],
          [357.1940733485599, -89.84668345242986, 0],
          2
        );
      }, 3000);


      animator.push(() => {
        createPolygon(chinaGeoJSON.features.find(f => f.properties.code === 500000), { fill: [1, 0, 0, 0.4], label: `重庆 985/211: 2所` })

        viewer.flyIn(
          [107.5903444667317, 24.85035343905795, 1330648.6967936214],
          [357.1940732229311, -89.84572793047943, 0],
          2
        );
      }, 3000);

      animator.push(() => {
        viewer.flyIn(
          [108.59458810688076, 31.940207624394997, 1215843.2675604844],
          [357.1940706790397, -89.82752369297637, 0],
          2
        );
      }, 1000);

      // animator.play();
    }
  });
  viewer.ionAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZmQzMDI1OC1kMWYyLTQ1ZjEtYTJmNS0yMjY1ZDcxZjEyOTkiLCJpZCI6NjQ3MTgsImlhdCI6MTYyOTQzNDM5M30.m8vkzG05QiAfe6JQ0XPK8z_6KuUVMf_CoSY-YlMnAIg"

  const imageryLayer = objm.createSceneObjectFromJson({
              "id": "caa2f9ad-f80c-4989-bd32-e666981d67fe",
              "type": "ESImageryLayer",
              "url": "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
              "zIndex": 2,
              // "czmTilingScheme": "ToWGS84WebMercatorTilingScheme",
              "name": "高德影像",
              "allowPicking": false,
              "maximumLevel": 18
          });
  // objm.createSceneObjectFromJson({
    //https://webst01.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}
  // "id": "caa2f9ad-f80c-4989-bd32-e666981d67fe",
  //             "type": "ESImageryLayer",
  //             "url": "https://webst01.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}",
  //             "zIndex": 3,
  //             "czmTilingScheme": "ToWGS84WebMercatorTilingScheme",
  //             "name": "高德路网",
  //             "allowPicking": false,
  //             "maximumLevel": 15
  // })



  function createPOIObject({ name, mode, position, scale }) {
    const sceneObject = objm.createSceneObjectFromJson({
      type: 'ESPoi3D',
      position,
      mode,
      style: {
        FX_Color: [0, 1, 0, 1],
        UI_Color: [0, 1, 0, 1],
      },
      name,
      scale,
    })
  }

  function create2DPOIObject({ mode, name, position }) {
    const sceneObject = objm.createSceneObject(ESPoi2D)
    if (!sceneObject) return null
    sceneObject.position = position
    sceneObject.sizeByContent = false
    sceneObject.size = [32, 32]
    // 设置不同样式
    sceneObject.mode = mode
    // 开启编辑模式
    sceneObject.editing = false
    // 设置显示文本名称
    sceneObject.name = name

    return sceneObject;
  }

  // function createGeoJSONObject(data) {
  //   const sceneObject = objm.createSceneObject(ESGeoJson);
  //         window.sceneObject = sceneObject;

  //         // url可以填写服务地址，也可以填写具体的data数据（如上所示）
  //         sceneObject.url = data
  //         // 额外存储属性
  //         sceneObject.extras = data
  //         // 线贴地
  //         sceneObject.strokeGround = true
  //         // 线尺寸大小
  //         sceneObject.strokeWidth = 5
  //         // 被拾取
  //         sceneObject.pickedEvent.don((e) => {
  //             const name = e.childPickedInfo.properties.name;
  //             const attachedInfo = PickedInfo.getFinalAttachedInfo(e)
  //             switch (attachedInfo.viewersPickingPointerEventFuncType[0]) {
  //                 case 'click':
  //                     alert("点击拾取:" + name)
  //                     break;
  //                 case "pointerHover":
  //                     alert("悬浮拾取:" + name)
  //                     break;
  //                 default:
  //                     break;
  //             }
  //         })
  // }

  function createPolygon(featureData, options: { label: boolean; fill: number[] }) {
    const { fill = [1, 1, 1, 0.5], label = false } = options || {};
    const geometry = featureData.geometry;
    const points = geometry.type === 'MultiPolygon' ? geometry.coordinates[0][0] : geometry.coordinates;
    const sceneObject = objm.createSceneObjectFromJson({
      "type": "ESGeoPolygon",
      "name": featureData.properties.name,
      "collision": false,
      "allowPicking": false,
      "filled": true,
      "fillStyle": {
          "color": options.fill,
          "material": "",
          "materialParams": {},
          "ground": false
      },
      stroked: true,
      strokeWidth: 5,
      points: points.map((p)=> [...p, 0]),
    });
    if (label) {
      objm.createSceneObjectFromJson({
        "type": "ESTextLabel",
        "text": label,
        "size": [100, 100],
        "position": [...featureData.properties.center, 0],
          "anchor": [0.5, 0.5],
          "sizeByContent": true,
          "renderMode": 0,
          "rotationType": 1,
          "backgroundColor": [0, 0, 0, 0],
          "borderColor": [1, 1, 1, 1],
          "borderWidth": 2, 
          "fontSize": 18
      });
    }
  }

})

</script>

<template>
  <div class="container">
    <div id="map" class="map">
    </div>  
    <div class="control">
      <button @click="animator.play()">播放</button>
    </div>  
  </div>

</template>

<style lang="less" scoped>
.container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: row;

  .map {
    height: 100%;
    width: calc(100vh * 9 / 16)
  }

  .control {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

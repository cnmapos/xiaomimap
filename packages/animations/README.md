## AnimationController 动画控制器

管理所有动画轨道

## xxxAnimationTarget 动画对象

xxxAnimationTarget这种命名的都是各种动画类型，接收一个点线面或图片等要素、对这些要素进行加工使其支持动画

- CameraAnimationTarget 是相机动画类
- PointHaloAnimationTarget 是点光晕动画类
- ...

## AnimationTrack 动画轨道

用来管理 keyframe，它通过addKeyframe方法来设定什么时间开始执行某个帧。

// 通过一个简单的例子我们能知道他是怎么串起来的

```js
// 实现一个简单动画，从全球场景飞到成都市
const aniCtr = new AnimationController();
const cameraTarget = new CameraAnimationTarget(viewer.camera); // 创建相机动画对象
const track1 = new AnimationTrack(cameraTarget, { // 相机动画对象加入特定动画轨道，该动画轨道指定了对应的插值函数，这里是相机动画、所以给的相机的插值函数
    interpolationFn: cameraFlyInterpolate,
});

track1.addKeyframe(1000, { // 1s钟时的相机坐标
    position: [-75.4204237390705, 33.85698238168112, 8567977.849840268],
    direction: [5.088887, -89.9190563526215],
});
track1.addKeyframe(2000, { // 2s钟时的相机坐标
    position: [104.15175065097104, 30.71616947969781, 9986.025086346157],
    direction: [0, -45.000137765029564],
});

const primitive = createCirclePrimitive(
    [104.167869626642999, 30.758956896017201, 10000],
    { radius: 10000, color: '#0F0' }
);
const circleTarget = new PointHaloAnimationTarget(primitive); // 创建光晕动画对象
viewer.scene.primitives.add(circleTarget.innerPrimitive);
viewer.scene.primitives.add(circleTarget.outPrimitive);
const track2 = new AnimationTrack(circleTarget); // 将光晕动画对象加入动画轨道
track2.addKeyframe(3000, 0, { repeat: true, duration: 1500 }); // 设置光晕动画的动画帧，3s钟时起始值为0
track2.addKeyframe(4000 * 20, 1); // 持续运行4 * 20 秒后消失

const primitive2 = createCirclePrimitive(
    [104.267869626642999, 30.759956896017201, 10000],
    { radius: 10000, color: '#F00' }
);
const circleTarget2 = new PointHaloAnimationTarget(primitive2);
viewer.scene.primitives.add(circleTarget2.innerPrimitive);
viewer.scene.primitives.add(circleTarget2.outPrimitive);
const track3 = new AnimationTrack(circleTarget2);
track3.addKeyframe(3500, 0, { repeat: true, duration: 1500 });
track3.addKeyframe(4000 * 20, 1);

aniCtr.addTrack(track1);
aniCtr.addTrack(track2);
aniCtr.addTrack(track3);
```

需求：根据后端数据表结构、把数据转换后存储到数据库、并且能从数据库中读出来、重新组装成可执行的动画代码

注意点：

1. 动画库有自己的标准、需要制定一套标准数据、使其能够导出和导入
   1. 输出模块
   2. 导入模块
2. 纯数据驱动、完全由json去驱动
3. 资源如何更新和引用？引用的几何图形、图片、音频等，是否需要在本模块中考虑？还是认为这些是外界处理好了给我的？[需要根据UI交互去决定]
4. 热更新需要考虑么？
   1. 关键帧做了修改、比如删除了xx或者改了时长等。动画要从头放么？还得支持从特定时间开始播放把？

考虑的点：

1. 获取接口、需要哪些接口？格式是什么？
2. 接口数据如何加工成动画代码
3. 前端操作过程中、如何关联新增的资源、动画属性的变更、样式属性的变更、最后解析成json给后端？




第一步、定义格式、后端会提供怎样的数据，后端提供数据肯定是以 图层为维度返回的、不同的图层里头包含了不同的项目素材、并控制了素材的一些基础属性、例如可见、锁定等。
对渲染模块来说、他不关心你的图层有多少层、只接收 素材、素材是一个支持动画的要素描述对象。详细介绍了我这个要素在哪、渲染的样式(包含外部资源)、以及动画帧
```ts
type Asset = {
    
}

```



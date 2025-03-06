{
    // 图层、一个图层可以包含多个要素、对应timeline编辑器里面的图层
    tracks: [
        {
            // 图层配置
            id: 'trackId1',
            type: 'geometry', // 图层的类型、比如是文字图层、形态类图层，他们应该有一些共性才会放在一个图层（暂定就是某同一类元素可以支持放一个图层里）
            visible: true, // 图层是否可见，用于统一控制图层内所有元素的显示隐藏
            voice: false, // 是否打开声音开关
            lock: false,
            startTime: 1000,
            endTime: 9000,
            
            // 轨道中待渲染的要素数组
            assets: [
                // 普通点要素, 不带任何动画效果的配置
                {
                    id: 'asset1',
                    type: 'point',
                    position: [104.06, 30.67],
                    // 点要素的基础style、该style与动画无关、纯静态的，不同要素有不同的基本样式、TODO：待定义
                    style: {
                        pixelSize: 4, // 点像素大小
                        color: 'rgba(255, 0, 0, 0.5)', // 颜色支持透明度
                        outlineColor: 'blue',
                        outlineWidth: 10,
                    },
                    // 该要素的生命周期
                    lifecycle: {
                        startTime: 1000,
                        endTime: 4000,
                    }
                },
                
                // 普通点要素, 带光晕动画效果的配置
                {
                    id: 'asset2',
                    type: 'point',
                    position: [105.06, 30.67],
                    // 点要素的基础style、该style与动画无关、纯静态的，不同要素有不同的基本样式、TODO：待定义
                    style: {
                        pixelSize: 4, // 点像素大小
                        color: 'rgba(255, 0, 0, 0.5)', // 颜色支持透明度
                        outlineColor: 'blue',
                        outlineWidth: 10,
                    },
                    // 该要素的生命周期
                    lifecycle: {
                        startTime: 1000,
                        endTime: 4000,
                    },
                    
                    // 动画特效相关配置, 一个要素可以支持多个动画，每个动画可以是不同的效果，比如同事拥有淡入淡出+循环光晕
                    animations: [
                        // 淡入效果
                        {
                            type: 'FadeIn', // 动画类型，淡入
                            category: 'enter', // 入场动画， exit 出场动画
                            keyFrames: [ // 暂定默认就是两个keyframe，代表开始和结束
                                {
                                    "time": 0,
                                    "value": 0,
                                },
                                {
                                    "time": 1000,
                                    "value": 1
                                }
                            ]
                        },
                        
                        // 光晕效果
                        {
                            type: 'HaloPoint', // 动画类型，光晕类型
                            category: 'repeat', // 循环动画
                            config: { // 动画的通用配置字段、可为空，根据动画类型自行决定
                                // 光晕动画的相关样式配置，编辑动画样式时、只影响动画的style，不允许影响基础style
                                style: {
                                    power: 1, // 光晕强度
                                    radius: 0.0, // 初始圆半径
                                },
                                duration: 1000, // 动画重复周期，控制动画快慢
                            },
                            // 动画帧配置
                            keyframes: [
                                {
                                    "time": 1000, // 第一帧开始时间
                                    "value": 0, // 属性初始值
                                },
                                {
                                    "time": 5000, // 动画结束时间
                                    "value": 1 // 最终的属性值
                                }
                            ]
                        }
                    ]
                },
            ]
        }
    ]
}
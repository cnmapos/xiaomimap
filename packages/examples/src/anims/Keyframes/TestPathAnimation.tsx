import {
    AnimationController2,
    AnimationTrack2,
    PathAnimationTarget,
} from '@hztx/animations';

import { Cartesian3, Coordinate, createViewer, IViewer, LineEntity, ModelEntity } from '@hztx/core';
import React, { useEffect, useRef } from 'react';
import MapContainer from '../../components/map-container';
import { Button } from 'antd';

const longMarchPath = [
    {
        time: '1934年10月10日',
        position: [115.904349, 25.845237],
        address: '江西瑞金',
        event: '长征开始，中央红军从瑞金出发',
    },
    {
        time: '1934年10月21-25日',
        position: [115.099366, 25.329945],
        address: '江西信丰',
        event: '突破第一道封锁线',
    },
    {
        time: '1934年11月5-8日',
        position: [113.685193, 25.533024],
        address: '湖南汝城',
        event: '突破第二道封锁线',
    },
    {
        time: '1934年11月13-15日',
        position: [112.948806, 25.40059],
        address: '湖南宜章',
        event: '突破第三道封锁线',
    },
    {
        time: '1934年11月27日-12月1日',
        position: [111.087089, 25.94939],
        address: '广西全州、兴安、灌阳',
        event: '湘江战役',
    },
    {
        time: '1934年12月12日',
        position: [109.630772, 26.317333],
        address: '湖南通道',
        event: '通道转兵',
    },
    {
        time: '1934年12月18日',
        position: [109.125826, 26.213304],
        address: '贵州黎平',
        event: '黎平会议',
        desc: '中共中央政治局在此召开会议，正式决定向以遵义为中心的川黔边地区进军。',
    },
    {
        time: '1934年12月31日-1935年1月1日',
        position: [107.571343, 27.180832],
        address: '贵州瓮安',
        event: '猴场会议',
        desc: '重申黎平会议决议，作出《关于渡江后新的行动方针的决定》。',
    },
    {
        time: '1935年1月15-17日',
        position: [106.92141, 27.688997],
        address: '贵州遵义',
        event: '遵义会议',
        desc: '中共中央政治局扩大会议在此召开，确立了以毛泽东为代表的新的中央的正确领导。',
    },
    {
        time: '1935年1月29日-3月22日',
        position: [106.378708, 27.86251],
        address: '赤水河',
        event: '四渡赤水',
        desc: '四渡赤水，进军云南。',
    },
    {
        time: '1935年5月3-9日',
        position: [102.453347, 26.126096],
        address: '云南皎平渡',
        event: '巧渡金沙江',
        desc: '红军主力靠7条小船，经过7天7夜，从皎平渡全部渡过金沙江，摆脱几十万国民党军围追堵截。',
    },
    {
        time: '1935年5月25日',
        position: [102.284759, 29.270555],
        address: '四川安顺场',
        event: '强渡大渡河',
        desc: '红1军团第1师第1团在安顺场强渡大渡河成功。',
    },
    {
        time: '1935年5月29日',
        position: [102.229605, 29.912086],
        address: '四川泸定桥',
        event: '飞夺泸定桥',
        desc: '红4团一昼夜奔袭240里，22勇士踏索夺桥。',
    },
    {
        time: '1935年6月12日',
        position: [102.684935, 30.857062],
        address: '四川夹金山',
        event: '翻越雪山',
        desc: '中央红军开始翻越第一座雪山夹金山。',
    },
    {
        time: '1935年6月18日',
        position: [102.638725, 30.96192],
        address: '四川懋功达维镇',
        event: '懋功会师',
        desc: '红一方面军与红四方面军在懋功会师。',
    },
    {
        time: '1935年6月26日',
        position: [102.49416, 31.483027],
        address: '四川两河口',
        event: '两河口会议',
        desc: '中共中央政治局在此召开会议，确定了北上建立川陕甘根据地的战略方针。',
    },
    {
        time: '1935年8月20日',
        position: [103.065554, 32.598585],
        address: '四川毛儿盖',
        event: '毛儿盖会议',
        desc: '中央政治局在毛儿盖召开会议，决定红军主力向洮河以东发展。',
    },
    {
        time: '1935年8月下旬-9月上旬',
        position: [103.712165, 32.423573],
        address: '松潘草地',
        event: '过草地',
        desc: '红军穿越松潘草地，面临饥饿、寒冷、沼泽等困难，减员严重。',
    },
    {
        time: '1935年9月12日',
        position: [103.316688, 33.875509],
        address: '甘肃迭部县高吉村',
        event: '俄界会议',
        desc: '中共中央政治局召开紧急扩大会议，作出《关于张国焘同志的错误的决定》。',
    },
    {
        time: '1935年9月17日',
        position: [103.924248, 34.133788],
        address: '甘肃迭部县腊子口',
        event: '突破腊子口',
        desc: '红军攻克天险腊子口，打开了进入甘肃的通道。',
    },
    {
        time: '1935年9月27日',
        position: [104.939208, 35.032929],
        address: '甘肃通渭榜罗镇',
        event: '榜罗镇会议',
        desc: '中共中央政治局在榜罗镇召开会议，正式决定以陕北作为领导中国革命的大本营。',
    },
    {
        time: '1935年10月19日',
        position: [108.198664, 36.906852],
        address: '陕西吴起镇',
        event: '吴起镇会师',
        desc: '中央红军到达吴起镇，与陕北红军会师，红一方面军长征结束。',
    },
];

const positions: Coordinate[] = longMarchPath.map((item) => item.position);

function TestPathAnimation() {
    const context = useRef<{ viewer: IViewer }>({
        viewer: null,
    });
    let aniCtr = useRef<AnimationController2>();
    useEffect(() => {
        context.current.viewer = createViewer('map', {
            key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YjliYjIwYi0zMWE0LTQ4MTgtYWU4NC0wNWZmNTFmZjVhYmMiLCJpZCI6MjY1NzYxLCJpYXQiOjE3MzU1NzA3MTl9.BOJDK-WqsLV-QcQhbnAEf-wG1mtkftG1BYV6JIv0VoI',
        });

        aniCtr.current = new AnimationController2([]);

        init()

        return () => {
            context.current.viewer?.destroy();
        };
    }, []);

    // 初始化
    const init = () => {
        if (aniCtr.current) {
            const track = new AnimationTrack2(context.current.viewer, []);
            aniCtr.current.addTrack(track);

            // 创建基础线实体
            const lineEty = new LineEntity({ positions: positions });
            context.current.viewer.addEntity(lineEty);


            //  ----->
            // [   start,     start + startDelay,   start + startDelay + duration,    end ]
            //   插入viewer        开始动画                       执行动画               移除

            // 创建轨迹动画对象
            const pathAnimationTarget = new PathAnimationTarget({
                baseEntity: lineEty,
                isShowBaseEntity: true,
                start: 0,
                end: 15 * 1000,
                startDelay: 2000,
                endStay: 3000,

                startValue: positions[0],
                endValue: positions[positions.length - 1],

                model: {
                    uri: 'assets/models/people_run_2.glb', // 替换为实际模型路径
                    scale: 15000,
                    positions: positions[0],
                },
                onBefore: () => {
                    console.log('onBefore执行');
                },
                onAfter: () => {
                    console.log('onAfter执行');
                }
            });
            pathAnimationTarget.setStyle({
                width: 3,
                color: '#ff0000',
                outlineWidth: 1,
                outlineColor: '#00ff00'
            })
            // 新增动画对象到图层里
            track.add(pathAnimationTarget);
        }


    }

    function play() {
        aniCtr.current && aniCtr.current.play();
    }

    function pause() {
        aniCtr.current && aniCtr.current.pause();
    }

    function replay() {
        aniCtr.current && aniCtr.current.reset();
        play();
    }

    return (
        <MapContainer>
            <div style={{ width: '100%', height: '100%' }} id="map"></div>
            <div>
                <div className="hz-player">
                    <div>
                        <Button className="hz-btn" onClick={play}>
                            播放
                        </Button>
                        <Button className="hz-btn" onClick={pause}>
                            暂停
                        </Button>
                        <Button className="hz-btn" onClick={replay}>
                            重新播放
                        </Button>
                    </div>
                </div>
                <div className="hz-style"></div>
            </div>
        </MapContainer>
    );
}

export default TestPathAnimation;

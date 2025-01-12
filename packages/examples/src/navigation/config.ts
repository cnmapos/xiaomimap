import NewMap from '../starts/NewMap'
import AniPath from '../anims/Path'
import CircleHalo from '../anims/CircleHalo'
import TextAnim from '../anims/TextAnim'
import Arrow from '../anims/Arrow'
import Polygon from '../anims/Polygon'
import Glow from '../anims/Glow'
import Video from '../anims/Video'

export default [
    {
        name: '快速开始',
        children: [
            {
                name: '创建地图',
                path: '/new-map',
                thumbnail: 'XXXXXXX',
                element: NewMap
            },
        ]
    },
    {
        name: '动画',
        children: [
            {
                name: '路径动画',
                path: '/ani-path',
                thumbnail: 'XXXXXXX',
                element: AniPath
            },
            {
                name: '圆光环动画',
                path: '/circle-halo',
                thumbnail: 'XXXXXXX',
                element: CircleHalo
            },
            {
                name: '文字动画',
                path: '/text-anim',
                thumbnail: 'XXXXXXX',
                element: TextAnim
            },
            {
                name: '箭头动画',
                path: '/arrow-anim',
                thumbnail: 'XXXXXXX',
                element: Arrow
            },
            {
                name: '多边形动画',
                path: '/polygon-anim',
                thumbnail: 'XXXXXXX',
                element: Polygon
            },
            {
                name: '发光动画',
                path: '/glow-anim',
                thumbnail: 'XXXXXXX',
                element: Glow
            },
            {
                name: '视频动画',
                path: '/video-anim',
                thumbnail: 'XXXXXXX',
                element: Video
            },
        ]
    }
]

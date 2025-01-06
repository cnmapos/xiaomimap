import NewMap from '../starts/NewMap'
import AniPath from '../anims/Path'
import CircleHalo from '../anims/CircleHalo'

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
            }
        ]
    }
]

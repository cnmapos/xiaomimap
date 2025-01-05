import NewMap from '../starts/NewMap'
import AniPath from '../anims/Path'

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
            }
        ]
    }
]

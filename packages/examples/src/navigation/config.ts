import NewMap from '../starts/NewMap';
import AniPath from '../anims/Path';
import CircleHalo from '../anims/CircleHalo';
import TextAnim from '../anims/TextAnim';
import Arrow from '../anims/Arrow';
import Polygon from '../anims/Polygon';
import Glow from '../anims/Glow';
import Video from '../anims/Video/IndexWithCcapture';
import Tags from '../anims/ImageTag';
import TextTag from '../anims/TextTag';
import WelcomeToChina from '../anims/WelcomeToChina';
import Bomb from '../anims/Bomb';
import Gif from '../anims/Gif';
import CircleHaloV2 from '../anims/CircleHaloV2';
import Map2D from '../anims/ChinaFull';
import KeyFrame from '../anims/Keyframes';
import PointRoamingKeyFrame from '../anims/Keyframes/trace';
import Flight from '../anims/Keyframes/flight';
import PolygonKeyframe from '../anims/Keyframes/polygon';
import HaloKeyframe from '../anims/Keyframes/Halo';
import TopTravel from '../anims/Keyframes/travelTop';
import TextKeyframe from '../anims/Keyframes/text';
import Terrain from '../anims/Keyframes/terrian';
import Editor from '../editors/editor';
import Model3D from '../editors/model';
import TheLongMarch from '../anims/Keyframes/theLongMarch';
import BalllisticMissiles from '../anims/Keyframes/ballisticMissiles';
import BallisticMissilesGD from '../anims/Keyframes/ballisticMissilesGD';
import Cycling from '../anims/Keyframes/cycling';
import { PathAnimationPanel } from '../components/path-animation-panel';
import TrainCDToHK from '../anims/Keyframes/trains/CDToHK';

export default [
  {
    name: '快速开始',
    children: [
      {
        name: '创建地图',
        path: '/new-map',
        thumbnail: 'XXXXXXX',
        element: NewMap,
      },
    ],
  },
  {
    name: '动画',
    children: [
      {
        name: '路径动画',
        path: '/ani-path',
        thumbnail: 'XXXXXXX',
        element: AniPath,
      },
      {
        name: '圆光环动画',
        path: '/circle-halo',
        thumbnail: 'XXXXXXX',
        element: CircleHalo,
      },
      {
        name: '圆光环动画V2',
        path: '/circle-halo2',
        thumbnail: 'XXXXXXX',
        element: CircleHaloV2,
      },
      {
        name: '文字动画',
        path: '/text-anim',
        thumbnail: 'XXXXXXX',
        element: TextAnim,
      },
      {
        name: '箭头动画',
        path: '/arrow-anim',
        thumbnail: 'XXXXXXX',
        element: Arrow,
      },
      {
        name: '多边形动画',
        path: '/polygon-anim',
        thumbnail: 'XXXXXXX',
        element: Polygon,
      },
      {
        name: '发光动画',
        path: '/glow-anim',
        thumbnail: 'XXXXXXX',
        element: Glow,
      },
      {
        name: '视频动画',
        path: '/video-anim',
        thumbnail: 'XXXXXXX',
        element: Video,
      },
      {
        name: '元素标签',
        path: '/tags-anim',
        thumbnail: 'XXXXXXX',
        element: Tags,
      },
      {
        name: '文字标签',
        path: '/text-tags',
        thumbnail: 'XXXXXXX',
        element: TextTag,
      },
      {
        name: '欢迎来到中国',
        path: '/welcome-to-china',
        thumbnail: 'XXXXXXX',
        element: WelcomeToChina,
      },
      {
        name: '炸弹动画',
        path: '/bomb-anim',
        thumbnail: 'XXXXXXX',
        element: Bomb,
      },
      {
        name: 'Gif动画',
        path: '/gif-anim',
        thumbnail: 'XXXXXXX',
        element: Gif,
      },
      {
        name: '2D地图',
        path: '/map2d',
        thumbnail: 'XXXXXXX',
        element: Map2D,
      },
    ],
  },
  {
    name: '关键帧',
    children: [
      {
        name: '关键帧动画',
        path: '/keyframe-anim',
        thumbnail: 'XXXXXXX',
        element: KeyFrame,
      },
      {
        name: '轨迹动画',
        path: '/keyframe-roaming',
        thumbnail: 'XXXXXXX',
        element: PointRoamingKeyFrame,
      },
      {
        name: '文字关键帧【北京各区】',
        path: 'keyframe-text',
        thumbnail: 'XXXXXX',
        element: TextKeyframe,
      },
      {
        name: '航空轨迹',
        path: '/keyframe-flight',
        thumbnail: 'XXXXXXX',
        element: Flight,
      },
      {
        name: '多边形关键帧',
        path: '/keyframe-polygon',
        thumbnail: 'XXXXXXX',
        element: PolygonKeyframe,
      },
      {
        name: '光晕关键帧',
        path: '/keyframe-halo',
        thumbnail: 'XXXXXXX',
        element: HaloKeyframe,
      },
      {
        name: '热门旅游城市',
        path: '/keyframe-toptravel',
        thumbnail: 'XXXXXXX',
        element: TopTravel,
      },
      {
        name: '地形图',
        path: '/keyframe-terrain',
        thumbnail: 'XXXXXXX',
        element: Terrain,
      },
      {
        name: '长征系列',
        path: '/keyframe-longmarch',
        thumbnail: 'XXXXXXX',
        element: TheLongMarch,
      },
      {
        name: '弹道导弹',
        path: '/keyframe-ballisticmissiles',
        thumbnail: 'XXXXXXX',
        element: BalllisticMissiles,
      },
      {
        name: '广岛原子弹投放',
        path: '/keyframe-ballisticmissilesgd',
        thumbnail: 'XXXXXXX',
        element: BallisticMissilesGD,
      },
      {
        name: '骑行轨迹',
        path: '/keyframe-cycling',
        thumbnail: 'XXXXXXX',
        element: Cycling,
      },
      {
        name: '高铁轨迹:成都到香港',
        path: '/keyframe-train',
        thumbnail: 'XXXXXXX',
        element: TrainCDToHK,
      },
    ],
  },
  {
    name: '编辑',
    children: [
      {
        name: '矢量编辑',
        path: '/vector-edit',
        thumbnail: 'XXXXXXX',
        element: Editor,
      },
      {
        name: '3D模型',
        path: '/model-edit',
        thumbnail: 'XXXXXXX',
        element: Model3D,
      },
      {
        name: '轨迹动画配置面板',
        path: '/path-config-panel',
        thumbnail: 'XXXXXXX',
        element: PathAnimationPanel,
      },
    ],
  },
];

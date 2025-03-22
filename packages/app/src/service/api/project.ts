import axios from '@/service/axiosConfig';
import { ApiResGeometryType } from '@/typings/map';

export interface IGeometryAssetType {
  category: number;
  geoData: string;
  geometryType: keyof typeof ApiResGeometryType;
  geometryName: string;
  geometryId: number;
  geometryJson: null | {
    [key: string]: any;
  };
}
export interface IProjectItemType {
  assetId: number;
  assetName: string;
  assetType: number;
  comment: string;
  createTime: string;
  filePath: string;
}
// 创建项目信息
export const createProject = async (params: {
  projectName: string;
  comment?: string;
  duration?: string;
  screenRatio: string;
  remark?: string;
}) => {
  const res =  await axios({
    url: '/hz-project/create',
    method: 'post',
    data: params
  });
  return res.data;

}

export const getProjectList = async (params: {
  projectName?: string;
  comment?: string;
  pageSize: number;
  current: number;
}) => {
  const res = await axios({
    url: '/hz-project/list',
    method: 'post',
    data: params
  });
  return res.data?.data;
}


// 删除动画图层
export const deleteAimLayer = async (params: {
  aimLayerIdList: number[];

}) => {
  const res = await axios({
    url: '/hz-project/deleteAimLayer',
    method: 'post',
    data: params
  });
  return res.data;
}
// 保存项目素材 图片 音频 视频 几何对象
export const saveProjectAsset = async (params: {
  imageList?: any[];
  videoList?: any[];
  audioList?: any[];
  geometryList?: {
    geometryId?: number;
    geometryName?: string;
    projectId?: number;
    // 枚举值：'point'-点/标注, 'linestring'-线串, polygon-多边形,'multi_point'-多点, 'multi_linestring'-多线串, 'multi_polygon'-多边形集合, 'geometry_collection'-几何集合（'broken_line'-折线, circular-圆，ellipse-椭圆，sector-扇形，curve-曲线，rectangle-矩形，curved_surface-曲面）
    geometryType?: string;
    // wkt格式
    geoData?: string;
    // 一些扩展信息
    geometryJson?: string;
    // 1：系统素材、2：用户上传素材
    category?: number;
    comment?: string;
    updateUserId?: number;
    parentId?: number;
  }[];
}) => {
  const res = await axios({
    url: '/hz-project/saveProjectAsset',
    method: 'post',
    data: params
  });
  return res.data;
};

// 项目素材列表
export const listProjectAsset = async (params: {
  current?: number;
  pageSize?: number;
  projectId: number;
  // （1:图片、2:音频、3:视频、4:几何对象）
  assetType?: number;
  assetName?: string;
  uploadTimeStart?: string;
  uploadTimeEnd?: string;
  userId: number;
}): Promise<API.BaseRes<{
  records: IProjectItemType[];
  page: number;
  total: number;
  current: number;
}>> => {
  const res = await axios({
    url: '/hz-project/listProjectAsset',
    method: 'post',
    data: params
  });
  return res.data;
}


// 项目几何对象列表
export const listProjectGeometry = async (params: {
  projectId: number;
  // 几何对象中文名
  geometryName?: number;
  // 枚举值：'point'-点/标注, 'linestring'-线串, polygon-多边形,'multi_point'-多点, 'multi_linestring'-多线串, 'multi_polygon'-多边形集合, 'geometry_collection'-几何集合（'broken_line'-折线, circular-圆，ellipse-椭圆，sector-扇形，curve-曲线，rectangle-矩形，curved_surface-曲面
  geometryType?: string;
  // 1：系统素材、2：用户上传素材
  category: number;
  
}): Promise<API.BaseRes<IGeometryAssetType[]>> => {
  const res = await axios({
    url: '/hz-project/listProjectGeometry',
    method: 'post',
    data: params
  });
  return {
    ...res.data,
    data: res.data.data.map((t: any) => {
      return {
        ...t,
        geometryJson: JSON.parse(t.geometryJson || "{}")
      }
    })
  };
}

// 删除项目素材(图片、音频、视频、几何对象)
export const deleteProjectAsset = async (params: {
  assetId: number;
  // （1:图片、2:音频、3:视频、4:几何对象）
  assetType: number;
}[]): Promise<API.BaseRes<boolean>> => {
  const res = await axios({
    url: 'hz-project/deleteProjectAsset',
    method: 'post',
    data: {
      assetRelIdList: params
    }
  });
  return res.data;
}

//  合并几何对象
export const mergeGeometry = async (params: {
  geometryName: string;
  projectId: number;
  // 1：系统素材、2：用户上传素材
  category: number;
  comment?: string;
  geometryIds: number[];
}): Promise<API.BaseRes<IGeometryAssetType[]>> => {
  const res = await axios({
    url: '/hz-project/mergeGeometry',
    method: 'post',
    data: params
  });
  return res.data;
}

// 修改项目信息
export const updateProjectInfo = async (params: {
  projectId: number;
  projectName?: string;
  comment?: string;
  duration?: string;
  screenRatio?: string;
  remark?: string;
}) => {
  const res = await axios({
    url: '/hz-project/update',
    method: 'post',
    data: params
  });
  return res.data;
}

// 获取项目信息
export const getProjectInfo = async (projectId: number  ) => {
  const res = await axios({
    url: `/hz-project/${projectId}`,
    method: 'get',
  });
  return res.data;
}

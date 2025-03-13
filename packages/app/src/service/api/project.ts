import axios from '@/service/axiosConfig';



// 创建项目信息
export const createProject = (params: {
  projectName: string;
  comment?: string;
  duration?: string;
  screenRatio: string;
  remark?: string;
}) => {
  return axios({
    url: '/hz-project/create',
    method: 'post',
    data: params
  });
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
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

axios.defaults.timeout = 10000; // 10秒

// 请求拦截器
axios.interceptors.request.use(config => {
  const clientKey = localStorage.getItem('clientKey');
  if (clientKey) {
    config.headers['clientKey'] = clientKey;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 响应拦截器
axios.interceptors.response.use(response => {
  return response;
}, error => {
  return Promise.reject(error);
});

export default axios;